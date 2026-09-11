/**
 * Script de Partição Modular de Coleções do One Piece TCG.
 * Consome os utilitários de I/O em scripts/lib/card_loader.js.
 */
import { loadMasterCards, partitionCards } from './lib/card_loader.js';

console.log('🚀 Iniciando partição de cartas em coleções modulares...');

const rawCards = loadMasterCards();
if (!rawCards || rawCards.length === 0) {
  console.error('⚠️ Arquivo src/data/cards.json não encontrado ou vazio!');
  process.exit(1);
}

console.log(`Lidas ${rawCards.length} cartas de src/data/cards.json`);

const { totalWritten, fileCount } = partitionCards(rawCards);

console.log(`\n🎉 Concluído com sucesso! ${totalWritten} cartas distribuídas em ${fileCount} coleções modulares.`);
