FROM oven/bun:1 AS base

WORKDIR /home/node/app

COPY package*.json ./

RUN bun install

COPY . .

FROM base as production

ENV NODE_PATH=./dist

RUN bun run src/index.ts -f formats.json