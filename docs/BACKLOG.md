# 📋 Backlog de Evolução do Produto — Haki da Leitura

Este documento registra as tarefas de melhoria, automação e novas funcionalidades para a evolução contínua do **Haki da Leitura** pós-MVP.

---

## 🚀 Épicos e Status Geral

- [x] **Épico 1: Automação de Ingestão & Painel de Sincronização (ADM)**
- [x] **Épico 2: Revisão & Polimento de Telas e UX Mobile**
- [x] **Épico 3: Deploy Contínuo (Cloudflare Pages) & Produção**
- [ ] **Épico 4: Refinamento de OCR & Tradução Contínua**
- [ ] **Épico 5: Recursos de Comunidade & Ferramentas de Jogador**

---

## 📌 Tarefas Detalhadas

### Épico 1: Automação de Ingestão & Painel de Sincronização (ADM) (Concluído)
- [x] **TASK-01:** Criar workflow do GitHub Actions (`.github/workflows/sync-cards.yml`) com cron semanal para buscar novas coleções no *Punk Records*.
- [x] **TASK-02:** Adicionar passo de validação léxica (`audit_words.js`) e build no workflow antes de commitar dados automaticamente.
- [x] **TASK-03:** Criar tela/modal administrativo simples protegido por PIN/Chave no PWA para acionar a sincronização sob demanda via GitHub Repository Dispatch API.
- [x] **TASK-04:** Configurar alerta/notificação quando novas cartas forem detectadas e traduzidas.

### Épico 2: Revisão & Polimento de Telas e UX Mobile (Concluído)
- [x] **TASK-05:** Revisão da tela principal e visor de escaneamento ([`ScannerOverlay.tsx`](../src/components/ScannerOverlay.tsx)): foco de câmera, feedback tátil, controles rápidos e badges de HUD.
- [x] **TASK-06:** Revisão da tela intermediária de desempate ([`CandidateModal.tsx`](../src/components/CandidateModal.tsx)): ergonomia de toque, visualização comparativa e clareza de atributos.
- [x] **TASK-07:** Revisão da ficha de detalhes ([`CardDetail.tsx`](../src/components/CardDetail.tsx)): legibilidade de fontes, cores temáticas por atributo/cor da carta e badges de tags interativas.
- [x] **TASK-08:** Revisão da gaveta de regras ([`KeywordDrawer.tsx`](../src/components/KeywordDrawer.tsx)) e do glossário global ([`GlossaryModal.tsx`](../src/components/GlossaryModal.tsx)): consistência dos textos explicativos, suporte a tecla Escape e navegação por toque.
- [x] **TASK-09:** Revisão da busca manual ([`ManualSearchModal.tsx`](../src/components/ManualSearchModal.tsx)): debounce, performance da lista virtualizada, fechamento suave e feedback de resultado vazio.
- [x] **TASK-10:** Revisão de navegação e controles globais: remoção de arquivos legados não utilizados (`Navigation.tsx`, `PieMenu.tsx`) e consolidação em [`Header.tsx`](../src/components/Header.tsx) + [`NavigationDrawer.tsx`](../src/components/NavigationDrawer.tsx).

### Épico 3: Deploy & Infraestrutura de Produção (Concluído)
- [x] **TASK-11:** Inicializar repositório Git local (`git init`, `.gitignore` e primeiro commit semântico).
- [x] **TASK-12:** Configurar projeto na Cloudflare Pages com build `npm run build` e diretório de saída `dist`.
- [x] **TASK-13:** Configurar headers de cache agressivo para assets estáticos e service worker PWA no arquivo de configuração da hospedagem (`vercel.json` ou `_headers`).
- [x] **TASK-14:** Validar instalação do PWA ("Adicionar à Tela Inicial") e funcionamento offline em dispositivo móvel real via URL de produção da Cloudflare.

### Épico 4: Refinamento de OCR & Tradução Contínua
- [x] **TASK-15:** Ampliar regras em [`scripts/fix_translations.js`](../scripts/fix_translations.js) para zerar os resíduos em inglês mapeados no `audit_words.js`.
- [x] **TASK-16:** Otimização de Web Worker do Tesseract.js para carregamento assíncrono sob demanda via dynamic import (reduzindo consumo de memória e tempo inicial de carga).
- [x] **TASK-17:** Refinamento léxico exaustivo, regras de concordância sintática PT-BR (Nami OP03-040, Reiju OP06-042, Luffy OP01-024) e atualização de pílulas de regras interativas (`[DON!! xN]`, `[Activate: Main]`, `[On Block]`).
- [x] **TASK-18:** Ingestão Automática de Coleções Inéditas (Bandai API) & Tradução via Google Gemini Flash API (Free Tier) integrada ao GitHub Actions (`.github/workflows/sync-cards.yml`) com sanitização determinística.
- [x] **TASK-19:** Refatoração SOLID da pasta `scripts/` (`scripts/lib/card_parser.js`, `card_loader.js`, `translation_rules.js`), unificando `ingest_cards.js` e `ingest_promos.js` em um único motor de ingestão e eliminando duplicações.
- [ ] **TASK-23:** Otimização Avançada do Motor de OCR & Filtro Anti-Reflexo/Glare ([`ScannerOverlay.tsx`](../src/components/ScannerOverlay.tsx)):
  - Implementar pipeline de pré-processamento de imagem no Canvas (equalização de histograma, atenuação de reflexos de luz/glare em sleeves transparentes, ajuste adaptativo de contraste e binarização de ROI) para maximizar a taxa de acerto do Tesseract.js sob iluminação adversa.
- [ ] **TASK-24:** Avaliação de Aprendizado de Máquina (Machine Learning / WebML) para Seleção e Classificação de Cartas ([`ScannerOverlay.tsx`](../src/components/ScannerOverlay.tsx)):
  - Avaliar a viabilidade de integrar um modelo leve de Machine Learning no cliente (ex: ONNX Runtime Web / MobileNet / embeddings visuais) para classificação e ordenação de candidatos a cartas sem exigir grandes refatorações na arquitetura offline-first.

### Épico 5: Recursos de Comunidade & Ferramentas de Jogador
- [ ] **TASK-20:** Filtros Específicos por Atributos (9 Menus Suspensos) na Busca Manual ([`ManualSearchModal.tsx`](../src/components/ManualSearchModal.tsx)):
  - **Descrição:** Implementação de grade/linha de 9 seletores suspensos (dropdowns) com design dark glassmorphism e iluminação temática para filtragem refinada de cartas no modal de busca manual.
  - **Especificação Técnica dos 9 Seletores:**
    1. **Set (Coleção):** Filtrar por `setId` (ex: OP-01, OP-02, ..., EB-01, ST-01, PROMO).
    2. **Type (Tipo):** Leader, Character, Event, Stage.
    3. **Color (Cor):** Red, Green, Blue, Purple, Black, Yellow, Multi.
    4. **Attribute (Atributo):** Strike, Slash, Special, Wisdom, Ranged.
    5. **Cost (Custo):** 0 a 10+.
    6. **Power (Poder):** Faixas de poder (0-2000, 3000-5000, 6000-8000, 9000-11000, 12000+).
    7. **Counter (Contra-Ataque):** Sem Counter, +1000, +2000.
    8. **Rarity (Raridade):** C, UC, R, SR, SEC, L, SP, P (inferido de `cardType` / `code` se não preenchido no JSON).
    9. **Block (Bloco de Rotação de Formato):** Número do bloco impresso nas cartas físicas OPTCG para controle de rotação no formato Standard (Bloco 1, Bloco 2, Bloco 3, Bloco 4, Bloco 5+).
  - **Mapeamento do Bloco de Rotação (*Block Number*):**
    - **Bloco 1 (`[1]`):** `OP01` a `OP04`, `ST01` a `ST10`, `EB01`, Promos 2022-2023.
    - **Bloco 2 (`[2]`):** `OP05` a `OP08`, `ST11` a `ST14`, `EB02` a `EB03`, Promos 2024.
    - **Bloco 3 (`[3]`):** `OP09` a `OP12`, `ST15` a `ST21`, `EB04` a `EB05`, Promos 2025.
    - **Bloco 4 (`[4]`):** `OP13` a `OP15`, `ST22` a `ST28`.
    - **Bloco 5 (`[5]`):** `OP16` e `OP17`, `ST29+`, `EB06+`.
  - **Subtarefas de Desenvolvimento:**
    - *Subtarefa 20.1:* Estender a interface `Card` em [`src/types/index.ts`](../src/types/index.ts) adicionando `rarity?: string;` e `block?: number;`.
    - *Subtarefa 20.2:* Criar função utilitária `getCardBlockNumber(card: Card): number` em [`src/utils/formatters.ts`](../src/utils/formatters.ts) para inferência determinística do número do bloco por prefixo da coleção.
    - *Subtarefa 20.3:* Atualizar a função de busca composta `searchCards` em [`src/utils/cardSearch.ts`](../src/utils/cardSearch.ts) com avaliação booleana composta de performance para os 9 filtros simultâneos.
    - *Subtarefa 20.4:* Construir a interface responsiva dos 9 dropdowns em [`src/components/ManualSearchModal.tsx`](../src/components/ManualSearchModal.tsx) com botão "Limpar Filtros" e contador de resultados.
- [ ] **TASK-21:** Empacotamento do PWA para Aplicativo Móvel Nativo (Capacitor / TWA / Stores):
  - Converter/empacotar a aplicação Web PWA para aplicativo móvel distribuível (Android/iOS via Capacitor ou Trusted Web Activity) pronto para publicação nas lojas de aplicativos.
- [ ] **TASK-22:** Abstração da Engine para Suporte Genérico Multi-TCG (Qualquer Card Game):
  - Desacoplar os esquemas de dados, regras gramaticais e motor de OCR de One Piece Card Game em uma arquitetura modular baseada em adaptadores/plugins, permitindo reaproveitar o scanner e tradutor para outros jogos de cartas (ex: Lorcana, Pokémon, Magic, Yu-Gi-Oh!).

---

## 🏷️ Critérios de Aceite para Deploy do MVP
1. Zero erros de TypeScript (`npm run build`).
2. Interface responsiva em resoluções mobile (360px a 430px de largura).
3. Todas as rotas/modais abrindo e fechando suavemente sem quebras.
4. Escaneamento com fallback direto e intuitivo para busca manual.
