# syntax=docker/dockerfile:1.7

FROM node:24-alpine AS base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable
WORKDIR /app

FROM base AS dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

FROM base AS builder
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NODE_ENV=production
ENV PAYLOAD_SECRET=build-time-placeholder-not-used-at-runtime
ENV DATABASE_PROVIDER=sqlite
ENV DATABASE_URL=file:/tmp/bax-build.db
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM base AS migrator
ENV NODE_ENV=production
COPY --from=dependencies /app/node_modules ./node_modules
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY src ./src
COPY scripts ./scripts
COPY tsconfig.json next.config.mjs ./
USER node
CMD ["node", "node_modules/payload/bin.js", "migrate"]

FROM node:24-alpine AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 --ingroup nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --chown=nextjs:nodejs scripts/media-volume.mjs ./scripts/media-volume.mjs

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
