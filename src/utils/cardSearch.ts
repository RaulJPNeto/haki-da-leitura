import { Card } from '../types';

export interface SearchOptions {
  query: string;
  typeFilter?: string; // ALL, LEADER, CHARACTER, EVENT, STAGE, PROMO
  limit?: number;      // Padrão: 40 para evitar sobrecarga no DOM
}

/**
 * Normaliza strings para busca insensível a acentos, pontuação e caixa
 */
export function normalizeSearchTerm(term: string): string {
  return term
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Motor de busca de alta precisão, relevância e performance para cartas OPTCG
 */
export function searchCards(cards: Card[], options: SearchOptions): Card[] {
  const rawQ = options.query.trim();
  const q = normalizeSearchTerm(rawQ);
  const typeFilter = options.typeFilter || 'ALL';
  const limit = options.limit || 40;

  // Se a busca estiver completamente vazia e typeFilter for ALL, retornar os primeiros cards para navegação inicial
  if (q.length === 0 && typeFilter === 'ALL') {
    return cards.slice(0, limit);
  }

  // Se a busca tiver apenas 1 caractere, não processar varredura pesada
  if (q.length === 1) {
    return [];
  }

  const hasQuery = q.length >= 2;
  const tokens = q.split(/\s+/).filter(Boolean);

  const scoredResults: { card: Card; score: number }[] = [];

  for (const card of cards) {
    // 1. Verificação Estrita de Tipo / Categoria
    const isPromo = card.code.startsWith('P-');
    if (typeFilter !== 'ALL') {
      if (typeFilter === 'PROMO') {
        if (!isPromo) continue;
      } else if (typeFilter === 'STAGE') {
        if (card.cardType !== 'STAGE') continue;
      } else {
        if (card.cardType !== typeFilter || isPromo) continue;
      }
    }

    // Se o usuário selecionou uma aba (ex: Líder) mas não digitou texto, listar com pontuação base
    if (!hasQuery) {
      scoredResults.push({ card, score: 1 });
      continue;
    }

    // 2. Pontuação de Relevância por Limites de Palavra (Word-Boundary)
    const normCode = normalizeSearchTerm(card.code);
    const normNamePt = normalizeSearchTerm(card.namePt);
    const normNameEn = normalizeSearchTerm(card.nameEn);

    let score = 0;

    // A. Match de Código Oficial (Prioridade Máxima)
    if (normCode === q) {
      score += 200; // Código idêntico (ex: OP01-025)
    } else if (normCode.startsWith(q)) {
      score += 120; // Início do código (ex: OP01, ST01, P-0)
    } else if (normCode.includes(q)) {
      score += 80;
    }

    // B. Match de Nome por Início de Palavra
    // Ex: "luffy" encontra "Monkey D. Luffy" ou "Luffy", mas NUNCA "Fleeting Lullaby"
    const wordsPt = normNamePt.split(/[\s\.\-]+/);
    const wordsEn = normNameEn.split(/[\s\.\-]+/);

    const tokensMatchPt = tokens.every((token) =>
      wordsPt.some((word) => word.startsWith(token))
    );
    const tokensMatchEn = tokens.every((token) =>
      wordsEn.some((word) => word.startsWith(token))
    );

    if (tokensMatchPt || tokensMatchEn) {
      if (normNamePt.startsWith(q) || normNameEn.startsWith(q)) {
        score += 90; // Nome começa diretamente com o termo digitado
      } else {
        score += 70; // Uma das palavras do nome começa com o termo (ex: Monkey D. Luffy)
      }
    }

    // C. Match de Subtipo (ex: "Chapéu de Palha", "Supernovas")
    if (score === 0 && card.subtypes && card.subtypes.length > 0) {
      const matchSubtype = card.subtypes.some((subtype) => {
        const normSub = normalizeSearchTerm(subtype);
        const subWords = normSub.split(/[\s\.\-]+/);
        return tokens.every((token) => subWords.some((w) => w.startsWith(token)));
      });

      if (matchSubtype) {
        score += 40;
      }
    }

    if (score > 0) {
      scoredResults.push({ card, score });
    }
  }

  // 3. Ordenação decrescente por Relevância (Maior Score primeiro)
  scoredResults.sort((a, b) => b.score - a.score);

  // 4. Limite de exibição no DOM (Alta Performance Mobile)
  return scoredResults.slice(0, limit).map((item) => item.card);
}
