# ETAPA 1: Construcción del bundle estático de Angular 21
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production

# ETAPA 2: Servidor web ultraligero con Nginx
FROM nginx:alpine

# Copiar la regla de rutas SPA que acabas de crear
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar el resultado de la compilación hacia el directorio público de Nginx
COPY --from=build /app/dist/stockmind/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]