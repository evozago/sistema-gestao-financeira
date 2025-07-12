FROM node:20-alpine

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar package.json e pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Instalar dependências
RUN pnpm install

# Copiar código fonte
COPY . .

# Expor porta
EXPOSE 5173

# Comando para desenvolvimento
CMD ["pnpm", "run", "dev", "--host"]

