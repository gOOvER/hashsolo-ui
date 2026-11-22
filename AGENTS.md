# AGENTS.md — HashSolo UI

## Overview
**HashSolo UI** is an actively maintained open-source (**GPL-3.0**) fork of [`benjamin-wilson/public-pool-ui`](https://github.com/benjamin-wilson/public-pool-ui).

- **Stack:** Angular `22`, PrimeNG `22`, PrimeFlex `3.3.1`, `@tsparticles/angular` `4.6`, Caddy (`caddy:alpine`) reverse proxy & static server.
- **Backend Repo:** [`gOOvER/hashsolo`](https://github.com/gOOvER/hashsolo)

## Commands
```bash
npm ci --legacy-peer-deps
npm start        # ng serve --proxy-config proxy.config.local.json
npm run build    # ng build --configuration=production && gzipper compress --gzip --brotli ./dist/hashsolo-ui/
npm test
```

## Architecture Map
- `docker/entrypoint.sh` — Renders `/assets/runtime-config.js` (`window.__PUBLIC_POOL_CONFIG__`) from runtime ENVs (`PUBLIC_POOL_API_URL`, `PUBLIC_POOL_STRATUM_URL`, `PUBLIC_POOL_SECURE_STRATUM_URL`, `PUBLIC_POOL_STRATUM_V2_URL`, `DONATION_*`) and removes stale `.gz`/`.br` copies of `runtime-config.js`.
- `docker/Caddyfile.tpl` — Proxies `/api/*` to `API_UPSTREAM`, sets `Cache-Control: no-cache, no-store, must-revalidate` on `/assets/runtime-config.js` and all `@spa` fallback routes, and `public, max-age=31536000, immutable` on `[.-][0-9A-Za-z]{8,}` hashed bundles.
- `src/app/services/app-config.service.ts` — Reads runtime config with environment fallbacks (`secureStratumUrl` / `stratumV2Url` remain hidden unless configured).
- `src/app/services/i18n.service.ts` — Global DE/EN translations.
- `src/app/components/splash/` & `src/app/components/dashboard/` — Landing page, Quick Setup modal, All Miners modal, live Bitcoin Node card, and address/worker dashboard.

## Project Conventions
1. **Runtime-configurable UI:** Never bake deployment domains, API URLs, or Stratum endpoints into Angular production builds — wire them through `docker/entrypoint.sh` + `AppConfigService`.
2. **PrimeNG 22:** Use `#header`/`#body`/`#groupheader`/`#expandedrow` template syntax on `<p-table>` and style `p-inputtext` / `p-button` explicitly where needed.
3. **Changelog (`CHANGELOG.md`):** Follow [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) under `## [Unreleased]`.
4. **Verification:** Run `npm run build` after every UI change and keep `npm audit --legacy-peer-deps` clean.
