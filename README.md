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

## 📱 Como Testar no Celular com TryCloudflare (Câmera Mobile)

Os navegadores em dispositivos móveis (Chrome no Android e Safari no iOS) exigem **HTTPS** para liberar a câmera física (`getUserMedia`).

### Opção A — Túnel TryCloudflare Automático (Recomendado)

1. Com o servidor local ativo (`npm run dev` ou container Docker na porta `5173`), abra outro terminal e execute:
   ```bash
   npm run tunnel
   ```
   *(Ou alternativamente: `npm run share`)*

2. O script detecta automaticamente o servidor HTTPS local e gera a URL pública segura:
   ```text
   ======================================================
   🚀 SEU LINK HTTPS TRYCLOUDFLARE PARA O CELULAR:
   👉 https://xxxx.trycloudflare.com
   ======================================================
   ```

3. Abra o link gerado no navegador do seu smartphone e autorize a permissão de câmera.

### Opção B — Execução Direta via CLI

Você também pode disparar diretamente o binário oficial do Cloudflare via `npx` sem instalar nada:
```bash
npx cloudflared tunnel --url https://localhost:5173 --no-tls-verify
```
> **Nota:** A flag `--no-tls-verify` é necessária porque o Vite utiliza o plugin `@vitejs/plugin-basic-ssl` com certificado local autoassinado. O arquivo `vite.config.ts` já possui `allowedHosts: true` para aceitar qualquer subdomínio do TryCloudflare.

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

## 🔐 Painel Administrativo e Sincronização (Acesso Restrito)

A área de manutenção de coleções e sincronização com o GitHub Actions é **oculta da interface pública** (sem botões em menus) para segurança e discrição:

* **Como Acessar:** Abra diretamente a URL `https://seu-dominio/admin` (ou com parâmetro `/?admin` / hash `/#admin`).
* **Autenticação:** Protegido por PIN de segurança (padrão inicial: `1337`).
* **Recursos:**
  - Disparo sob demanda do workflow de ingestão no GitHub Actions via GitHub API (`repository_dispatch`);
  - Acompanhamento do status da última execução e link direto para logs do GitHub;
  - Guia rápido com atalhos de terminal para execução local (`npm run sync:cards` e `npm run audit`).
  - Ao fechar a janela, a rota é limpa automaticamente da barra de endereços do navegador sem deixar rastros.

---

## ⚖️ Aviso Legal & Isenção de Responsabilidade (Disclaimer)

O **Haki da Leitura** é um projeto **não oficial** desenvolvido por e para fãs da comunidade de jogadores de cartas no Brasil. 

* O projeto **NÃO possui qualquer vínculo, afiliação, patrocínio ou endosso** da **Bandai Co., Ltd.**, **Eiichiro Oda**, **Shueisha** ou **Toei Animation**.
* *One Piece Card Game* e todos os nomes, marcas, logotipos, artes e materiais associados são marcas registradas e propriedade intelectual exclusiva de seus respectivos detentores.
* Esta ferramenta tem fins estritamente comunitários, educacionais e de auxílio na interpretação de regras em idioma local, sem finalidade de substituição das cartas físicas.
