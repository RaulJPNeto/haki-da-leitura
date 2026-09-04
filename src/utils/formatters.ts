/**
 * Mapeamentos e formatadores centralizados para garantir que nenhuma constante
 * ou enum técnico (como LEADER, CHARACTER, TIMING, SEU_TURNO) seja exibido
 * em formato de código cru para o usuário final.
 */

const CARD_TYPE_LABELS: Record<string, string> = {
  LEADER: 'Leader',
  CHARACTER: 'Character',
  EVENT: 'Event',
  STAGE: 'Stage'
};

const CATEGORY_LABELS: Record<string, string> = {
  TIMING: 'Janela de Tempo',
  KEYWORD_EFFECT: 'Habilidade',
  COST: 'Custo',
  RULE: 'Regra Geral'
};

const ATTRIBUTE_LABELS: Record<string, string> = {
  SLASH: 'Slash',
  STRIKE: 'Strike',
  SPECIAL: 'Special',
  WISDOM: 'Wisdom',
  RANGED: 'Ranged'
};

const COLOR_LABELS: Record<string, string> = {
  RED: 'Vermelho',
  GREEN: 'Verde',
  BLUE: 'Azul',
  PURPLE: 'Roxo',
  YELLOW: 'Amarelo',
  BLACK: 'Preto',
  MULTI: 'Multicor'
};

/**
 * Converte qualquer tipo de carta (ex: 'LEADER') para texto amigável em português (ex: 'Líder')
 */
export function formatCardType(type: string): string {
  if (!type) return '';
  return CARD_TYPE_LABELS[type.toUpperCase()] || formatGenericConstant(type);
}

/**
 * Converte qualquer categoria de regra (ex: 'TIMING') para texto legível (ex: 'Janela de Tempo')
 */
export function formatCategory(category: string): string {
  if (!category) return '';
  return CATEGORY_LABELS[category.toUpperCase()] || formatGenericConstant(category);
}

/**
 * Converte atributos (ex: 'SLASH') para português (ex: 'Corte')
 */
export function formatAttribute(attribute?: string): string {
  if (!attribute) return '';
  return ATTRIBUTE_LABELS[attribute.toUpperCase()] || formatGenericConstant(attribute);
}

/**
 * Converte cores para português
 */
export function formatColor(color: string): string {
  if (!color) return '';
  return COLOR_LABELS[color.toUpperCase()] || formatGenericConstant(color);
}

/**
 * Formatador universal defensivo: caso chegue uma constante bruta do tipo
 * 'SEU_TURNO' ou 'ON_PLAY', limpa os underscores e converte para Capitalized normal.
 */
export function formatGenericConstant(text: string): string {
  if (!text) return '';
  
  // Se contiver underscores ou estiver toda em maiúsculas com mais de 2 letras
  const cleaned = text
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return cleaned;
}
