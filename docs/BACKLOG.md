# 📋 Backlog de Evolução do Produto — Haki da Leitura

Este documento registra as tarefas de melhoria, automação e novas funcionalidades para a evolução contínua do **Haki da Leitura** pós-MVP.

---

## 🚀 Épicos e Status Geral

- [x] **Épico 1: Automação de Ingestão & Painel de Sincronização (ADM)**
- [x] **Épico 2: Revisão & Polimento de Telas e UX Mobile**
- [ ] **Épico 3: Deploy Contínuo (Vercel / Cloudflare Pages) & Produção**
- [x] **Épico 4: Melhorias de OCR & Motor de Matching**
- [ ] **Épico 5: Recursos de Comunidade & Ferramentas de Jogador**

---

## 📌 Tarefas Detalhadas

### Épico 1: Automação de Ingestão & Painel de Sincronização (ADM)
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

### Épico 3: Deploy & Infraestrutura de Produção
- [x] **TASK-11:** Inicializar repositório Git local (`git init`, `.gitignore` e primeiro commit semântico).
- [ ] **TASK-12:** Configurar projeto na Vercel ou Cloudflare Pages com build `npm run build` e diretório de saída `dist`.
- [x] **TASK-13:** Configurar headers de cache agressivo para assets estáticos e service worker PWA no arquivo de configuração da hospedagem (`vercel.json` ou `_headers`).
- [ ] **TASK-14:** Validar instalação do PWA ("Adicionar à Tela Inicial") e funcionamento offline em dispositivo móvel real via URL de produção.

### Épico 4: Refinamento de OCR & Tradução Contínua
- [x] **TASK-15:** Ampliar regras em [`scripts/fix_translations.js`](../scripts/fix_translations.js) para zerar os resíduos em inglês mapeados no `audit_words.js`.
- [x] **TASK-16:** Otimização de Web Worker do Tesseract.js para carregamento assíncrono sob demanda via dynamic import (reduzindo consumo de memória e tempo inicial de carga).
- [x] **TASK-17:** Refinamento léxico exaustivo, regras de concordância sintática PT-BR (Nami OP03-040, Reiju OP06-042, Luffy OP01-024) e atualização de pílulas de regras interativas (`[DON!! xN]`, `[Activate: Main]`, `[On Block]`).
- [x] **TASK-18:** Ingestão Automática de Coleções Inéditas (Bandai API) & Tradução via Google Gemini Flash API (Free Tier) integrada ao GitHub Actions (`.github/workflows/sync-cards.yml`) com sanitização determinística.
- [x] **TASK-19:** Refatoração SOLID da pasta `scripts/` (`scripts/lib/card_parser.js`, `card_loader.js`, `translation_rules.js`), unificando `ingest_cards.js` e `ingest_promos.js` em um único motor de ingestão e eliminando duplicações.

---

## 🏷️ Critérios de Aceite para Deploy do MVP
1. Zero erros de TypeScript (`npm run build`).
2. Interface responsiva em resoluções mobile (360px a 430px de largura).
3. Todas as rotas/modais abrindo e fechando suavemente sem quebras.
4. Escaneamento com fallback direto e intuitivo para busca manual.
