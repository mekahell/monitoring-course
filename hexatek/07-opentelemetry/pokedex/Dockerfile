FROM node:lts-slim as builder
COPY public public
COPY src src
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install
RUN npm run build-js
FROM nginx
COPY --from=builder public /usr/share/nginx/html