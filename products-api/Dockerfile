FROM node:20-slim
ENV NODE_ENV=production
WORKDIR /app

# ⬇️ COPIAR AMBOS ARCHIVOS
COPY package.json ./
COPY package-lock.json ./

RUN npm ci --omit=dev

COPY src ./src

# Cloud Run escucha el puerto 8080 por defecto. Es mejor usar $PORT en app.js y mapear aquí
EXPOSE 8080 
ENV PORT=8080 SERVICE_NAME=products-api
CMD ["node", "src/app.js"]