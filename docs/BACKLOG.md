# 📋 Backlog de Evolução do Produto — Haki da Leitura

Este documento registra as tarefas de melhoria, automação e novas funcionalidades para a evolução contínua do **Haki da Leitura** pós-MVP.

---

## 🚀 Épicos e Status Geral

- [x] **Épico 1: Automação de Ingestão & Painel de Sincronização (ADM)**
- [ ] **Épico 2: Revisão & Polimento de Telas e UX Mobile**
- [ ] **Épico 3: Deploy Contínuo (Vercel / Cloudflare Pages) & Produção**
- [ ] **Épico 4: Melhorias de OCR & Motor de Matching**
- [ ] **Épico 5: Recursos de Comunidade & Ferramentas de Jogador**

---

## 📌 Tarefas Detalhadas

### Épico 1: Automação de Ingestão & Painel de Sincronização (ADM)
- [x] **TASK-01:** Criar workflow do GitHub Actions (`.github/workflows/sync-cards.yml`) com cron semanal para buscar novas coleções no *Punk Records*.
- [x] **TASK-02:** Adicionar passo de validação léxica (`audit_words.js`) e build no workflow antes de commitar dados automaticamente.
- [x] **TASK-03:** Criar tela/modal administrativo simples protegido por PIN/Chave no PWA para acionar a sincronização sob demanda via GitHub Repository Dispatch API.
- [x] **TASK-04:** Configurar alerta/notificação quando novas cartas forem detectadas e traduzidas.

### Épico 2: Revisão & Polimento de Telas e UX Mobile (Em Andamento)
- [x] **TASK-05:** Revisão da tela principal e visor de escaneamento ([`ScannerOverlay.tsx`](../src/components/ScannerOverlay.tsx)): foco de câmera, feedback tátil, controles rápidos e badges de HUD.
- [x] **TASK-06:** Revisão da tela intermediária de desempate ([`CandidateModal.tsx`](../src/components/CandidateModal.tsx)): ergonomia de toque, visualização comparativa e clareza de atributos.
- [ ] **TASK-07:** Revisão da ficha de detalhes ([`CardDetail.tsx`](../src/components/CardDetail.tsx)): legibilidade de fontes, cores temáticas por atributo/cor da carta e badges de tags interativas.
- [ ] **TASK-08:** Revisão da gaveta de regras ([`KeywordDrawer.tsx`](../src/components/KeywordDrawer.tsx)) e do glossário global ([`GlossaryModal.tsx`](../src/components/GlossaryModal.tsx)): consistência dos textos explicativos e navegação por toque.
- [ ] **TASK-09:** Revisão da busca manual ([`ManualSearchModal.tsx`](../src/components/ManualSearchModal.tsx)): debounce, performance da lista virtualizada e feedback de resultado vazio.
- [ ] **TASK-10:** Revisão de navegação e controles globais ([`Navigation.tsx`](../src/components/Navigation.tsx), [`NavigationDrawer.tsx`](../src/components/NavigationDrawer.tsx), [`PieMenu.tsx`](../src/components/PieMenu.tsx)).

### Épico 3: Deploy & Infraestrutura de Produção
- [x] **TASK-11:** Inicializar repositório Git local (`git init`, `.gitignore` e primeiro commit semântico).
- [ ] **TASK-12:** Configurar projeto na Vercel ou Cloudflare Pages com build `npm run build` e diretório de saída `dist`.
- [x] **TASK-13:** Configurar headers de cache agressivo para assets estáticos e service worker PWA no arquivo de configuração da hospedagem (`vercel.json` ou `_headers`).
- [ ] **TASK-14:** Validar instalação do PWA ("Adicionar à Tela Inicial") e funcionamento offline em dispositivo móvel real via URL de produção.

### Épico 4: Refinamento de OCR & Tradução Contínua
- [ ] **TASK-15:** Ampliar regras em [`scripts/fix_translations.js`](../scripts/fix_translations.js) para zerar os resíduos em inglês mapeados no `audit_words.js`.
- [ ] **TASK-16:** Otimização de Web Worker do Tesseract.js para carregamento assíncrono sob demanda (reduzir consumo de memória inicial).

---

## 🏷️ Critérios de Aceite para Deploy do MVP
1. Zero erros de TypeScript (`npm run build`).
2. Interface responsiva em resoluções mobile (360px a 430px de largura).
3. Todas as rotas/modais abrindo e fechando suavemente sem quebras.
4. Escaneamento com fallback direto e intuitivo para busca manual.
