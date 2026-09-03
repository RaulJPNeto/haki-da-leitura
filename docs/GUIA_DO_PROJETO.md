# 🏴‍☠️ Haki da Leitura — Guia Arquitetural & Manual de Manutenção

> **Versão:** 1.0.0  
> **Última Atualização:** Setembro de 2026  
> **Status:** Base consolidada (2.601 cartas, 54 coleções modulares, 100% offline via PWA).

---

## 1. Visão Geral do Produto

O **Haki da Leitura** é uma aplicação web progressiva (PWA) Mobile-First projetada para jogadores, juízes e colecionadores de *One Piece Card Game* (OPTCG).

### 🎯 Problema que o Projeto Resolve:
As cartas físicas de One Piece TCG são impressas exclusivamente em Japonês e Inglês. Durante duelos competitivos ou casuais, jogadores brasileiros enfrentam dificuldades com:
1. **Barreira de Idioma:** Efeitos longos, termos técnicos e sintaxe do jogo original em inglês.
2. **Dúvidas de Timing e Regras:** Conflitos sobre quando *Trigger*, *On Play*, *Blocker* ou *When Attacking* são ativados.
3. **Velocidade de Consulta em Torneio:** Digitar nomes no celular consome tempo de rodada; a câmera com reconhecimento visual instantâneo elimina essa lentidão.

---

## 2. Arquitetura do Sistema

```
[ Câmera Mobile / Upload ]
           │
           ▼
[ Canvas de Pré-Processamento ] (Contraste, Crop Dinâmico da Caixa de Texto)
           │
           ▼
[ Tesseract.js (WebAssembly) ] (Reconhecimento OCR Local no Navegador)
           │
           ▼
[ Motor de Matching Multi-Sinal ] (Regex Tolerante + Scoring Semântico)
   ├── 1. Código da Carta (OPxx-xxx, STxx-xxx, EBxx-xxx, P-xxx)
   ├── 2. Coleção & Prefixo (OP-17, ST-10, etc.)
   ├── 3. Nome da Carta (Tolerância a OCR imperfeito)
   ├── 4. Custo & Poder (Desempate numérico)
   └── 5. Palavras-Chave de Efeito & Presença de Trigger
           │
           ▼
[ Base de Dados Modular (2.601 cartas) ]
   ├── src/data/cards/sets/ (OP-01 a OP-17)
   ├── src/data/cards/starters/ (ST-01 a ST-28)
   ├── src/data/cards/extra-boosters/ (EB-01 a EB-03)
   └── src/data/cards/promos/ (P-promotion-cards.json)
           │
           ▼
[ UI Mobile-First React 19 + PWA Offline Cache ]
```

---

## 3. Estrutura de Diretórios

```text
├── .agent/                  # Regras de governança do agente (AGENTS.md)
├── scripts/                 # Ferramentas de automação e ingestão
│   ├── fix_translations.js  # Compilador de frases e gramática comunitária OPTCG
│   ├── audit_words.js       # Auditor léxico de vocabulário e termos em inglês
│   ├── ingest_cards.js      # Ingestor de Boosters e Starters de bases abertas
│   ├── ingest_promos.js     # Ingestor de Cartas Promocionais P-
│   └── split_cards.js       # Script de partição modular do banco de cartas
├── src/
│   ├── components/          # Componentes React modulares
│   │   ├── ScannerOverlay.tsx     # Câmera, mira, OCR e motor de matching
│   │   ├── CandidateModal.tsx     # Tela intermediária de seleção com pausa de câmera
│   │   ├── CardDetail.tsx         # Ficha técnica da carta com badges interativos
│   │   ├── KeywordDrawer.tsx      # Drawer explicativo de palavras-chave e regras
│   │   ├── GlossaryModal.tsx      # Glossário completo de mecânicas do jogo
│   │   ├── ManualSearchModal.tsx  # Busca textual com autocomplete
│   │   ├── SearchBar.tsx          # Barra de busca rápida
│   │   ├── Header.tsx             # Cabeçalho da aplicação
│   │   └── Navigation.tsx         # Barra de navegação inferior
│   ├── data/
│   │   ├── cards/                 # Banco modular de cartas particionado
│   │   │   ├── sets/              # OP01 a OP17 (17 arquivos JSON)
│   │   │   ├── starters/          # ST01 a ST28 (28 arquivos JSON)
│   │   │   ├── extra-boosters/    # EB01 a EB03 (3 arquivos JSON)
│   │   │   ├── promos/            # Cartas promocionais P-
│   │   │   └── index.ts           # Agregador compilatício (import.meta.glob)
│   │   ├── cards.json             # Espelho sincronizado do banco mestre
│   │   └── keywords.json          # Dicionário de regras do jogo e FAQs
│   ├── types/                     # Tipagens estritas TypeScript (Card, Keyword)
│   ├── utils/                     # Formatadores e utilitários auxiliares
│   ├── App.tsx                    # Componente raiz da aplicação
│   ├── index.css                  # Estilos globais Tailwind CSS 4
│   └── main.tsx                   # Ponto de entrada React
├── Dockerfile               # Imagem de produção Nginx multi-stage
├── docker-compose.yml       # Orquestração local (dev e prod)
├── nginx.conf               # Configuração Nginx com compressão gzip e rotas SPA
└── vite.config.ts           # Configuração Vite + PWA Workbox + Telemetria de Debug
```

---

## 4. O Motor de Matching Visual (ScannerOverlay)

O maior desafio técnico de escanear cartas de TCG reais no celular é lidar com **sleeves (shields plásticos), reflexos de luz, foco dinâmico e sujeira**.

### As 11 Camadas de Sinais Utilizadas:
1. **Código da Carta (`code`):**  
   Regex ultra-tolerante (ex: `OP17-106`, `ST10-006`, `P-040`) com substituição de confusões comuns de OCR (`0P`/`OI`/`OR` ➔ `OP`, `5T` ➔ `ST`, `I`/`l` ➔ `1`, `O` ➔ `0`). Se encontrado com precisão, a identificação é imediata.
2. **Coleção / Set (`detectedSet`):**  
   Extrai `OP17`, `ST10`, `EB01` etc., evitando ambiguidades entre cartas com o mesmo nome lançadas em blocos diferentes.
3. **Tipo de Carta (`cardType`):**  
   Identifica no frame se a carta é **`LEADER`**, **`CHARACTER`**, **`EVENT`** ou **`STAGE`**.
4. **Atributo de Batalha (`attribute`):**  
   Lê ícones e textos de tipo de ataque: **`SLASH`**, **`STRIKE`**, **`RANGED`**, **`SPECIAL`**, **`WISDOM`**.
5. **Poder (`power`):**  
   Reconhece valores múltiplos de mil (`1000` a `12000`).
6. **Custo ou Vida de Líder (`cost`):**  
   Reconhece o valor próximo a `COST` (1 a 10) ou `LIFE` (3 a 6 para Líderes, cobrindo líderes de 3 vidas como Linlin/Yamato até 6 vidas como Barba Branca).
7. **Valor de Contra-Ataque (`counter`):**  
   Detecta `COUNTER +1000` ou `COUNTER +2000` na lateral da carta.
8. **Presença de Gatilho (`hasTrigger`):**  
   Filtra cartas pela presença da faixa amarela `TRIGGER`.
9. **Palavras-Chave de Ação (`keywordIds`):**  
   Detecta `[BLOCKER]`, `[RUSH]`, `[ON PLAY]`, `[WHEN ATTACKING]`, `[DOUBLE ATTACK]`, `[BANISH]`.
10. **Afiliações / Subtipos (`subtypes`):**  
    Varredura de traços famosos como `Straw Hat Crew`, `Navy`, `Big Mom Pirates`, `Land of Wano`, `Supernovas`, `Germa 66`, `CP9`, etc.
11. **Cor da Carta (`colors`):**  
    Identifica menções de cores (`Red`, `Green`, `Blue`, `Purple`, `Black`, `Yellow`).
12. **Desempate Semântico por Efeito (`effectEn`):**  
    Pontua termos de efeito com 4+ letras reconhecidos no frame.
13. **Badges em Tempo Real no HUD e Telemetria:**  
    O HUD exibe tags coloridas em tempo real mostrando exatamente quais dados a câmera reconheceu no instante da mira. O botão `[🐛 Debug]` permite inspecionar a imagem do frame e os sinais extraídos.
14. **Desempate Estrito (Zero Chutes):**  
    Eliminado o gatilho cego de match por pontuação isolada. Um card só abre 100% automático se for **Código Exato Confirmado** ou se tiver vantagem clara de no mínimo 3 pontos sobre o segundo colocado. Havendo empate técnico, a escolha é delegada ao usuário.
15. **Tela Intermediária de Candidatos (`CandidateModal`):**  
    Ao identificar múltiplos candidatos fortes (ex: múltiplos *Kin'emons* ou *Yamatos* de mesmo custo e poder), o scanner pausa a captura e abre um modal limpo e confortável com a lista de cards, comparativos visuais (Poder, Custo, **Counter**, Cor, Efeito) e chips de sinais detectados. O usuário pode relaxar os braços e escolher a carta certa ou clicar em voltar para a câmera.

---

## 5. Manutenção de Dados: Como Ingerir Novas Coleções

Quando a Bandai lançar novas coleções (ex: `OP-18`, `ST-29`), siga o passo a passo:

### 1. Ingestão de Boosters e Starters:
Adicione o código do pacote na lista `OFFICIAL_SETS` dentro de [`scripts/ingest_cards.js`](file:///c:/Users/raulj/Documents/Git/Nova%20pasta/scripts/ingest_cards.js) e execute:
```bash
node scripts/ingest_cards.js
```

### 2. Ingestão de Novas Promos `P-`:
Execute o script de promos para buscar os pacotes oficiais mais recentes:
```bash
node scripts/ingest_promos.js
```

### 3. Fatiamento Modular:
Para separar o novo set em sua respectiva pasta (`src/data/cards/sets/`):
```bash
node scripts/split_cards.js
```

### 4. Compilação das Traduções:
O compilador formal aplica todos os moldes de frases da Bandai automaticamente:
```bash
node scripts/fix_translations.js
```

### 5. Auditoria de Qualidade:
Verifique se restou qualquer palavra em inglês fora do padrão:
```bash
node scripts/audit_words.js
```

### 6. Build & Validação:
```bash
npm run build
```

---

## 6. Convenções de Tradução e Regras Gramaticais

Para manter a consistência com a comunidade de jogadores e juízes:
* **`Deck`:** Mantido estritamente como **`Deck`** (nunca "baralho").
* **`Trash`:**
  - Como ação/custo: **`Descartar`** *(ex: "Você pode descartar 1 carta da sua mão")*.
  - Como área física de jogo: **`Lixeira`** *(ex: "jogue da sua lixeira")*.
* **`Rest / Rested`:** **`Descansar`** / **`Descansada(s)`**.
* **`Active`:** **`Ativa(s)`** *(ex: "coloque até 1 carta de DON!! como ativa")*.
* **`Life Cards`:** **`Cartas de Vida`**.
* **`K.O.`:** **`Dê K.O.`** / **`Nocauteado`**.
* **Cores:** `Vermelho(a)`, `Azul`, `Verde`, `Roxo(a)`, `Preto(a)`, `Amarelo(a)`.
* **Atributos:** `<Corte>`, `<Impacto>`, `<Distância>`, `<Especial>`, `<Sabedoria>`.

---

## 7. Quality Gate & Comandos de Validação

Antes de enviar qualquer alteração para produção, execute os comandos:

```bash
# 1. Auditoria léxica de textos
node scripts/audit_words.js

# 2. Compilação TypeScript e empacotamento Vite PWA
npm run build

# 3. Teste em servidor de pré-visualização local
npm run preview
```

---

## 8. Aviso Legal & Isenção de Responsabilidade (Disclaimer)

O **Haki da Leitura** é um aplicativo **não oficial** desenvolvido por e para fãs da comunidade de jogadores de cartas no Brasil.

* O projeto **NÃO possui qualquer vínculo, afiliação, patrocínio ou endosso** da **Bandai Co., Ltd.**, **Eiichiro Oda**, **Shueisha** ou **Toei Animation**.
* *One Piece Card Game* e todos os materiais associados são marcas registradas e propriedade intelectual de seus respectivos detentores.
* Esta ferramenta destina-se unicamente ao auxílio e acessibilidade linguística de jogadores da comunidade lusófona.
