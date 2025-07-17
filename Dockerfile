# Etapa 1: Build
FROM node:18-alpine AS builder

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos necesarios
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY src ./src
COPY public ./public

# Instala dependencias
RUN npm install

# Compila la app
RUN npm run build

# Etapa 2: Servidor estático
FROM node:18-alpine

# Instala 'serve' para servir archivos estáticos
RUN npm install -g serve

# Crea un directorio para la app
WORKDIR /app

# Copia archivos compilados desde la etapa anterior
COPY --from=builder /app/dist ./dist

# Expone el puerto 3000
EXPOSE 3000

# Comando para servir el contenido estático
CMD ["serve", "-s", "dist", "-l", "3000"]