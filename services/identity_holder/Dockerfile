# FROM node:14 as base

# WORKDIR /home/node/app

# COPY package*.json ./

# RUN npm i

# COPY . .

# FROM base as production

# ENV NODE_PATH=./dist

# RUN npx ts-node src/index.ts 


# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# [optional] tests & build
# ENV NODE_ENV=production
# RUN bun test
# RUN bun run build

# copy production dependencies and source code into final image
FROM base AS release
COPY --chown=bun:bun --from=install /temp/prod/node_modules node_modules
COPY --chown=bun:bun --from=prerelease /usr/src/app/package.json .
COPY --chown=bun:bun --from=prerelease /usr/src/app/src .

# run the app
USER bun
EXPOSE 8082/tcp
ENTRYPOINT [ "bun", "run", "index.ts" ]