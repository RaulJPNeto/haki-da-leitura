/**
 * Script de Ingestão e Tradução de Cartas do One Piece TCG (OP-01 até OP-17 + Starters + EBs)
 * Fonte: buhbbl/punk-records (dados abertos de cartas em JSON)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://raw.githubusercontent.com/buhbbl/punk-records/main/english';

import { TRAIT_TRANSLATIONS, translateTrait } from './traits.js';
import { translateText } from './fix_translations.js';

function translateEffect(text) {
  return translateText(text);
}

function extractKeywords(text, trigger) {
  const full = `${text || ''} ${trigger || ''}`.toLowerCase();
  const kw = [];
  if (full.includes('blocker') || full.includes('bloqueador')) kw.push('blocker');
  if (full.includes('rush') || full.includes('investida')) kw.push('rush');
  if (full.includes('on play') || full.includes('ao jogar')) kw.push('on-play');
  if (full.includes('when attacking') || full.includes('ao atacar')) kw.push('when-attacking');
  if (full.includes('activate: main') || full.includes('ativação: principal')) kw.push('activate-main');
  if (full.includes('your turn') || full.includes('seu turno')) kw.push('your-turn');
  if (full.includes('trigger') || full.includes('gatilho')) kw.push('trigger');
  if (full.includes('counter') || full.includes('contra-ataque')) kw.push('counter');
  if (full.includes('double attack') || full.includes('ataque duplo')) kw.push('double-attack');
  if (full.includes('banish') || full.includes('banimento')) kw.push('banish');
  return kw;
}

function mapCategory(cat) {
  if (!cat) return 'CHARACTER';
  const c = cat.toUpperCase();
  if (c.includes('LEADER')) return 'LEADER';
  if (c.includes('EVENT')) return 'EVENT';
  if (c.includes('STAGE')) return 'STAGE';
  return 'CHARACTER';
}

function mapColors(colors) {
  if (!colors || !Array.isArray(colors)) return ['RED'];
  return colors.map(c => c.toUpperCase());
}

function mapAttribute(attr) {
  if (!attr) return undefined;
  const a = Array.isArray(attr) ? attr[0] : attr;
  if (!a) return undefined;
  const u = a.toUpperCase();
  if (u.includes('SLASH')) return 'SLASH';
  if (u.includes('STRIKE')) return 'STRIKE';
  if (u.includes('SPECIAL')) return 'SPECIAL';
  if (u.includes('RANGED')) return 'RANGED';
  if (u.includes('WISDOM')) return 'WISDOM';
  return undefined;
}

async function run() {
  console.log('🚀 Iniciando ingestão das coleções de One Piece TCG...');

  const packsRes = await fetch(`${BASE_URL}/packs.json`);
  const packs = await packsRes.json();
  
  // Filtrar todos os Booster Packs, Starter Decks e Extra Boosters (OP-01 até OP-17, ST-01 a ST-21, etc.)
  const targetPacks = Object.values(packs).filter(p => {
    if (!p) return false;
    const prefix = p.title_parts?.prefix;
    const raw = (p.raw_title || '').toUpperCase();
    return (
      prefix === 'BOOSTER PACK' ||
      prefix === 'STARTER DECK' ||
      prefix === 'EXTRA BOOSTER' ||
      prefix === 'ULTRA DECK' ||
      raw.includes('BOOSTER PACK') ||
      raw.includes('STARTER DECK') ||
      raw.includes('EXTRA BOOSTER')
    );
  });

  console.log(`📦 Encontrados ${targetPacks.length} pacotes para processar.`);

  const cardsMap = new Map();

  for (const pack of targetPacks) {
    const packId = pack.id;
    let packLabel = pack.title_parts?.label || pack.id;
    let packTitle = pack.title_parts?.title || pack.raw_title;
    if (packId === '569115' || packLabel === 'OP15-EB04') {
      packTitle = "ADVENTURE ON KAMI'S ISLAND";
      packLabel = "OP-15";
    }

    try {
      const packUrl = `${BASE_URL}/data/${packId}.json`;
      const res = await fetch(packUrl);
      if (!res.ok) {
        // Pular se o pacote ainda não tiver dados JSON
        continue;
      }
      const rawCards = await res.json();
      console.log(`  ✓ [${packLabel}] ${packTitle} (${rawCards.length} cartas)`);

      for (const rc of rawCards) {
        const rawCode = rc.id || '';
        // Obter código canônico sem sufixos de arte paralela (_p1, _p2)
        const baseCode = rawCode.split('_')[0].trim();
        if (!baseCode) continue;

        // Se já existe e a versão atual não é paralela, manter a original
        if (cardsMap.has(baseCode) && rawCode.includes('_')) {
          continue;
        }

        const cardType = mapCategory(rc.category);
        let rawColors = mapColors(rc.colors);
        // Regra do jogo: apenas Leader pode ser multicolorido; Characters, Stages e Events têm apenas 1 cor
        if (cardType !== 'LEADER' && rawColors.length > 1) {
          rawColors = [rawColors[0]];
        }

        const subtypes = (rc.types || []).map(translateTrait);
        const effectPt = translateEffect(rc.effect);
        const triggerPt = rc.trigger ? translateEffect(rc.trigger) : undefined;
        const keywordIds = extractKeywords(rc.effect, rc.trigger);

        const cardObj = {
          id: baseCode,
          code: baseCode,
          namePt: rc.name ? rc.name.replace(/\./g, ' ') : baseCode,
          nameEn: rc.name ? rc.name.replace(/\./g, ' ') : baseCode,
          cardType,
          colors: rawColors,
          cost: rc.cost !== undefined && rc.cost !== null ? Number(rc.cost) : null,
          power: rc.power !== undefined && rc.power !== null ? Number(rc.power) : null,
          counter: rc.counter !== undefined && rc.counter !== null ? Number(rc.counter) : null,
          attribute: mapAttribute(rc.attributes),
          subtypes,
          effectPt: effectPt || '',
          effectEn: rc.effect || '',
          triggerPt: triggerPt || undefined,
          triggerEn: rc.trigger || undefined,
          keywordIds,
          setId: packLabel,
          setName: packTitle
        };

        cardsMap.set(baseCode, cardObj);
      }
    } catch (err) {
      console.warn(`  ⚠️ Erro ao buscar pacote ${packLabel}:`, err.message);
    }
  }

  const allCards = Array.from(cardsMap.values());
  // Ordenar alfabeticamente por código da carta (OP01-001, OP01-002...)
  allCards.sort((a, b) => a.code.localeCompare(b.code));

  console.log(`\n🎉 Ingestão concluída com sucesso!`);
  console.log(`📊 Total de cartas únicas processadas: ${allCards.length}`);

  const outputPath = path.resolve(__dirname, '../src/data/cards.json');
  fs.writeFileSync(outputPath, JSON.stringify(allCards, null, 2), 'utf-8');

  console.log(`💾 Salvo em: ${outputPath}`);
}

run().catch(console.error);
