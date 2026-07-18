# syntax=docker/dockerfile:1
# NelyoHealth API — long-lived NestJS process (roadmap M0.1 Runtime Baseline).
# Build context: repository root.

FROM node:24-alpine AS build
WORKDIR /repo
RUN corepack enable
COPY . .
RUN pnpm install --frozen-lockfile --filter "@nelyohealth/api..."
RUN pnpm --filter "@nelyohealth/api..." build

FROM node:24-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /repo
COPY --from=build /repo /repo
USER node
ENV HOST=0.0.0.0 \
    PORT=4000
EXPOSE 4000
HEALTHCHECK --interval=10s --timeout=5s --retries=6 --start-period=20s \
  CMD wget -qO- "http://127.0.0.1:${PORT}/api/health" >/dev/null || exit 1
CMD ["node", "apps/api/lib/nest/main.js"]
