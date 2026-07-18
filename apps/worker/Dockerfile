# syntax=docker/dockerfile:1
# NelyoHealth worker — long-lived queue/dispatcher process (roadmap M0.1).
# Build context: repository root.

FROM node:24-alpine AS build
WORKDIR /repo
RUN corepack enable
COPY . .
RUN pnpm install --frozen-lockfile --filter "@nelyohealth/worker..."
RUN pnpm --filter "@nelyohealth/worker..." build

FROM node:24-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /repo
COPY --from=build /repo /repo
USER node
ENV WORKER_HEALTH_HOST=0.0.0.0 \
    WORKER_HEALTH_PORT=4100
EXPOSE 4100
HEALTHCHECK --interval=10s --timeout=5s --retries=6 --start-period=15s \
  CMD wget -qO- "http://127.0.0.1:${WORKER_HEALTH_PORT}/health" >/dev/null || exit 1
CMD ["node", "apps/worker/lib/main.js"]
