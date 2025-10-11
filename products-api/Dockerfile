FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app

# ⬇️ COPIAR AMBOS ARCHIVOS
COPY package.json ./
COPY package-lock.json ./

RUN npm ci --omit=dev

COPY src ./src

EXPOSE 4002
ENV PORT=4002 SERVICE_NAME=products-api
CMD ["node", "src/app.js"]