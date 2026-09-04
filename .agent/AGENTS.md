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

## 8. Quality Gate & Validação Obrigatória

Antes de considerar qualquer entrega finalizada, forneça ao desenvolvedor os comandos de validação correspondentes:

1. **Auditoria Léxica de Efeitos e Cartas:**
   ```bash
   node scripts/audit_words.js
   ```
2. **Checagem de Tipos TypeScript & Build de Produção:**
   ```bash
   npm run build
   ```
3. **Pré-visualização Local do PWA:**
   ```bash
   npm run preview
   ```

---

## 9. Git e Versionamento

O agente **NÃO deve executar**:
* `git commit`
* `git push`
* `git reset --hard`
* `git clean`
* Qualquer comando destrutivo no histórico.

Antes de propor mensagens de commit, consulte o status com `git status` e/ou `git diff` e formate a sugestão de commit semântico para que o desenvolvedor execute manualmente.

---

## 10. Formato da Entrega

Ao finalizar uma tarefa, estruture a resposta com:

### Implementação
Resumo conciso do que foi alterado ou criado.

### Arquivos
Lista com links markdown clicáveis dos arquivos modificados/criados.

### Decisões Técnicas
Explicação da abordagem adotada (KISS, YAGNI, Clean Code).

### Validação
Comandos manuais que o desenvolvedor deve executar.

### Pendências / Próximos Passos
Eventuais dependências de decisão do desenvolvedor.
