# npm-docker-build

To use docker cache more effectively, prevent `package.json` file changes to break docker layer cache, so that pick out dependencies from package.json before docker build executes and `COPY` the ONLY dependency statements as `package.json` file to run `npm install` command when building image.

```Dockerfile
FROM node AS build-stage
WORKDIR /app

COPY src .
COPY deps-dev.json ./package.json
RUN npm i
COPY package.json ./package.json
RUN npm run build

FROM node
WORKDIR /app

COPY --from=build-stage build/ .
COPY ./deps-prod.json ./package.json
RUN npm i

ENTRYPOINT ['npm', 'start']
```
