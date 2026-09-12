/**
 * Orquestrador de Tradução de Cartas via Gemini 2.5 Flash + Motor Determinístico.
 * Suporta o modo Bootstrap (--all) para re-tradução inicial de toda a base
 * e o modo Incremental (padrão no CI/CD) para tradução exclusiva de novas cartas.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadMasterCards, partitionCards, rootDir } from './lib/card_loader.js';
import { translateBatchWithGemini, getActiveModelName } from './lib/gemini_translator.js';
import { translateText } from './lib/translation_rules.js';

const BATCH_SIZE = 10;
const PAUSE_BETWEEN_BATCHES_MS = 5000;

function loadEnvFile() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;

  const envPath = path.join(rootDir, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/^GEMINI_API_KEY\s*=\s*(.+)$/m);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return '';
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function runTranslationPipeline() {
  const args = process.argv.slice(2);
  const isAll = args.includes('--all');
  const isDryRun = args.includes('--dry-run');
  const isVerbose = args.includes('--verbose') || args.includes('-v');

  let limit = Infinity;
  const limitIdx = args.indexOf('--limit');
  if (limitIdx !== -1 && args[limitIdx + 1]) {
    limit = parseInt(args[limitIdx + 1], 10);
  }

  let forceSet = null;
  const setIdx = args.indexOf('--force-set');
  if (setIdx !== -1 && args[setIdx + 1]) {
    forceSet = args[setIdx + 1].toUpperCase();
  }

  const apiKey = loadEnvFile();

  console.log('🤖 Iniciando Pipeline de Tradução de Cartas...');
  console.log(`📌 Modo: ${isAll || forceSet ? 'Forçado (--all ou --force-set)' : 'Fase 2 (Incremental / Delta)'}`);
  if (isDryRun) console.log('🔍 Modo Simulação (--dry-run) ativo.');
  if (limit !== Infinity) console.log(`⏱️ Limite configurado: ${limit} cartas.`);
  if (forceSet) console.log(`🎯 Filtrando apenas o conjunto: ${forceSet}`);
  if (apiKey) console.log('🔑 Chave de API do Gemini carregada com sucesso.');

  const allCards = loadMasterCards();
  if (!allCards || allCards.length === 0) {
    console.log('❌ Nenhuma carta encontrada em src/data/cards.json.');
    return;
  }

  // 1. Tratamento automático local para cartas sem efeito ("-")
  let vanillaCount = 0;
  for (const card of allCards) {
    const rawEffect = (card.effectEn || card.effect || '').trim();
    if (rawEffect === '-' || rawEffect === '') {
      if (!card.effectPt || card.effectPt !== '-') {
        card.effectPt = '-';
        vanillaCount++;
      }
    }
  }
  if (vanillaCount > 0) {
    console.log(`⚡ Ajustadas ${vanillaCount} cartas sem efeito ("-") localmente sem consumir API.`);
  }

  // 2. Filtragem de cartas com texto real para processar na IA
  let targetCards = allCards.filter((card) => {
    const rawEffect = (card.effectEn || card.effect || '').trim();
    const rawTrigger = (card.triggerEn || card.trigger || '').trim();

    // Se não tem texto em inglês nem efeito nem gatilho, ignora
    if ((!rawEffect || rawEffect === '-') && (!rawTrigger || rawTrigger === '-')) {
      return false;
    }

    if (forceSet && (card.setId || '').toUpperCase() !== forceSet) {
      return false;
    }

    // Se for --all OU se tiver --force-set, força a re-tradução do conjunto especificado
    if (isAll || forceSet) {
      return true;
    }

    // No modo incremental padrão, seleciona se não tiver effectPt ou se for igual ao inglês
    const needsTranslation =
      !card.effectPt ||
      card.effectPt.trim() === '' ||
      card.effectPt === card.effectEn ||
      card.effectPt === card.effect;

    return needsTranslation;
  });

  if (targetCards.length === 0) {
    console.log('✨ Nenhuma carta pendente de tradução. O catálogo está 100% atualizado!');
    if (vanillaCount > 0) {
      partitionCards(allCards);
    }
    return;
  }

  if (limit !== Infinity && targetCards.length > limit) {
    targetCards = targetCards.slice(0, limit);
  }

  console.log(`📦 Encontradas ${targetCards.length} cartas com efeito para traduzir.`);

  // Preparar os lotes
  const batches = [];
  for (let i = 0; i < targetCards.length; i += BATCH_SIZE) {
    batches.push(targetCards.slice(i, i + BATCH_SIZE));
  }

  console.log(`📊 Dividido em ${batches.length} lote(s) de até ${BATCH_SIZE} cartas cada.`);

  if (isDryRun) {
    console.log('🔍 Exemplo do primeiro lote que seria enviado ao Gemini:');
    console.log(
      JSON.stringify(
        batches[0].map((c) => ({
          code: c.code,
          nameEn: c.nameEn,
          effectEn: (c.effectEn || c.effect || '').slice(0, 80),
          ...(c.triggerEn || c.trigger ? { triggerEn: (c.triggerEn || c.trigger).slice(0, 80) } : {})
        })),
        null,
        2
      )
    );
    console.log('\n✅ Simulação concluída com sucesso (--dry-run). Nenhuma requisição consumida.');
    return;
  }

  // Verificar se há API Key para a IA
  if (!apiKey) {
    console.log('\n⚠️ GEMINI_API_KEY não foi encontrada nas variáveis de ambiente.');
    console.log('🔄 Executando fallback automático para o Motor Determinístico de Regras (translation_rules.js)...');

    let count = 0;
    for (const card of targetCards) {
      const rawEffect = card.effectEn || card.effect || '';
      const rawTrigger = card.triggerEn || card.trigger || '';
      card.effectPt = translateText(rawEffect);
      if (rawTrigger && rawTrigger !== '-') {
        card.triggerPt = translateText(rawTrigger);
      }
      if (isVerbose) {
        console.log(`\n🎴 [${card.code}] ${card.namePt || card.nameEn}`);
        console.log(`   EN: ${rawEffect}`);
        console.log(`   PT: ${card.effectPt}`);
      }
      count++;
    }

    console.log(`\n✨ Fallback concluído! ${count} cartas atualizadas pelo motor determinístico.`);
    partitionCards(allCards);
    return;
  }

  // Processamento real via Gemini API
  let totalProcessed = 0;
  for (let i = 0; i < batches.length; i++) {
    const currentBatch = batches[i];
    console.log(`\n📡 Enviando lote ${i + 1}/${batches.length} (${currentBatch.length} cartas) para o Gemini [modelo: ${getActiveModelName()}]...`);

    const formattedPayload = currentBatch.map((c) => ({
      code: c.code,
      nameEn: c.nameEn || c.name || c.code,
      effectEn: c.effectEn || c.effect || '',
      ...(c.triggerEn || c.trigger ? { triggerEn: c.triggerEn || c.trigger } : {})
    }));

    try {
      const translatedBatch = await translateBatchWithGemini(formattedPayload, apiKey);

      // Mapa de respostas recebidas da IA
      const resMap = new Map();
      for (const item of translatedBatch) {
        if (item.code) {
          resMap.set(item.code.toUpperCase(), item);
        }
      }

      // Aplicar traduções com Sanitização Determinística Obrigatória
      for (const originalCard of currentBatch) {
        const cardCode = (originalCard.code || '').toUpperCase();
        const aiRes = resMap.get(cardCode);

        const rawEffect = originalCard.effectEn || originalCard.effect || '';
        const rawTrigger = originalCard.triggerEn || originalCard.trigger || '';

        let effectCandidate = aiRes?.effectPt || rawEffect;
        let triggerCandidate = aiRes?.triggerPt || rawTrigger;

        // Sanitização Determinística de Garantia (Regras Bandai)
        originalCard.effectPt = translateText(effectCandidate);
        if (rawTrigger && rawTrigger !== '-') {
          originalCard.triggerPt = translateText(triggerCandidate);
        }
        if (aiRes?.namePt) {
          originalCard.namePt = aiRes.namePt;
        }

        if (isVerbose) {
          console.log(`\n🎴 [${originalCard.code}] ${originalCard.namePt || originalCard.nameEn}`);
          console.log(`   EN: ${rawEffect}`);
          console.log(`   PT: ${originalCard.effectPt}`);
          if (originalCard.triggerPt) {
            console.log(`   Gatilho PT: ${originalCard.triggerPt}`);
          }
        }

        totalProcessed++;
      }

      console.log(`  ✓ Lote ${i + 1} traduzido via ${getActiveModelName()} e sanitizado com sucesso.`);

      // Pacing para respeitar limite de 15 RPM
      if (i < batches.length - 1) {
        console.log(`  ⏳ Aguardando ${PAUSE_BETWEEN_BATCHES_MS / 1000}s para manter limite de rate limit (15 RPM)...`);
        await sleep(PAUSE_BETWEEN_BATCHES_MS);
      }
    } catch (err) {
      console.error(`  ❌ Lote ${i + 1}/${batches.length} falhou criticamente: ${err.message}`);
      throw new Error(`💥 O Lote ${i + 1}/${batches.length} não pôde ser traduzido pela IA do Gemini. A execução foi interrompida para garantir a integridade dos dados e evitar salvamentos parciais.`);
    }
  }

  console.log(`\n🎉 Ingestão e Tradução concluídas! Total de ${totalProcessed} cartas processadas.`);

  // Particionar e salvar novos arquivos JSON modulares
  partitionCards(allCards);
}

const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  runTranslationPipeline().catch((err) => {
    console.error('💥 Erro fatal no pipeline de tradução:', err);
    process.exit(1);
  });
}
