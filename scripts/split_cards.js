import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const cardsPath = path.join(rootDir, 'src', 'data', 'cards.json');
const targetBaseDir = path.join(rootDir, 'src', 'data', 'cards');

if (!fs.existsSync(cardsPath)) {
  console.error('Arquivo src/data/cards.json não encontrado!');
  process.exit(1);
}

const rawCards = JSON.parse(fs.readFileSync(cardsPath, 'utf8'));
console.log(`Lidas ${rawCards.length} cartas de cards.json`);

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/&amp;/g, 'and')
    .replace(/['"’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Pastas de destino
const folders = {
  sets: path.join(targetBaseDir, 'sets'),
  starters: path.join(targetBaseDir, 'starters'),
  extraBoosters: path.join(targetBaseDir, 'extra-boosters'),
  promos: path.join(targetBaseDir, 'promos'),
  other: path.join(targetBaseDir, 'other')
};

// Limpar diretórios existentes para evitar resíduos de arquivos gerados em pastas erradas
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

function getCollectionFromCode(card) {
  const code = (card.code || '').trim().toUpperCase();

  // 1. PROMO: Sempre que o código começar com P- ou P_
  if (code.startsWith('P-') || code.startsWith('P_')) {
    return {
      folder: folders.promos,
      setId: 'P',
      setName: 'Promotion Cards'
    };
  }

  // 2. STARTER DECK: Sempre que o código começar com ST
  const matchST = code.match(/^ST(\d+)-/);
  if (matchST) {
    const num = matchST[1].padStart(2, '0');
    return {
      folder: folders.starters,
      setId: `ST-${num}`,
      setName: card.setName?.startsWith('ST') || !card.setName ? `Starter Deck ${num}` : card.setName
    };
  }

  // 3. EXTRA BOOSTER: Sempre que o código começar com EB
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

  // 4. BOOSTER SET: Sempre que o código começar com OP
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

  // 5. PREMIUM BOOSTER: PRB
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

// Agrupar cartas estritamente pelo código
const groups = {};

for (const card of rawCards) {
  const col = getCollectionFromCode(card);
  
  // Sincronizar setId canônico
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
  console.log(`✓ [${groupId}] ${data.cards.length} cartas -> ${path.relative(rootDir, filePath)}`);
  totalWritten += data.cards.length;
  fileCount++;
}

// Salvar cards.json com os setIds sincronizados
fs.writeFileSync(cardsPath, JSON.stringify(rawCards, null, 2), 'utf8');

// Atualizar metadados de sincronização para o PWA
const metaPath = path.join(rootDir, 'src', 'data', 'sync_meta.json');
const syncMeta = {
  lastSync: new Date().toISOString(),
  totalCards: totalWritten,
  collectionsCount: fileCount,
  version: '1.0.0',
  message: `Base atualizada com sucesso: ${totalWritten} cartas distribuídas em ${fileCount} coleções.`
};
fs.writeFileSync(metaPath, JSON.stringify(syncMeta, null, 2), 'utf8');

console.log(`\n🎉 Concluído com sucesso! ${totalWritten} cartas distribuídas em ${fileCount} arquivos organizados com base no código oficial da carta.`);
