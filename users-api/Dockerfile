# users-api/Dockerfile
# --- ETAPA 1: BUILD (Instalación de Dependencias) ---
# Usamos una imagen más robusta para asegurar la instalación
FROM node:20-slim AS builder 

WORKDIR /app

# Copiar archivos de configuración
COPY package.json ./
COPY package-lock.json ./

# Instalar solo dependencias de producción (npm ci --omit=dev)
RUN npm ci --omit=dev 

# Copiar el código fuente
COPY src ./src

# --- ETAPA 2: PRODUCTION (Imagen Final Limpia) ---
# Usamos la misma imagen, pero ahora sin la cache de la instalación
FROM node:20-slim

# Cloud Run utiliza internamente 8080.
# La variable PORT es establecida por Cloud Run
ENV PORT 8080 
WORKDIR /usr/src/app

# Copiar las dependencias y el código desde la etapa 'builder'
COPY --from=builder /app .

# Comando de inicio
CMD [ "node", "src/app.js" ]