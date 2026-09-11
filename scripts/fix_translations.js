/**
 * Compilador de Tradução Sanitizado do One Piece TCG.
 * Executa a esteira de regras de substituição semântica e higienização em todas as cartas.
 */
import { loadMasterCards, partitionCards } from './lib/card_loader.js';
import { translateText } from './lib/translation_rules.js';
import { extractKeywords } from './lib/card_parser.js';

export { translateText };

export function processCards(cards) {
  let updatedCount = 0;
  for (const card of cards) {
    let modified = false;

    if (card.effectEn) {
      const newPt = translateText(card.effectEn);
      if (card.effectPt !== newPt) {
        card.effectPt = newPt;
        modified = true;
      }
    }

    if (card.triggerEn) {
      const newTrigPt = translateText(card.triggerEn);
      if (card.triggerPt !== newTrigPt) {
        card.triggerPt = newTrigPt;
        modified = true;
      }
    }

    card.keywordIds = extractKeywords(card.effectEn || card.effectPt, card.triggerEn || card.triggerPt);
    if (modified) updatedCount++;
  }
  return { updatedCount, cards };
}

export function runFixTranslations() {
  console.log('🔄 Executando varredura ultra-exaustiva de traduções...');
  const masterCards = loadMasterCards();
  if (!masterCards || masterCards.length === 0) {
    console.error('⚠️ Nenhum dado de carta encontrado em src/data/cards.json');
    return;
  }

  const { updatedCount, cards } = processCards(masterCards);
  const { totalWritten, fileCount } = partitionCards(cards);

  console.log(`✨ Sucesso! ${updatedCount} cartas atualizadas em ${fileCount} coleções (${totalWritten} cartas totais no catálogo).`);
}

// Execução direta via CLI
import { fileURLToPath } from 'url';
import path from 'path';

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  runFixTranslations();
}
