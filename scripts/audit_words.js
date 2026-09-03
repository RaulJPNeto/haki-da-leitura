import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const base = path.resolve(__dirname, '..', 'src', 'data', 'cards');
const all = [];

function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (f.endsWith('.json')) {
      all.push(...JSON.parse(fs.readFileSync(p, 'utf8')));
    }
  }
}
walk(base);

// Palavras aceitas em PT / TCG comum
const ptWhitelisted = new Set([
  'a', 'à', 'ao', 'aos', 'às', 'as', 'o', 'os', 'um', 'uma', 'uns', 'umas',
  'de', 'do', 'da', 'dos', 'das', 'no', 'na', 'nos', 'nas', 'em', 'para', 'por', 'com', 'sem',
  'e', 'ou', 'se', 'que', 'como', 'mais', 'menos', 'até', 'vez', 'vezes', 'turno', 'turnos',
  'seu', 'seus', 'sua', 'suas', 'ele', 'ela', 'eles', 'elas', 'dele', 'deles', 'dela', 'delas',
  'você', 'vocês', 'este', 'esta', 'estes', 'estas', 'esse', 'essa', 'esses', 'essas', 'aquele',
  'oponente', 'oponentes', 'líder', 'lider', 'personagem', 'personagens', 'carta', 'cartas',
  'deck', 'vida', 'lixeira', 'mão', 'campo', 'área', 'batalha', 'fase', 'principal', 'final',
  'efeito', 'efeitos', 'poder', 'custo', 'contra-ataque', 'gatilho', 'bloqueador', 'investida',
  'ataque', 'duplo', 'banimento', 'jogar', 'jogue', 'jogada', 'jogadas', 'jogando',
  'atacar', 'atacando', 'atacado', 'bloquear', 'bloqueie', 'bloqueado',
  'nocauteado', 'k.o.', 'don!!', 'don', 'descansar', 'descanse', 'descansada', 'descansadas', 'descansado', 'descansados',
  'ativa', 'ativas', 'ativo', 'ativos', 'colocar', 'coloque', 'colocada', 'colocadas', 'colocado', 'colocados',
  'descartar', 'descarte', 'descartada', 'descartadas', 'descartado', 'descartados',
  'compre', 'comprar', 'comprada', 'compradas', 'olhe', 'olhar', 'revele', 'revelar', 'revelada', 'reveladas',
  'retorne', 'retornar', 'retornada', 'retornadas', 'retornado', 'retornados',
  'adicione', 'adicionar', 'adicionada', 'adicionadas', 'dê', 'dar', 'ganha', 'ganham', 'ganhe',
  'virar', 'vire', 'virada', 'viradas', 'cima', 'baixo', 'topo', 'fundo', 'qualquer', 'ordem',
  'outro', 'outra', 'outros', 'outras', 'diferente', 'diferentes', 'mesmo', 'mesma', 'mesmos', 'mesmas',
  'tipo', 'tipos', 'cor', 'cores', 'base', 'regras', 'acordo', 'número', 'especificado', 'escolha',
  'pode', 'podem', 'tiver', 'tiverem', 'tenha', 'tenham', 'tem', 'têm', 'ter', 'houver', 'for', 'forem',
  'esteja', 'estejam', 'está', 'estão', 'são', 'é', 'ser', 'seja', 'sejam', 'serem', 'sido',
  'durante', 'início', 'fim', 'próximo', 'próxima', 'próximos', 'próximas', 'seguida',
  'cada', 'todo', 'toda', 'todos', 'todas', 'apenas', 'somente', 'quando', 'onde', 'alvo', 'selecionado',
  'selecionada', 'selecionar', 'selecione', 'mude', 'mudar', 'causa', 'causam', 'dano', 'ativar',
  'ativação', 'inclua', 'incluir', 'incluindo', 'restante', 'dono', 'donos', 'após', 'declarar',
  'novo', 'nova', 'novos', 'novas', 'trate', 'tratar', 'possa', 'possam', 'deixar', 'deixe', 'não',
  'isso', 'isto', 'aquilo', 'terceiro', 'primeiro', 'segundo', 'quarto', 'quinto', 'igual', 'iguais'
]);

const unknownWords = {};
const cardSamples = {};

for (const card of all) {
  const text = (card.effectPt || '') + ' ' + (card.triggerPt || '');
  const clean = text
    .replace(/\[[^\]]+\]/g, ' ')
    .replace(/\{[^}]+\}/g, ' ')
    .replace(/DON!!\s*x\d+/gi, ' ')
    .replace(/DON!!\s*−\d+/gi, ' ')
    .replace(/DON!!/gi, ' ')
    .replace(/K\.O\./gi, ' ')
    .replace(/−?\d+/g, ' ')
    .replace(/•/g, ' ')
    .replace(/[:.,;()!?"'\/+−-]/g, ' ');

  const words = clean.toLowerCase().match(/[\p{L}]+/gu) || [];

  for (const w of words) {
    if (!ptWhitelisted.has(w) && w.length > 1) {
      unknownWords[w] = (unknownWords[w] || 0) + 1;
      if (!cardSamples[w]) cardSamples[w] = { code: card.code, text: text.slice(0, 140) };
    }
  }
}

const sorted = Object.entries(unknownWords).sort((a, b) => b[1] - a[1]);
console.log('Total de palavras a checar:', sorted.length);
console.log('\nTop 45 termos mais frequentes a auditar:');
sorted.slice(0, 45).forEach(([w, c]) => {
  console.log(`[${w}] (${c}x) Exemplo (${cardSamples[w].code}): "${cardSamples[w].text}"`);
});
