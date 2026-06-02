# syntax=docker/dockerfile:1

# bookworm-slim: fewer native-module issues than alpine during CRA build
FROM node:20-bookworm-slim AS build
WORKDIR /app

ENV NODE_OPTIONS=--max-old-space-size=2048
ENV npm_config_jobs=1

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY public ./public
COPY src ./src
COPY tsconfig.json ./

ARG REACT_APP_API_URL=http://localhost:3030
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

FROM node:20-alpine
WORKDIR /app

RUN npm install -g serve@14.2.4

COPY --from=build /app/build ./build

ENV PORT=3000
EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
