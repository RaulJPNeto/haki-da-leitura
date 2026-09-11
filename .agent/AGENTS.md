# AGENTS.md — Haki da Leitura

## 1. Objetivo

Este documento define **como o agente de IA deve atuar neste projeto**.

As regras globais do usuário e do agente permanecem estritamente válidas. Este arquivo estabelece os padrões técnicos, arquiteturais e de qualidade específicos do **Haki da Leitura** (Scanner & Tradutor de One Piece Card Game em Português).

---

## 2. Contexto Técnico

O projeto é uma aplicação web progressiva (**PWA**) **100% Client-Side** (Offline-First):

* **Frontend:** React 19, TypeScript estrito, Vite e Tailwind CSS 4.
* **Processamento no Cliente:** Tesseract.js (OCR via WebAssembly / Web Workers), HTML5 Canvas (pré-processamento de imagens e corte de ROI) e Dexie.js (IndexedDB).
* **Base de Cartas:** Particionada de forma modular em `src/data/cards/` (sets, starters, extra-boosters, promos) com agregador estático.
* **Scripts de Dados (Node.js):** Scripts em `scripts/` para ingestão da Bandai, compilação de tradução oficial (`fix_translations.js`) e auditoria léxica (`audit_words.js`).
* **Infraestrutura:** Docker e Docker Compose (Nginx multi-stage para produção, Node para desenvolvimento), distribuição estática via Cloudflare Pages / Vercel Edge CDN.
* **Qualidade e Validação:** `npm run build` (`tsc -b && vite build`) e `node scripts/audit_words.js`.

> **Aviso Arquitetural:** O projeto **NÃO possui backend Node/Express, nem banco de dados relacional (PostgreSQL), nem autenticação JWT**. Não crie controllers, services ou repositórios de backend.

---

## 3. Princípios de Desenvolvimento

* Preserve a arquitetura Client-Side e os padrões já existentes.
* **Mobile-First & Eficiência:** O app roda em navegadores mobile sob recursos limitados de CPU e bateria. Evite re-renders desnecessários no loop de câmera/OCR.
* **KISS (Keep It Simple, Stupid):** Prefira a solução mais simples e direta.
* **YAGNI (You Aren't Gonna Need It):** Não crie abstrações ou complexidades para cenários hipotéticos futuros.
* **Tipagem Estrita:** Mantenha contratos de tipos TypeScript rigorosos em `src/types/` (ex: `Card`, `Keyword`). Nunca use `any`.
* **Padrão Obrigatório de Navegação Mobile & History API (Botão Voltar):**
  - **Zero Fechamentos Acidentais:** Toda tela, modal, gaveta (drawer) ou painel de sobreposição DEVE integrar-se à HTML5 History API (`pushState` com hash semântico, ex: `#card=...`, `#candidates`, `#rule=...`, `#menu`, `#glossary`, `#search`, `#admin`).
  - **Captura de `popstate`:** O componente deve escutar `popstate` para que o gesto ou botão "Voltar" do celular (Android/iOS) feche a sobreposição e retorne ao scanner sem fechar a aba do navegador.
  - **Fechamento via UI:** Ao fechar pelo "X" ou botão da interface, invoque `window.history.back()` se o hash correspondente estiver ativo, mantendo a pilha sincronizada.
  - **Acessibilidade Teclado:** Todo modal/drawer deve escutar a tecla `Escape` para fechar.

---

## 4. Diretrizes de Automação e Execução

* **NUNCA execute testes automatizados na tela, cliques, navegação autônoma ou interações com a interface do usuário por conta própria.**
* É proibido o uso de ferramentas de automação visual sem ordem direta e explícita do usuário.
* Limite-se estritamente à geração de código, escrita de documentação, arquitetura e planejamento.
* Testes manuais devem ser orientados ao desenvolvedor com instruções claras de validação.

---

## 5. Motor de Matching Visual & Scanner (`ScannerOverlay.tsx`)

Ao realizar manutenções ou melhorias no leitor de cartas:

1. **Camadas de Sinais:** Respeite o motor de matching multi-sinal (código oficial, set, cardType, atributo de batalha, poder, custo/vida, counter, trigger, keywords, subtipos, cores e efeito).
2. **Zero Chutes (Anti-Falso Positivo):** Nunca force uma identificação cega por score isolado. Se houver empate técnico ou incerteza, utilize o fluxo de desempate intermediário (`CandidateModal.tsx`).
3. **Performance do OCR:** O Tesseract.js e o processamento de imagem no Canvas devem rodar com o menor overhead possível, sem bloquear a thread principal da UI.

---

## 6. Banco de Dados e Manutenção de Coleções

A base de cartas é estática e particionada:

* Novos pacotes/starters devem seguir o fluxo documentado no [`GUIA_DO_PROJETO.md`](../docs/GUIA_DO_PROJETO.md):
  1. Atualizar e rodar `scripts/ingest_cards.js` ou `scripts/ingest_promos.js`.
  2. Executar `scripts/split_cards.js` para atualizar `src/data/cards/`.
  3. Executar `scripts/fix_translations.js` para aplicar o molde e gramática oficial da Bandai.
  4. Executar `scripts/audit_words.js` para verificar resíduos em inglês.
* Nunca edite manualmente arquivos JSON individuais de cartas sem sincronizar o fluxo de tradução e partição.

---

## 7. Convenções Oficiais de Tradução e Regras Gramaticais

Qualquer texto ou tradução gerada para cartas ou regras deve seguir estritamente as convenções da comunidade de juízes e jogadores de OPTCG:

* **Deck:** Mantido sempre como **Deck** (nunca traduzir como "baralho").
* **Trash:**
  * Ação/Custo: **Descartar** *(ex: "Você pode descartar 1 carta da sua mão")*.
  * Zona física: **Lixeira** *(ex: "jogue da sua lixeira")*.
* **Rest / Rested:** **Descansar** / **Descansada(s)**.
* **Active:** **Ativa(s)** *(ex: "coloque até 1 carta de DON!! como ativa")*.
* **Life Cards:** **Cartas de Vida**.
* **K.O.:** **Dê K.O.** / **Nocauteado**.
* **Atributos:** `<Corte>`, `<Impacto>`, `<Distância>`, `<Especial>`, `<Sabedoria>`.
* **Cores:** `Vermelho(a)`, `Azul`, `Verde`, `Roxo(a)`, `Preto(a)`, `Amarelo(a)`.

---

## 8. Quality Gate & Validação Obrigatória (Padrão Docker Compose)

**Aviso Importante de Ambiente:** O desenvolvedor utiliza SEMPRE o **Docker Compose** (`app-dev`). Todos os comandos de teste, validação, audit e build fornecidos nas entregas e roteiros DEVEM ser formatados utilizando o Docker Compose:

1. **Auditoria Léxica de Efeitos e Cartas:**
   ```bash
   docker compose exec app-dev node scripts/audit_words.js
   ```
2. **Checagem de Tipos TypeScript & Build de Produção:**
   ```bash
   docker compose exec app-dev npm run build
   ```
3. **Execução de Scripts da Pipeline (Ingestão / Partição / Traduções):**
   ```bash
   docker compose exec app-dev node scripts/ingest_cards.js
   docker compose exec app-dev node scripts/split_cards.js
   docker compose exec app-dev node scripts/fix_translations.js
   ```
4. **Pré-visualização Local do PWA:**
   ```bash
   docker compose exec app-dev npm run preview
   ```

> *Nota:* Se os containers estiverem parados, oriente o uso de `docker compose run --rm app-dev <comando>`.

---

## 9. Git, Versionamento e Proteção de Produção

### ⚠️ Verificação Obrigatória de Branch:
Antes de iniciar qualquer modificação ou implementação de código:
1. **Checagem de Branch:** O agente DEVE apenas verificar a branch atual (ex: `git branch --show-current`).
2. **Proibição de Criação de Branches:** O agente **NUNCA DEVE CRIAR OU ALTERAR BRANCHES** (é proibido executar comandos como `git checkout -b`, `git switch -c` ou `git branch`). Apenas o desenvolvedor cria e troca de branches.
3. **Alerta de Branch Incorreta:** Se o desenvolvedor estiver na branch `main` (que está diretamente conectada à produção/deploy contínuo da Cloudflare), o agente **DEVE AVISAR IMEDIATAMENTE** que a branch `main` é de produção, **PARAR a execução e NÃO realizar alterações de código nela**.
4. **Recomendação Semântica para o Dev:** O agente deve apenas sugerir ao desenvolvedor o comando para ele próprio criar a branch temática no terminal:
   * Para correção de bugs: `git checkout -b fix/<nome-do-bug>` (ex: `git checkout -b fix/camera-freeze`)
   * Para novas funcionalidades: `git checkout -b feat/<nome-da-feature>` (ex: `git checkout -b feat/anti-glare-filter`)
   * Para melhorias de dados/léxico: `git checkout -b chore/<nome-da-tarefa>` (ex: `git checkout -b chore/hybrid-lexicon`)

### 🚫 Comandos Proibidos:
O agente **NUNCA deve executar**:
* `git commit`
* `git push`
* `git checkout -b` / `git switch -c` / `git branch` (criação ou troca de branches)
* `git reset --hard`
* `git clean`
* Qualquer comando destrutivo no histórico.

---

## 10. Fluxo Obrigatório de Desenvolvimento (Revisão pelo Dev & Arquiteto)

Todo trabalho deve seguir rigorosamente as 4 fases abaixo:

### Fase 1: Plano de Implementação Antecipado (Validação Prévia)
* **NENHUM CÓDIGO DEVE SER ALTERADO OU CRIADO** antes que um Plano de Implementação seja apresentado ao desenvolvedor (que atua como desenvolvedor e arquiteto do projeto).
* O plano deve conter:
  1. *Objetivo & Diagnóstico:* O que será feito e por quê.
  2. *Impacto Arquitetural & Componentes:* Quais arquivos e fluxos serão tocados.
  3. *Divisão em Tarefas Incrementais:* A decomposição das etapas da implementação.
* O agente deve aguardar o **OK explícito** do desenvolvedor antes de escrever o código.

### Fase 2: Execução Fatiada em Tarefas
* O desenvolvimento deve ocorrer de forma modular, fatiado nas tarefas previamente aprovadas.
* O código gerado deve respeitar KISS, YAGNI, Clean Code e tipagem estrita (zero `any`).

### Fase 3: Roteiro de Teste e Validação Passo a Passo
* Ao concluir a implementação técnica de uma tarefa, o agente DEVE fornecer um **passo a passo detalhado de teste manual**:
  1. Como inicializar ou pré-visualizar localmente via Docker (`docker compose exec app-dev npm run dev` ou `docker compose exec app-dev npm run preview`).
  2. Quais ações específicas executar no navegador/celular (ex: abrir tela X, girar aparelho, minimizar aba, clicar em botão Y).
  3. O comportamento esperado versus o que não deve acontecer.

### Fase 4: Mensagem de Commit Apenas Após o "OK"
* **É PROIBIDO** sugerir ou entregar comandos de commit (`git add` / `git commit`) antecipadamente.
* A sugestão de commit semântico **SÓ DEVE SER APRESENTADA** após o desenvolvedor testar a solução, aprovar o resultado e enviar uma mensagem de "OK" / aprovação explícita no chat.

---

## 11. Formato da Entrega

Ao finalizar uma tarefa para revisão do desenvolvedor/arquiteto, estruture a resposta com:

### Implementação
Resumo conciso do que foi alterado ou criado.

### Arquivos
Lista com links markdown clicáveis dos arquivos modificados/criados.

### Decisões Técnicas
Explicação da abordagem adotada (KISS, YAGNI, Clean Code).

### Passo a Passo de Teste Manual
Roteiro claro e enumerado para que o desenvolvedor execute e valide a solução na sua máquina ou dispositivo.

### Status de Aprovação
Pergunta orientada para que o desenvolvedor valide o teste e forneça o OK para prosseguir com a sugestão de commit.
