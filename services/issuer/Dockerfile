FROM oven/bun:1 AS base
WORKDIR /usr/app

# install dependencies 
FROM base AS install
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile

# copy node_modules and source files
FROM base AS prerelease
COPY --from=install /temp/prod/node_modules node_modules
COPY . .

# copy production dependencies and source code into final image
FROM base AS release
COPY --chown=bun:bun --from=install /temp/prod/node_modules node_modules
COPY --chown=bun:bun --from=prerelease /usr/app/package.json .
COPY --chown=bun:bun --from=prerelease /usr/app .

# run the app
USER bun
EXPOSE 8082/tcp
EXPOSE 88443/tcp
ENTRYPOINT [ "bun", "run", "./src/index.ts" ]