# HashSolo UI

> **Fork Notice:** HashSolo UI is an actively maintained fork of [`benjamin-wilson/public-pool-ui`](https://github.com/benjamin-wilson/public-pool-ui).
> For a ready-to-run **Dokploy** stack (including Bitcoin Core, HashSolo backend, and HashSolo UI), see **[gOOvER/hashsolo-dokploy](https://github.com/gOOvER/hashsolo-dokploy)**.

Angular 22 + PrimeNG 22 web dashboard for **HashSolo** (requires Node.js 26+ for building).

## Related Repositories

- **Web Dashboard (this repo):** [`gOOvER/hashsolo-ui`](https://github.com/gOOvER/hashsolo-ui) (`ghcr.io/goover/hashsolo-ui:latest`)
- **Backend:** [`gOOvER/hashsolo`](https://github.com/gOOvER/hashsolo) (`ghcr.io/goover/hashsolo:latest`)
- **Dokploy Compose Stack (Recommended):** [`gOOvER/hashsolo-dokploy`](https://github.com/gOOvER/hashsolo-dokploy)

## Key Features & Improvements in This Fork

- **Modern Stack:** Angular `22`, PrimeNG `22`, PrimeFlex `3.3.1`, `@tsparticles/angular` `4.6`.
- **Live Bitcoin Node Status Card:** Polls `/api/node/status` every 10s to show `Synced` / `Syncing` / `Offline`, block/header height, verification progress bar, pruning status, and disk usage.
- **Dynamic Fee Display:** Reads `fee` from `/api/info` (`NO FEES` vs `1.5% FEE (>= 50 TH/s, 0% under 50 TH/s)`).
- **Single-Domain Caddy Proxy & Compression:** Built-in Caddy proxies `/api/*` to `API_UPSTREAM`, serves precompressed `.br`/`.gz` assets, sets `immutable` caching on hashed JS/CSS, and disables caching on `index.html`.
- **Solo-Only & Optional TLS Ready:** Gracefully falls back when payout-mode/accounting endpoints are absent and hides `Stratum V1 + TLS` unless `SECURE_STRATUM_URL` is explicitly configured.

## Dokploy Deployment (Recommended)

Deploy the complete stack (Bitcoin Core + HashSolo + HashSolo UI) in one click using **[gOOvER/hashsolo-dokploy](https://github.com/gOOvER/hashsolo-dokploy)**.

## Development server

```bash
npm install --legacy-peer-deps
npm start
```

Navigate to `http://localhost:4200/`.

## Build

```bash
npm run build
```

The production build artifacts (including `.gz` and `.br` compressed assets) are written to `dist/hashsolo-ui/`.

## Running unit tests

```bash
npm test
```

## Docker

```bash
docker build -t hashsolo-ui .
docker run --name hashsolo-ui --rm -p 8080:80 \
  -e API_UPSTREAM=hashsolo:3334 \
  -e PUBLIC_POOL_STRATUM_URL=stratum.example.com:3333 \
  hashsolo-ui
```

Available runtime environment variables:
- `API_UPSTREAM`: Internal backend address for Caddy `/api/*` reverse proxy (default: `hashsolo:3334`)
- `PUBLIC_POOL_API_URL`: Optional external API URL injected into `assets/runtime-config.js` (leave empty for same-origin `/api/*` proxy)
- `PUBLIC_POOL_STRATUM_URL`: Stratum `host:port` displayed on the landing page
- `PUBLIC_POOL_SECURE_STRATUM_URL`: Optional Stratum TLS `host:port` (hidden unless explicitly set)
- `LOGLEVEL`: Caddy stdout log level (default: `INFO`)
- `LOGFORMAT`: Caddy stdout log format (default: `json`)
