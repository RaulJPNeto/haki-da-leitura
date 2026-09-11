/**
 * Motor Unificado de Ingestão de Cartas do One Piece TCG.
 * Ingesta simultaneamente Booster Packs, Starter Decks, Extra Boosters, Ultra Decks e Cartas Promocionais (P- Cards).
 * Fonte: buhbbl/punk-records (dados abertos em JSON)
 */
import { buildCardObject } from './lib/card_parser.js';
import { saveMasterCards } from './lib/card_loader.js';
import { translateText } from './lib/translation_rules.js';

const BASE_URL = 'https://raw.githubusercontent.com/buhbbl/punk-records/main/english';

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
}

async function run() {
  console.log('🚀 Iniciando ingestão unificada de todas as coleções do One Piece TCG...');

  const packsMap = new Map();

  // 1. Ingestão de Pacotes Regulares (Boosters, Starters, Extra Boosters, Ultra Decks)
  try {
    const packs = await fetchJson(`${BASE_URL}/packs.json`);
    const targetPacks = Object.values(packs).filter((p) => {
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

    for (const pack of targetPacks) {
      let packLabel = pack.title_parts?.label || pack.id;
      let packTitle = pack.title_parts?.title || pack.raw_title;
      if (pack.id === '569115' || packLabel === 'OP15-EB04') {
        packTitle = "ADVENTURE ON KAMI'S ISLAND";
        packLabel = 'OP-15';
      }
      packsMap.set(pack.id, { label: packLabel, title: packTitle });
    }
  } catch (err) {
    console.warn('⚠️ Falha ao buscar packs.json:', err.message);
  }

  // 2. Ingestão de Pacotes Promocionais (P- Cards: 569901 e 569801)
  packsMap.set('569901', { label: 'P', title: 'PROMOTION CARDS' });
  packsMap.set('569801', { label: 'P', title: 'PROMOTION CARDS' });

  console.log(`📦 Encontrados ${packsMap.size} pacotes para processar.`);

  const cardsMap = new Map();

  for (const [packId, setInfo] of packsMap.entries()) {
    try {
      const rawCards = await fetchJson(`${BASE_URL}/data/${packId}.json`);
      console.log(`  ✓ [${setInfo.label}] ${setInfo.title} (${rawCards.length} cartas)`);

      for (const rc of rawCards) {
        const rawCode = rc.id || rc.code || '';
        const baseCode = rawCode.split('_')[0].trim().toUpperCase();
        if (!baseCode) continue;

        // Se a carta já foi registrada e a nova é variante paralela (_p1, _p2), manter a original
        if (cardsMap.has(baseCode) && rawCode.includes('_')) {
          continue;
        }

        const cardObj = buildCardObject(rc, { setId: setInfo.label, setName: setInfo.title }, translateText);
        cardsMap.set(baseCode, cardObj);
      }
    } catch (err) {
      console.warn(`  ⚠️ Erro ao buscar pacote ${setInfo.label} (${packId}):`, err.message);
    }
  }

  const allCards = Array.from(cardsMap.values());
  allCards.sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));

  console.log(`\n🎉 Ingestão unificada concluída! Total de cartas únicas: ${allCards.length}`);
  saveMasterCards(allCards);
  console.log(`💾 Catálogo mestre atualizado com sucesso em src/data/cards.json`);
}

run().catch(console.error);
