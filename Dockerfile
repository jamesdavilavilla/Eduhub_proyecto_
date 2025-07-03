# Etapa 1: Build
FROM node:20-alpine AS builder

# Configura el directorio de trabajo
WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Genera Prisma Client
RUN npx prisma generate

# Genera el build optimizado de Next.js
RUN npm run build

# Etapa 2: Imagen final liviana
FROM node:20-alpine

# Crea el mismo directorio de trabajo
WORKDIR /app

# Copia las dependencias ya instaladas y el build desde la imagen anterior
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/tailwind.config.ts ./tailwind.config.ts
COPY --from=builder /app/postcss.config.mjs ./postcss.config.mjs
COPY --from=builder /app/src ./src

# Expone el puerto
EXPOSE 3000

# Comando por defecto
CMD ["npm", "start"]
