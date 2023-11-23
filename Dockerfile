# syntax=docker/dockerfile:1

ARG NODE_VERSION=14
FROM node:${NODE_VERSION}
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV:-production}

WORKDIR /usr/src/app

COPY client/package.json client/package.json
COPY client/package-lock.json client/package-lock.json
RUN npm ci --prefix client --omit=dev

COPY package.json ./package.json
COPY yarn.lock ./yarn.lock
RUN yarn install --production --frozen-lockfile

COPY . .
RUN npm run --prefix client build

USER node
CMD yarn start:prod

EXPOSE 3001
