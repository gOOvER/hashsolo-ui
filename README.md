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
  [![Live Pool](https://img.shields.io/badge/Live%20Pool-hashsolo.goover.dev-f7931a?logo=bitcoin&logoColor=white)](https://hashsolo.goover.dev)

</div>

## 🤝 Contribute & Pull Requests Welcome!

Just like the original [`benjamin-wilson/public-pool-ui`](https://github.com/benjamin-wilson/public-pool-ui), this project is built for transparent, self-hostable solo mining — as a modern, actively maintained dashboard without stale Angular/npm security vulnerabilities.

**Every contribution helps!** Whether it's a UI bug fix, translation improvement, chart/UX idea, or dependency/security hardening:
- 🐛 Open an issue using the [Issue Templates](https://github.com/gOOvER/hashsolo-ui/issues/new/choose).
- 🔧 Open a [Pull Request](https://github.com/gOOvER/hashsolo-ui/pulls) — PRs are always welcome and appreciated!

> [!IMPORTANT]
> ### ⚡ Mine Live Now on **[hashsolo.goover.dev](https://hashsolo.goover.dev)**!
> Want to see **HashSolo UI** in action or solo-mine Bitcoin right away? Point your **Bitaxe**, **NerdMiner**, **NMMiner**, **Antminer**, or **ASIC** to:
> - **Web Dashboard:** [https://hashsolo.goover.dev](https://hashsolo.goover.dev)
> - **Stratum V1 URL:** `stratum+tcp://hashsolo.goover.dev:3333` (Password: `x`)
> - **Built for Everyone:** `0%` fee below 50 TH/s, KH/s-friendly start difficulty (`0.001`), live node sync & reward stats, and instant **Telegram / ntfy** alerts.

> [!NOTE]
> **Fork Notice:** HashSolo UI is an actively maintained fork of [`benjamin-wilson/public-pool-ui`](https://github.com/benjamin-wilson/public-pool-ui).
> For a ready-to-run **Dokploy** Docker Compose stack (including Bitcoin Core, HashSolo backend, and HashSolo UI), see **[gOOvER/hashsolo-dokploy](https://github.com/gOOvER/hashsolo-dokploy)**.

---

## ✨ Features & Improvements in This Fork

- **Modern Stack:** Angular `22`, PrimeNG `22`, PrimeFlex `3.3.1`, `@tsparticles/angular` `4.6`.
- **Live Bitcoin Node Status Card:** Polls `/api/node/status` and `/api/info/next-block-reward` to display `Synced` / `Syncing` / `Offline`, block/header height, progress bar, P2P peer count, pruning/disk usage, and live next-block reward in BTC.
- **Miner Quick Setup Modal & DE/EN Toggle:** Compact header button (`Device Setup` / `Geräte-Setup`) opening a modal with interactive device tabs (`Standard / ESP-Miner`, `NMMiner`, `Antminer / ASIC`), 1-click copy, and persistent flag-based `DE | EN` language switcher.
- **Live Splash & All Miners Modal:** 15s auto-refresh on the home overview (`Connected Miners`, `High Scores`, `Found Blocks`) plus an **All Miners** modal (`GET /api/info/miners`) listing all active individual miner sessions, and a **Support HashSolo** BTC donation card (`donate.goover.dev`).
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
