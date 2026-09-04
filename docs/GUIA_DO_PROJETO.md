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

## 7. Padrão de Navegação Mobile & History API (Botão Voltar em Telas e Modais)

Como o **Haki da Leitura** é uma Progressive Web App (PWA) de página única (SPA), o usuário mobile utiliza intensamente gestos laterais de deslize ou o botão de "Voltar" nativo do aparelho (Android/iOS) para fechar telas e modais.

### ⚠️ Regra de Ouro da Arquitetura:
> **Nenhuma tela, modal, gaveta (drawer) ou painel de sobreposição pode abrir sem registrar entrada na History API.**  
> Se o usuário abrir um elemento sobreposto e acionar o "Voltar" do celular, o elemento **DEVE** fechar e retornar à visualização anterior, sem jamais fechar a aba ou sair do site.

### Mapeamento das Rotas e Hashes do Sistema:
| Visualização / Tela / Modal | Hash da URL | Componente Responsável |
| :--- | :--- | :--- |
| **Scanner / Viewfinder Inicial** | `/` (raiz sem hash) | [`ScannerOverlay.tsx`](../src/components/ScannerOverlay.tsx) |
| **Ficha Detalhada da Carta** | `/#card=OP01-025` | [`CardDetail.tsx`](../src/components/CardDetail.tsx) |
| **Tela de Desempate (Candidatos)** | `/#candidates` | [`CandidateModal.tsx`](../src/components/CandidateModal.tsx) |
| **Gaveta de Regra Contextual** | `/#rule=blocker` | [`KeywordDrawer.tsx`](../src/components/KeywordDrawer.tsx) |
| **Menu Lateral (Hambúrguer)** | `/#menu` | [`NavigationDrawer.tsx`](../src/components/NavigationDrawer.tsx) |
| **Dicionário Global de Regras** | `/#glossary` | [`GlossaryModal.tsx`](../src/components/GlossaryModal.tsx) |
| **Busca Manual de Cartas** | `/#search` | [`ManualSearchModal.tsx`](../src/components/ManualSearchModal.tsx) |
| **Painel de Debug e Telemetria** | `/#debug` | [`ScannerOverlay.tsx`](../src/components/ScannerOverlay.tsx) |
| **Painel de Administração (Sincronização)** | `/#admin` ou `/admin` | [`AdminSyncModal.tsx`](../src/components/AdminSyncModal.tsx) |

### Padrão para Desenvolvimento de Novas Telas/Modais:
Ao criar uma nova página, modal ou gaveta:
1. **Ao Abrir:** Adicione entrada na pilha do histórico:
   ```typescript
   window.history.pushState({ view: 'minha-tela' }, '', '#minha-tela');
   ```
2. **Escuta de `popstate`:** No componente ou no orquestrador ([`App.tsx`](../src/App.tsx)), capture o evento para fechar a visualização quando o usuário voltar:
   ```typescript
   useEffect(() => {
     const handlePopState = () => {
       if (window.location.hash !== '#minha-tela' && isOpen) {
         setIsOpen(false);
       }
     };
     window.addEventListener('popstate', handlePopState);
     return () => window.removeEventListener('popstate', handlePopState);
   }, [isOpen]);
   ```
3. **Ao Fechar pelo "X" ou Botão da UI:**
   ```typescript
   const handleClose = () => {
     if (window.location.hash === '#minha-tela') {
       window.history.back();
     } else {
       setIsOpen(false);
     }
   };
   ```
4. **Acessibilidade:** Capture a tecla `Escape` (`keydown`) para garantir paridade em teclados desktop/físicos.

---

## 8. Quality Gate & Comandos de Validação

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

## 9. Aviso Legal & Isenção de Responsabilidade (Disclaimer)

O **Haki da Leitura** é um aplicativo **não oficial** desenvolvido por e para fãs da comunidade de jogadores de cartas no Brasil.

* O projeto **NÃO possui qualquer vínculo, afiliação, patrocínio ou endosso** da **Bandai Co., Ltd.**, **Eiichiro Oda**, **Shueisha** ou **Toei Animation**.
* *One Piece Card Game* e todos os materiais associados são marcas registradas e propriedade intelectual de seus respectivos detentores.
* Esta ferramenta destina-se unicamente ao auxílio e acessibilidade linguística de jogadores da comunidade lusófona.

---

## 10. Fluxo de Desenvolvimento em Produção (Git & CI/CD)

Com o **Haki da Leitura** publicado na Cloudflare, qualquer alteração enviada para a branch `main` dispara o deploy contínuo imediatamente.

### 🛡️ Regra de Governança de Branches:
* **Branch `main`:** É o código que está rodando em produção para os usuários. Nunca faça testes instáveis diretamente nela.
* **Branches de Trabalho (`feature/...` e `fix/...`):** Toda melhoria ou correção deve ser feita em uma branch isolada.

### Ciclo de Desenvolvimento Recomendado:
1. **Criar uma nova branch a partir da `main` atualizada:**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b fix/camera-resilience
   # ou
   git checkout -b feat/hybrid-lexicon
   ```
2. **Desenvolver e validar localmente:**
   ```bash
   npm run dev      # Servidor local de desenvolvimento
   npm run build    # Quality Gate obrigatório (TypeScript + Vite)
   ```
3. **Enviar a branch para revisão/homologação:**
   ```bash
   git add .
   git commit -m "fix(camera): adiciona watchdog e recuperacao de stream mobile"
   git push origin fix/camera-resilience
   ```
4. **Mesclar com a `main` para Produção:**
   ```bash
   git checkout main
   git merge fix/camera-resilience
   git push origin main
   ```
   *(A Cloudflare compilará e atualizará o site em produção em ~40 segundos).*

---

## 11. Backlog de Evolução do Produto (Priorizado)

### 📌 Épico A: Estabilidade do Scanner & Câmera (Alta Prioridade)
- [x] **Watchdog & Recuperação de Câmera:** Detecção de stream congelado/preto após segundo plano ou lock screen no mobile, com reinicialização automática e botão de reconexão manual (`RefreshCw`).
- [x] **Limpeza de UI de Produção:** Remoção do botão de debug, do painel flutuante de OCR e do banner de texto bruto (`Lido: "..."`).
- [ ] **Filtro Anti-Reflexo no Canvas:** Pré-processamento com algoritmo de supressão de highlights especulares e equalização adaptativa (CLAHE simplificado) para contornar reflexos de lâmpadas em shields/sleeves plásticos brilhantes.

### 📌 Épico B: Normalização Léxica Híbrida Oficial (Paridade com Torneio)
- [ ] **Termos de Regra em Inglês no Corpo da Carta:** Manter palavras-chave técnicas em inglês no texto principal da carta (`[Blocker]`, `[Rush]`, `[On Play]`, `[When Attacking]`, `[Trigger]`, `[Double Attack]`, `[Banish]`, `[Activate: Main]`) para paridade 100% com a carta física do jogador.
- [ ] **Explicação Didática em Português na Ficha Técnica (`CardDetail`):** Transformar cada palavra-chave em um badge clicável que abre a gaveta explicativa oficial em português com exemplos de timing e regras.

### 📌 Épico C: Anatomia Dinâmica dos Tipos de Carta
- [ ] **Molduras Anatômicas Adaptativas:** Refinar os wireframes da moldura de mira no scanner para cada tipo de carta:
  - **Personagem:** Topo esquerdo (Custo), topo direito (Poder/Atributo), lateral (Counter).
  - **Líder:** Topo direito (Poder), base direita (Vidas).
  - **Evento:** Topo esquerdo (Custo), área central (Texto do efeito e faixa de Trigger).
  - **Palco:** Topo esquerdo (Custo), área inferior (Efeito contínuo).
- [ ] **Seletor de Tipo Ergonômico:** Visual aprimorado com micro-interações táteis e cores oficiais de cada categoria de carta.

### 📌 Épico D: Motor de Busca Avançada
- [ ] **Filtros Combinados:** Adicionar filtros visuais na busca manual por Cor, Custo (1 a 10), Poder (1000 a 12000), Tipo e Coleção/Set.
- [ ] **Ordenação Flexível:** Ordenar resultados por número de coleção, menor/maior custo ou ordem alfabética.

