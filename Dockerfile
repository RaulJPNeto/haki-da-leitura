# Stage 1: Build da Aplicação PWA
FROM node:22-alpine AS build

WORKDIR /app

# Copiar manifesto de dependências
COPY package.json package-lock.json* ./

# Instalação limpa de dependências
RUN npm ci || npm install

# Copiar arquivos de código fonte
COPY . .

# Compilação para produção
RUN npm run build

# Stage 2: Servidor Web Nginx de Produção
FROM nginx:alpine AS runner

# Copiar build gerado do Stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Configuração customizada do Nginx para PWA / SPA Routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
