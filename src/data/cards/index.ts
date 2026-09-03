import { Card } from '../../types';

// Carrega automaticamente todos os arquivos JSON de cartas das subpastas (sets, starters, extra-boosters, promos)
const modules = (import.meta as any).glob('./**/*.json', { eager: true });

const loadedCards: Card[] = [];

for (const path in modules) {
  const mod = modules[path] as any;
  const cardArray = mod.default || mod;
  if (Array.isArray(cardArray)) {
    loadedCards.push(...cardArray);
  }
}

// Ordenação alfabética pelo código da carta (ex: OP01-001, OP17-106, ST10-001)
loadedCards.sort((a, b) => a.code.localeCompare(b.code));

export const cards: Card[] = loadedCards;
export default cards;
