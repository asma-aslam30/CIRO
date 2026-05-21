# Build Stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .

# We allow NEXT_PUBLIC variables to be passed at build time or runtime.
# For Cloud Run, runtime vars aren't injected into statically optimized pages
# unless they are explicitly read in getServerSideProps, but since this is
# a simple dashboard, build-time args are usually safer for static builds.
RUN npm run build

# Production Stage
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production
ENV PORT 3000

COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
