FROM node:alpine as build
WORKDIR /usr/src/app
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install
COPY . .
RUN pnpm run build

FROM node:alpine
ARG NODE_ENV=production
ENV NODE_ENV={NODE_ENV}
WORKDIR /usr/src/app
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --prod
COPY --from=build /usr/src/app/dist ./dist
CMD ["node", "dist/apps/reservations/main"]