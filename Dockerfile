# syntax=docker/dockerfile:1

ARG NODE_VERSION=14
FROM node:${NODE_VERSION}
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV:-development}

WORKDIR /usr/src/app
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=yarn.lock,target=yarn.lock \
    --mount=type=cache,target=/root/.yarn \
    yarn install --production --frozen-lockfile

RUN --mount=type=bind,source=client/package.json,target=client/package.json \
    --mount=type=bind,source=client/package-lock.json,target=client/package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --prefix client --omit=dev

COPY . .
RUN npm run --prefix client build

USER node
CMD yarn start:prod

EXPOSE 3001
