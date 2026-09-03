# 👁️ Haki da Leitura — Scanner & Tradutor de OPTCG em Português

O **Haki da Leitura** é um Progressive Web App (PWA) Mobile-First projetado para jogadores e juízes de *One Piece Card Game* (OPTCG). Ele permite escanear ou buscar qualquer carta física e obter instantaneamente a ficha traduzida em Português do Brasil com explicações interativas de regras e timings (*On Play*, *Blocker*, *Rush*, *Rush: Character*, *Trigger*, *When Attacking*, etc.).

---

## 🚀 Como Executar

### 1. Execução via Docker (Recomendado)

#### Modo Desenvolvimento:
```bash
docker compose up app-dev
```
Acesse `http://localhost:5173` no navegador.

#### Modo Produção Containerizado:
```bash
docker compose up app-prod --build
```
Acesse `http://localhost:8080` no navegador.

---

### 2. Execução Local (Node.js)

```bash
# Instalar dependências
npm install

# Rodar servidor de desenvolvimento (acessível na rede local)
npm run dev

# Build de produção
npm run build
```

---

## 📱 Como Testar no Celular Android Real

O Google Chrome no Android exige **HTTPS** para liberar a câmera física (`getUserMedia`).

### Opção A — Tunnel HTTPS em Tempo Real (Desenvolvimento)
1. Inicie o servidor dev local: `npm run dev`
2. Em outro terminal, rode o túnel seguro:
   ```bash
   npx cloudflared tunnel --url http://localhost:5173
   ```
3. Abra a URL `https://...trycloudflare.com` gerada pelo terminal no seu celular Android.

---

## 📄 Documentação Técnica & Arquitetura

Toda a documentação aprofundada do projeto está organizada na pasta [`docs/`](./docs/):

- 👉 **[Guia do Projeto & Manutenção](docs/GUIA_DO_PROJETO.md)** — Fluxo de ingestão de novas coleções, partição de dados e auditoria léxica.
- 👉 **[Arquitetura & Especificação](docs/ARQUITETURA.md)** — Modelagem técnica, motor de matching multi-sinal, PWA offline e fluxo de dados.
- 👉 **[Backlog do Projeto](docs/BACKLOG.md)** — Roadmap, novas funcionalidades e melhorias mapeadas.

### Estrutura do Código-Fonte:
- `src/data/cards/` — Base modular de cartas particionada (54 coleções: Boosters, Starters, EBs e Promos).
- `scripts/` — Scripts de ingestão, compilação de tradução padronizada da comunidade (`fix_translations.js`) e auditoria léxica (`audit_words.js`).
- `src/components/` — Componentes React (ScannerOverlay, CardDetail, KeywordDrawer, ManualSearchModal, GlossaryModal).
- `Dockerfile` / `docker-compose.yml` — Containerização para desenvolvimento e produção.

---

## ⚖️ Aviso Legal & Isenção de Responsabilidade (Disclaimer)

O **Haki da Leitura** é um projeto **não oficial** desenvolvido por e para fãs da comunidade de jogadores de cartas no Brasil. 

* O projeto **NÃO possui qualquer vínculo, afiliação, patrocínio ou endosso** da **Bandai Co., Ltd.**, **Eiichiro Oda**, **Shueisha** ou **Toei Animation**.
* *One Piece Card Game* e todos os nomes, marcas, logotipos, artes e materiais associados são marcas registradas e propriedade intelectual exclusiva de seus respectivos detentores.
* Esta ferramenta tem fins estritamente comunitários, educacionais e de auxílio na interpretação de regras em idioma local, sem finalidade de substituição das cartas físicas.
