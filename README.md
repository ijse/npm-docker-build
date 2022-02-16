# npm-docker-build

Generate `package-prod.json` that without `devDependencies` from `package.json` before call `docker build`, and removes after `docker build` exit.

```Dockerfile
FROM node AS build-stage
WORKDIR /app

COPY . .
RUN npm i && npm run build

FROM node
WORKDIR /app

COPY --from=build-stage build/ .
COPY ./package-prod.json .
RUN npm i

ENTRYPOINT ['npm', 'start']
```
