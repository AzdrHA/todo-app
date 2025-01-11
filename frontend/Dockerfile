# Utiliser une image Node.js officielle pour construire l'application
FROM node:18 AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install -g @vue/cli
RUN npm install

# Copier le reste de l'application
COPY . .

# Exposer le port 80
EXPOSE 80

# Construire l'application pour la production
RUN npm run build

FROM build as dev

# Démarre l'application
CMD ["npm", "run", "serve"]

# Utiliser une image Nginx officielle pour servir l'application
FROM nginx:stable-alpine AS prod

# Copier la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers construits depuis l'étape de build
COPY --from=build /app/dist /usr/share/nginx/html

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]