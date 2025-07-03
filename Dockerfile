# Etapa de construcción
FROM node:20-alpine AS builder

WORKDIR /app

# Copiamos los archivos de dependencias
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del proyecto
COPY . .

# Generamos Prisma Client
RUN npx prisma generate

# Build de la app Next.js
RUN npm run build

# Etapa de producción
FROM node:20-alpine AS runner

WORKDIR /app

# Copiamos lo necesario desde la etapa de build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Generamos Prisma Client por seguridad (si cambió algo)
RUN npx prisma generate

# Comando para iniciar Next.js
CMD ["npm", "run", "start"]
