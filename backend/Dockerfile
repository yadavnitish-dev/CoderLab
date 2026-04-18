FROM node:20-bookworm-slim AS base

WORKDIR /app

FROM base AS deps

COPY package*.json ./
RUN npm ci

FROM deps AS build

COPY . .
RUN npx prisma generate
RUN npm run build
RUN mkdir -p dist/generated && cp -r src/generated/prisma dist/generated/prisma

FROM node:20-bookworm-slim AS runtime

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

EXPOSE 8080

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
