FROM node:22-slim AS base

FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# FROM deps AS test
# WORKDIR /app
# RUN npm run test

FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runtime
WORKDIR /app
COPY --from=build /app/dist ./dist
ENV NODE_ENV=production

USER node

CMD ["node", "dist/main"]
