/**
 * Módulo de Parsing e Normalização de Cartas de One Piece TCG.
 * Isolado segundo o Princípio da Responsabilidade Única (SRP).
 */
import { TRAIT_TRANSLATIONS, translateTrait } from './traits.js';

export function mapCardType(cat) {
  if (!cat) return 'CHARACTER';
  const c = String(cat).toUpperCase();
  if (c.includes('LEADER')) return 'LEADER';
  if (c.includes('EVENT')) return 'EVENT';
  if (c.includes('STAGE')) return 'STAGE';
  return 'CHARACTER';
}

export function mapColors(colors, cardType = 'CHARACTER') {
  if (!colors || !Array.isArray(colors) || colors.length === 0) return ['RED'];
  const mapped = colors.map((c) => String(c).toUpperCase());
  // Regra do jogo: Apenas cartas do tipo LEADER podem ser multicoloridas.
  if (cardType !== 'LEADER' && mapped.length > 1) {
    return [mapped[0]];
  }
  return mapped;
}

export function mapAttribute(attr) {
  if (!attr) return undefined;
  const a = Array.isArray(attr) ? attr[0] : attr;
  if (!a) return undefined;
  const u = String(a).toUpperCase();
  if (u.includes('SLASH')) return 'SLASH';
  if (u.includes('STRIKE')) return 'STRIKE';
  if (u.includes('SPECIAL')) return 'SPECIAL';
  if (u.includes('RANGED')) return 'RANGED';
  if (u.includes('WISDOM')) return 'WISDOM';
  return undefined;
}

export function extractKeywords(effectText = '', triggerText = '') {
  const full = `${effectText || ''} ${triggerText || ''}`.toLowerCase();
  const kwSet = new Set();

  if (full.includes('blocker') || full.includes('bloqueador')) kwSet.add('blocker');
  if (full.includes('rush: character') || full.includes('investida: personagem')) kwSet.add('rush-character');
  else if (full.includes('rush') || full.includes('investida')) kwSet.add('rush');
  if (full.includes('on play') || full.includes('ao jogar')) kwSet.add('on-play');
  if (full.includes('when attacking') || full.includes('ao atacar')) kwSet.add('when-attacking');
  if (full.includes('activate: main') || full.includes('ativação: principal')) kwSet.add('activate-main');
  if (full.includes('your turn') || full.includes('seu turno')) kwSet.add('your-turn');
  if (full.includes('opponent\'s turn') || full.includes('turno do oponente')) kwSet.add('opponents-turn');
  if (full.includes('trigger') || full.includes('gatilho')) kwSet.add('trigger');
  if (full.includes('counter') || full.includes('contra-ataque')) kwSet.add('counter');
  if (full.includes('double attack') || full.includes('ataque duplo')) kwSet.add('double-attack');
  if (full.includes('banish') || full.includes('banimento')) kwSet.add('banish');
  if (full.includes('unblockable') || full.includes('inbloqueável')) kwSet.add('unblockable');
  if (full.includes('once per turn') || full.includes('1 vez por turno')) kwSet.add('once-per-turn');
  if (full.includes('on k.o.') || full.includes('ao ser k.o.')) kwSet.add('on-ko');
  if (full.includes('on block') || full.includes('ao bloquear')) kwSet.add('on-block');
  if (full.includes('on your opponent\'s attack') || full.includes('no ataque do oponente')) kwSet.add('on-opponents-attack');
  if (full.includes('don!! x') || full.includes('don!!\u2212')) kwSet.add('don-x');
  if (full.includes('don!! -') || full.includes('don!! \u2212')) kwSet.add('don-minus');

  return Array.from(kwSet);
}

export function buildCardObject(rawCard, setInfo = {}, translateEffectFn = (t) => t) {
  const rawCode = rawCard.id || rawCard.code || '';
  const baseCode = rawCode.split('_')[0].trim().toUpperCase();
  const cardType = mapCardType(rawCard.category || rawCard.cardType);
  const colors = mapColors(rawCard.colors, cardType);
  const subtypes = (rawCard.types || rawCard.subtypes || []).map(translateTrait);

  const rawEffect = rawCard.effect || rawCard.effectEn || '';
  const rawTrigger = rawCard.trigger || rawCard.triggerEn || '';

  const effectPt = rawCard.effectPt || translateEffectFn(rawEffect);
  const triggerPt = rawCard.triggerPt || (rawTrigger ? translateEffectFn(rawTrigger) : undefined);
  const keywordIds = extractKeywords(rawEffect, rawTrigger);

  return {
    id: baseCode,
    code: baseCode,
    namePt: rawCard.namePt || (rawCard.name ? rawCard.name.replace(/\./g, ' ') : baseCode),
    nameEn: rawCard.nameEn || (rawCard.name ? rawCard.name.replace(/\./g, ' ') : baseCode),
    cardType,
    colors,
    cost: rawCard.cost !== undefined && rawCard.cost !== null ? Number(rawCard.cost) : null,
    power: rawCard.power !== undefined && rawCard.power !== null ? Number(rawCard.power) : null,
    counter: rawCard.counter !== undefined && rawCard.counter !== null ? Number(rawCard.counter) : null,
    attribute: mapAttribute(rawCard.attributes || rawCard.attribute),
    subtypes,
    effectPt: effectPt || '',
    effectEn: rawEffect,
    ...(triggerPt && { triggerPt }),
    ...(rawTrigger && { triggerEn: rawTrigger }),
    keywordIds,
    setId: setInfo.setId || rawCard.setId || 'OTHER',
    setName: setInfo.setName || rawCard.setName || 'Outras Cartas'
  };
}
