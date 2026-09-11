/**
 * Módulo de I/O de Arquivos e Gerenciamento de Coleções do Haki da Leitura.
 * Isolado segundo o Princípio da Inversão de Dependência (DIP) e Responsabilidade Única (SRP).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const rootDir = path.resolve(__dirname, '../..');
export const cardsMasterPath = path.join(rootDir, 'src', 'data', 'cards.json');
export const targetBaseDir = path.join(rootDir, 'src', 'data', 'cards');
export const syncMetaPath = path.join(rootDir, 'src', 'data', 'sync_meta.json');

export const folders = {
  sets: path.join(targetBaseDir, 'sets'),
  starters: path.join(targetBaseDir, 'starters'),
  extraBoosters: path.join(targetBaseDir, 'extra-boosters'),
  promos: path.join(targetBaseDir, 'promos'),
  other: path.join(targetBaseDir, 'other')
};

export function loadMasterCards() {
  if (!fs.existsSync(cardsMasterPath)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(cardsMasterPath, 'utf8'));
}

export function saveMasterCards(cards) {
  fs.writeFileSync(cardsMasterPath, JSON.stringify(cards, null, 2), 'utf8');
}

export function slugify(text) {
  if (!text) return 'outras';
  return String(text)
    .toLowerCase()
    .replace(/&amp;/g, 'and')
    .replace(/['"’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function classifyCollection(card) {
  const code = (card.code || '').trim().toUpperCase();

  // 1. PROMO
  if (code.startsWith('P-') || code.startsWith('P_') || code === 'P') {
    return {
      folder: folders.promos,
      setId: 'P',
      setName: 'Promotion Cards'
    };
  }

  // 2. STARTER DECK
  const matchST = code.match(/^ST(\d+)-/);
  if (matchST) {
    const num = matchST[1].padStart(2, '0');
    return {
      folder: folders.starters,
      setId: `ST-${num}`,
      setName: card.setName?.startsWith('ST') || !card.setName ? `Starter Deck ${num}` : card.setName
    };
  }

  // 3. EXTRA BOOSTER
  const matchEB = code.match(/^EB(\d+)-/);
  if (matchEB) {
    const num = matchEB[1].padStart(2, '0');
    let setName = card.setName;
    if (num === '04' || setName === 'BOOSTER PACK') setName = 'EGGHEAD CRISIS';
    return {
      folder: folders.extraBoosters,
      setId: `EB-${num}`,
      setName: setName || `Extra Booster ${num}`
    };
  }

  // 4. BOOSTER SET
  const matchOP = code.match(/^OP(\d+)-/);
  if (matchOP) {
    const num = matchOP[1].padStart(2, '0');
    let setName = card.setName;
    if (num === '15' || setName === 'BOOSTER PACK') setName = "ADVENTURE ON KAMI'S ISLAND";
    return {
      folder: folders.sets,
      setId: `OP-${num}`,
      setName: setName || `Booster Pack ${num}`
    };
  }

  // 5. PREMIUM BOOSTER
  const matchPRB = code.match(/^PRB(\d+)-/);
  if (matchPRB) {
    const num = matchPRB[1].padStart(2, '0');
    return {
      folder: folders.sets,
      setId: `PRB-${num}`,
      setName: `Premium Booster ${num}`
    };
  }

  return {
    folder: folders.other,
    setId: card.setId || 'OTHER',
    setName: card.setName || 'Outras Cartas'
  };
}

export function partitionCards(rawCards) {
  // Limpar diretórios existentes
  Object.values(folders).forEach((f) => {
    if (fs.existsSync(f)) {
      fs.readdirSync(f).forEach((file) => {
        if (file.endsWith('.json')) {
          fs.unlinkSync(path.join(f, file));
        }
      });
    } else {
      fs.mkdirSync(f, { recursive: true });
    }
  });

  const groups = {};
  for (const card of rawCards) {
    const col = classifyCollection(card);
    card.setId = col.setId;

    const groupKey = col.setId;
    if (!groups[groupKey]) {
      groups[groupKey] = {
        folder: col.folder,
        setName: col.setName,
        cards: []
      };
    }
    groups[groupKey].cards.push(card);
  }

  let totalWritten = 0;
  let fileCount = 0;

  for (const [groupId, data] of Object.entries(groups)) {
    const cleanId = groupId.replace('-', '');
    const slugName = slugify(data.setName);
    const fileName = `${cleanId}-${slugName}.json`;
    const filePath = path.join(data.folder, fileName);

    fs.writeFileSync(filePath, JSON.stringify(data.cards, null, 2), 'utf8');
    totalWritten += data.cards.length;
    fileCount++;
  }

  saveMasterCards(rawCards);
  updateSyncMeta(totalWritten, fileCount);

  return { totalWritten, fileCount };
}

export function updateSyncMeta(totalCards, collectionsCount) {
  const syncMeta = {
    lastSync: new Date().toISOString(),
    totalCards,
    collectionsCount,
    version: '1.0.0',
    message: `Base de cartas sincronizada: ${totalCards} cartas distribuídas em ${collectionsCount} coleções.`
  };
  fs.writeFileSync(syncMetaPath, JSON.stringify(syncMeta, null, 2), 'utf8');
}
