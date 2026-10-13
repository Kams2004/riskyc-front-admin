/**
 * Unlike web/'s own config.ts, admin-service isn't behind chat.riskycfashion.com's
 * nginx path-proxying yet (no domain for the admin dashboard for now, per
 * the explicit ask) — this points straight at the VPS IP:port admin-service
 * publishes itself on (see backend/docker-compose.yml's admin-service block).
 * Vite inlines VITE_* vars at build time; override via .env.local for local
 * backend dev.
 */
export const config = {
  adminServiceUrl: import.meta.env.VITE_ADMIN_SERVICE_URL ?? 'http://167.86.120.214:8096',
} as const;
