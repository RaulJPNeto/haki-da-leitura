/**
 * Ingestão e Tradução de Cartas Promocionais (P-Cards)
 * Fonte: buhbbl/punk-records (pacotes 569901 e 569801)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://raw.githubusercontent.com/buhbbl/punk-records/main/english';
const targetDir = path.resolve(__dirname, '..', 'src', 'data', 'cards', 'promos');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

import { TRAIT_TRANSLATIONS, translateTrait } from './traits.js';
import { translateText } from './fix_translations.js';

function translateEffect(text) {
  return translateText(text);
}

function detectKeywordIds(effectText) {
  if (!effectText) return [];
  const ids = [];
  const lower = effectText.toLowerCase();
  if (lower.includes('[blocker]') || lower.includes('[bloqueador]')) ids.push('blocker');
  if (lower.includes('[rush]') || lower.includes('[investida]')) ids.push('rush');
  if (lower.includes('[on play]') || lower.includes('[ao jogar]')) ids.push('on-play');
  if (lower.includes('[when attacking]') || lower.includes('[ao atacar]')) ids.push('when-attacking');
  if (lower.includes('[trigger]') || lower.includes('[gatilho]')) ids.push('trigger');
  if (lower.includes('[counter]') || lower.includes('[contra-ataque]')) ids.push('counter');
  if (lower.includes('[double attack]') || lower.includes('[ataque duplo]')) ids.push('double-attack');
  if (lower.includes('[banish]') || lower.includes('[banimento]')) ids.push('banish');
  if (lower.includes('[once per turn]') || lower.includes('[1 vez por turno]')) ids.push('once-per-turn');
  if (lower.includes('[your turn]') || lower.includes('[seu turno]')) ids.push('your-turn');
  if (lower.includes('[on k.o.]') || lower.includes('[ao ser k.o.]')) ids.push('on-ko');
  return ids;
}

function mapCardType(cat) {
  if (!cat) return 'CHARACTER';
  const c = cat.toUpperCase();
  if (c.includes('LEADER')) return 'LEADER';
  if (c.includes('EVENT')) return 'EVENT';
  if (c.includes('STAGE')) return 'STAGE';
  return 'CHARACTER';
}

function mapColors(colors) {
  if (!colors || !Array.isArray(colors)) return ['RED'];
  return colors.map((c) => c.toUpperCase());
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
  console.log('🚀 Baixando pacotes de cartas promocionais (569901 e 569801)...');

  const r1 = await fetch(`${BASE_URL}/data/569901.json`).then((r) => r.json());
  const r2 = await fetch(`${BASE_URL}/data/569801.json`).then((r) => r.json());

  const allRaw = [...r1, ...r2];
  const pMap = new Map();

  for (const c of allRaw) {
    if (c.id && (c.id.startsWith('P-') || c.id.startsWith('P_') || c.id.startsWith('P'))) {
      const baseCode = c.id.split('_')[0].toUpperCase();
      if (!pMap.has(baseCode)) {
        pMap.set(baseCode, c);
      }
    }
  }

  console.log(`Encontradas ${pMap.size} cartas promocionais P- únicas.`);

  const promoCards = [];

  for (const [code, c] of pMap.entries()) {
    const rawEffect = c.effect || '';
    const rawTrigger = c.trigger || '';
    const effectPt = translateEffect(rawEffect);
    const triggerPt = rawTrigger ? translateEffect(rawTrigger) : undefined;
    const effectKeywords = detectKeywordIds(rawEffect + ' ' + rawTrigger);

    const subtypes = (c.types || []).map((trait) => TRAIT_TRANSLATIONS[trait] || trait);

    const card = {
      id: code,
      code: code,
      namePt: c.name ? c.name.replace(/\./g, ' ') : code,
      nameEn: c.name ? c.name.replace(/\./g, ' ') : code,
      cardType: mapCardType(c.category),
      colors: mapColors(c.colors),
      cost: typeof c.cost === 'number' ? c.cost : null,
      power: typeof c.power === 'number' ? c.power : null,
      counter: typeof c.counter === 'number' ? c.counter : null,
      attribute: mapAttribute(c.attributes),
      subtypes: subtypes,
      effectPt: effectPt,
      effectEn: rawEffect,
      ...(triggerPt && { triggerPt }),
      ...(rawTrigger && { triggerEn: rawTrigger }),
      keywordIds: effectKeywords,
      setId: 'P',
      setName: 'PROMOTION CARDS'
    };

    promoCards.push(card);
  }

  // Ordenar por código
  promoCards.sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));

  const outPath = path.join(targetDir, 'P-promotion-cards.json');
  fs.writeFileSync(outPath, JSON.stringify(promoCards, null, 2), 'utf8');

  console.log(`✅ Salvo com sucesso: ${promoCards.length} cartas em ${outPath}`);
}

run().catch(console.error);
