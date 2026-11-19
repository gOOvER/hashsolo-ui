<div align="center">
  <img src=".github/assets/social-banner.jpg" alt="HashSolo UI Banner" width="100%" />

  # 🌐 HashSolo UI

  **Modern Angular 22 + PrimeNG 22 Web Dashboard for HashSolo Solo Mining Pool**

  [![CI](https://github.com/gOOvER/hashsolo-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/gOOvER/hashsolo-ui/actions/workflows/ci.yml)
  [![Docker Build & Publish](https://github.com/gOOvER/hashsolo-ui/actions/workflows/docker-publish.yml/badge.svg)](https://github.com/gOOvER/hashsolo-ui/actions/workflows/docker-publish.yml)
  [![Trivy Security Scan](https://github.com/gOOvER/hashsolo-ui/actions/workflows/trivy-analysis.yml/badge.svg)](https://github.com/gOOvER/hashsolo-ui/actions/workflows/trivy-analysis.yml)
  [![Angular](https://img.shields.io/badge/Angular-22-dd0031?logo=angular&logoColor=white)](package.json)
  [![License](https://img.shields.io/badge/License-GPL--3.0-blue.svg)](LICENSE)
  [![Support](https://img.shields.io/badge/Support-donate.goover.dev-ff69b4?logo=ko-fi&logoColor=white)](https://donate.goover.dev)

</div>

> [!NOTE]
> **Fork Notice:** HashSolo UI is an actively maintained fork of [`benjamin-wilson/public-pool-ui`](https://github.com/benjamin-wilson/public-pool-ui).
> For a ready-to-run **Dokploy** Docker Compose stack (including Bitcoin Core, HashSolo backend, and HashSolo UI), see **[gOOvER/hashsolo-dokploy](https://github.com/gOOvER/hashsolo-dokploy)**.

---

## ✨ Features & Improvements in This Fork

- **Modern Stack:** Angular `22`, PrimeNG `22`, PrimeFlex `3.3.1`, `@tsparticles/angular` `4.6`.
- **Live Bitcoin Node Status Card:** Polls `/api/node/status` and `/api/info/next-block-reward` to display `Synced` / `Syncing` / `Offline`, block/header height, progress bar, P2P peer count, pruning/disk usage, and live next-block reward in BTC.
- **Miner Quick Setup & DE/EN Toggle:** Interactive device tabs (`Bitaxe / NerdAxe`, `NMMiner`, `Antminer / ASIC`) with 1-click copy and persistent `DE | EN` language switcher.
- **Address Dashboard Enhancements:** 15s live auto-refresh toggle, **Solo Block Chance** odds & yearly probability calculator, and `mempool.space` links on found blocks.
- **Fast Single-Domain Caddy Serving:** Built-in Caddy reverse-proxies `/api/*` to `API_UPSTREAM`, serves precompressed `.br`/`.gz` bundles, caches hashed assets (`immutable`), and keeps `index.html` `no-cache`.
- **Solo-Only & Optional TLS Ready:** Gracefully handles Solo-only backends and hides `Stratum V1 + TLS` unless `SECURE_STRATUM_URL` is explicitly configured.

---

## 🐳 Dokploy Deployment (Recommended)

Deploy the complete stack (`bitcoind` + `hashsolo` + `hashsolo-ui`) in one click using **[gOOvER/hashsolo-dokploy](https://github.com/gOOvER/hashsolo-dokploy)**.

---

## 🛠️ Local Development & Build

```bash
npm install --legacy-peer-deps
npm start        # http://localhost:4200/
npm run build    # outputs to dist/hashsolo-ui/ with .gz & .br
npm test
```

## ⚙️ Runtime Environment Variables (Docker)

| Variable | Default | Description |
| :--- | :--- | :--- |
| `API_UPSTREAM` | `hashsolo:3334` | Internal backend target for Caddy `/api/*` proxy |
| `PUBLIC_POOL_API_URL` | `""` | External API URL (leave empty for same-origin proxy) |
| `PUBLIC_POOL_STRATUM_URL` | `""` | Stratum `host:port` shown on the landing page |
| `PUBLIC_POOL_SECURE_STRATUM_URL` | `""` | Optional Stratum TLS `host:port` (hidden unless set) |
| `LOGLEVEL` | `INFO` | Caddy stdout log level |
| `LOGFORMAT` | `json` | Caddy stdout log format |

---

## 💝 Support

If you find **HashSolo UI** useful:
- **Donate:** [donate.goover.dev](https://donate.goover.dev) · **Ko-fi:** [ko-fi.com/oldnoob](https://ko-fi.com/oldnoob) · **Buy Me a Coffee:** [buymeacoffee.com/goover](https://buymeacoffee.com/goover)
- **Bitcoin (BTC Mainnet):** `bc1qt6wec64n3gnrhclp4vfckyvr8h27tmqswy28gc`
