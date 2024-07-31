FROM node:18.19.1-alpine as build
WORKDIR /usr/src/app
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install
COPY . .
RUN pnpm run build

FROM node:18.19.1-alpine
ARG NODE_ENV=production
ENV NODE_ENV={NODE_ENV}
WORKDIR /usr/src/app
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --prod
COPY --from=build /usr/src/app/dist/apps/auth ./dist/apps/auth
CMD ["node", "dist/apps/auth/main"]