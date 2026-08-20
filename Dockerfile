# Requires `output: 'standalone'` in next.config.ts.
# From https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

FROM node:22.17.0-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install and build in one stage so we do not copy ~hundreds of MB of node_modules
# between layers (that copy took ~110s and blew Coolify's build timeout).
FROM base AS builder
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--no-deprecation --max-old-space-size=2048"
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN corepack enable pnpm && corepack prepare pnpm@10.34.5 --activate && pnpm i --frozen-lockfile

COPY . .
RUN pnpm generate:importmap && pnpm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
RUN mkdir .next && chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
