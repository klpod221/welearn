# Base image cho cả dev và build
FROM node:20-alpine AS base

# Cài git nếu cần clone private repo
RUN apk add --no-cache git

WORKDIR /app

# Copy file cấu hình
COPY package.json package-lock.json* ./

# Cài dependencies
RUN npm install

# Copy toàn bộ mã nguồn
COPY . .

# =====================
# Dev Stage
# =====================
FROM base AS development

ENV NODE_ENV=development
EXPOSE 3000

CMD ["npm", "run", "dev"]

# =====================
# Build Stage
# =====================
FROM base AS build

ENV NODE_ENV=production

# Build Next.js app
RUN npm run build

# =====================
# Production Runtime
# =====================
FROM node:20-alpine AS production

ENV NODE_ENV=production

WORKDIR /app

# Copy từ build stage
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
