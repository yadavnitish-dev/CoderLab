FROM node:22-bookworm-slim AS base
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

FROM base AS deps

COPY package*.json ./
RUN npm ci

FROM deps AS build

COPY . .
RUN npx prisma generate
RUN npm run build
RUN mkdir -p dist/src/generated && cp -r src/generated/prisma dist/src/generated/prisma

FROM node:22-bookworm-slim AS runtime

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

EXPOSE 8080

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/index.js"]
