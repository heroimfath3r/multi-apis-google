FROM node:20-slim
ENV NODE_ENV=production
WORKDIR /app

COPY package.json ./
COPY package-lock.json ./ 

RUN npm ci --omit=dev

COPY src ./src

# Cloud Run escucha el puerto 8080 por defecto. 
EXPOSE 8080
ENV PORT=8080 SERVICE_NAME=users-api
CMD ["node", "src/app.js"]