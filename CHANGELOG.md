# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added
- Added `AGENTS.md` documenting UI architecture, runtime config, Caddy caching, and build/test conventions.

### Security
- Resolved all 18 Dependabot / `npm audit` vulnerabilities in `package-lock.json` (`qs`, `brace-expansion`, `engine.io`, `socket.io-parser`, `@babel/core`, `ws`, `follow-redirects`, `lodash`, `picomatch`, `flatted`, `minimatch`, `cookie`, `body-parser` → `found 0 vulnerabilities`).
- Added GitHub **CodeQL** static analysis workflow (`.github/workflows/codeql.yml` for `javascript-typescript`).
- Enabled `ignore-unfixed: true` in `.github/workflows/trivy-analysis.yml` so unpatched upstream OS CVEs are filtered from Code Scanning.

## [1.2.0] - 2026-11-21

### Added
- Added non-mainnet `network` pill in the hero header, live `version` badge (`v1.2.0`) in the footer, optional `Stratum V1 + TLS` / `Stratum V2` connection rows in the **Quick Setup** modal, and explicit `stratum+tcp://`-only note in the **NMMiner** setup tab.
- Wired `PUBLIC_POOL_SECURE_STRATUM_URL` (`SECURE_STRATUM_URL`) and `PUBLIC_POOL_STRATUM_V2_URL` (`STRATUM_V2_URL`) into `docker/entrypoint.sh` and updated the Solo Stratum V2 URI scheme in `SplashComponent` to `stratum2+tcp://` (displaying the live `sv2.poolAuthorityPublicKey` from `/api/info`).

### Fixed
- Updated `docker/Caddyfile.tpl` so SPA fallback routes (e.g. `/app/<address>`) also send `Cache-Control: no-cache, no-store, must-revalidate` (preventing stale `index.html` caching after updates, cf. upstream issue #136) and fixed the `@hashedAssets` regex (`[.-][0-9A-Za-z]{8,}`) to match Angular 22 hyphenated bundle hashes (e.g. `main-XXXXXXXX.js`, `styles-XXXXXXXX.css`).
- Styled `.login-panel input.p-inputtext` and `.login-panel button.p-button` with higher specificity in `splash.component.scss` (overriding PrimeNG 22's runtime-injected tokenless CSS) for a clear input box, focus ring, and rounded button.
- Simplified the hero fee row in `SplashComponent` to a single clean line (`[0% FEE < 50 TH/s] Ab 50 TH/s: 1.5% Dev-Fee` or `[0% FEE] Ohne Kompromisse.` when `0%`).
- Added explicit theme-aligned `.p-inputtext` styling in `src/styles.scss` so PrimeNG 22 `pInputText` inputs render with visible background, border, and focus ring.
- Shortened `heroTagline` and adjusted `.hero-brand code` typography in `SplashComponent` so the tagline fits cleanly on a single line without an awkward orphan wrap.

### Changed
- Enabled native multi-arch Docker image builds (`linux/amd64` on `ubuntu-latest` + `linux/arm64` on `ubuntu-24.04-arm`, merged via `docker buildx imagetools create` without QEMU) in `.github/workflows/docker-publish.yml`.

## [1.1.0] - 2026-11-21

### Fixed
- Removed stale precompressed `runtime-config.js.gz`/`.br` files in `docker/entrypoint.sh` and disabled caching on `/assets/runtime-config.js` in `docker/Caddyfile.tpl` so runtime env variables always take effect.
- Guarded `AppLayoutComponent` against missing `#topbarmenu`, exported `InputTextModule` and `RippleModule` in `PrimeNGModule`, added `catchError` guards in `DashboardComponent`/`WorkerComponent`/`WorkerGroupComponent`, and hardened `HashSuffixPipe`/`NumberSuffixPipe`/`AverageTimeToBlockPipe` against `NaN`/`Infinity`.
- Localized and clarified the **Solo Block Chance** metric in `DashboardComponent` (`1 Block / X Jahre` and `0,0000 % pro Jahr` in German vs `1 block / X yr` and `0.0000% / year` in English).
- Fixed worker table row expansion in `DashboardComponent`: replaced legacy `#rowexpansion` with PrimeNG 22 `#expandedrow`, changed `$event.stopImmediatePropagation()` to `$event.stopPropagation()` so `[pRowToggler]` works, persisted `expandedRowKeys` across 15s auto-refreshes, and displayed group `Uptime` / `Last Seen` in the summary row.
- Added missing `type="line"` on `<p-chart>` in `DashboardComponent` so the **Address Hashrate** chart renders properly (and hid the `yPplns` axis on Solo-only pools).
- Fixed `.layout-topbar-button` missing `background-color: transparent`, `border: none`, and `padding: 0` in `_topbar.scss` so the topbar menu button no longer renders with a white default browser button background, and moved it cleanly to the left of the HashSolo logo without the `300px` spacer gap.
- Replaced unstyled PrimeNG 22 `<p-toggleswitch>` in `SettingsComponent` with a self-contained accessible toggle switch so the **Background Particles** setting renders properly.

### Added
- Added a global **DE / EN** language switcher in `AppTopBarComponent` and full German/English translations for `DashboardComponent` via `I18nService`.
- Added a clean footer bar at the bottom of `SplashComponent` linking to **GitHub** (`gOOvER/hashsolo`), the **Wiki**, and the **GPL-3.0 License**.
- Added a **Rejected** column (`Low Diff` / `Stale` / `Duplicate` tooltip breakdown) to the `DashboardComponent` worker table.
- Added a compact **Support HashSolo** donation card at the bottom of `SplashComponent` with one-click copy for the BTC Mainnet address (`bc1qt6wec64n3gnrhclp4vfckyvr8h27tmqswy28gc`) and link to `https://donate.goover.dev`.

### Changed
- Cleaned up `DashboardComponent` for Solo-only pools: hid `PPLNS Work` and empty `Mode` column unless PPLNS is configured, wired `Solo Work` & `Best Difficulty` to `clientInfo.accounting` (with fallback to `clientInfo.bestDifficulty`), and added total **Rejected** count to worker group headers.
- Made the footer donation card runtime-configurable via `DONATION_BTC_ADDRESS`, `DONATION_URL`, `DONATION_LINK_LABEL`, `DONATION_TITLE`, and `DONATION_SUBTITLE` in `docker/entrypoint.sh` and `AppConfigService` (defaulting to gOOvER's BTC address and `donate.goover.dev`, or hidden when set to `none`).
- Highlighted `0% FEE < 50 TH/s` in green in the hero badge when `DEV_FEE_ADDRESS` is configured (with `≥ 50 TH/s: 1.5% Dev-Fee` in the subline) and cleanly displays `0% FEE` when no dev fee is configured.
- Added 15s live auto-refresh to `accounting$` and `accountingByPayoutMode$` in `SplashComponent` so the **Solo Mining** card and **Solo 10m / 1h** metrics update automatically.
- Removed the `★ = Open Source Software & Hardware` legend lines under `Connected Miners` and `High Scores` in `SplashComponent`.
- Centered the **Support HashSolo** donation card layout (`₿ BTC` badge pill + `donate.goover.dev` button) to match the other overview cards.

## [1.0.0] - 2026-11-19

### Added
- Added an **All Miners** (`Alle Miner`) button in the `Connected Miners` card header opening a modal popup (`GET /api/info/miners`) listing all active individual miner sessions (device, worker, masked address, session ID, hashrate, best difficulty, last seen) with a manual refresh button.
- Added DE/EN language toggle (`I18nService`), device Quick Setup tabs (`Bitaxe / NerdAxe`, `NMMiner`, `Antminer / ASIC`), and `mempool.space` block height links in `SplashComponent`.
- Added 15s live auto-refresh toggle and `Solo Block Chance` odds/yearly-probability metric in `DashboardComponent`.
- Added Bitcoin P2P peer count (`connections`) and live next-block reward (`BTC` from `/api/info/next-block-reward`) to the **Bitcoin Node** status card.
- Added live Bitcoin Node status card (Synced/Syncing/Offline, blocks/headers, verification progress bar, pruned/disk size) polling `/api/node/status` every 5 seconds.
- Added live `<address>.bitaxe01` username preview with one-click copy in `SplashComponent`.
- Added empty-state messages for `Solo Hashrate` and `Connected Miners` when no data or miners are present yet.
- Added `.node-version` (`26`) and `engines.node` (`>=26.0.0`) in `package.json`.
- Added unit tests in `AppService` and `ClientService` verifying `404` fallbacks to `/api/info/chart`, `/api/client/:address/chart`, and `null` accounting.

### Changed
- Enabled 15s live auto-refresh on `SplashComponent` (`info$` and open `All Miners` modal) and refined the `NMMiner` Quick Setup tab to show the plain BTC address without `.worker` plus a configuration note.
- Moved the device-specific miner Quick Setup (`Standard / ESP-Miner`, `NMMiner`, `Antminer / ASIC`) out of the `Solo Mining` hero card into a compact modal popup triggered from the header button (`Geräte-Setup` / `Device Setup`) in `SplashComponent`.
- Replaced `DE`/`EN` text toggle with inline SVG country flags, expanded German translations across `SplashComponent` & `DashboardComponent`, and replaced `bitaxe01` examples with neutral `worker1` / `Standard / ESP-Miner` labels.
- Enabled Brotli/Gzip precompression, `zstd`/`gzip` encoding, and immutable caching for hashed assets in `docker/Caddyfile.tpl` (~5x smaller transfer size).
- Added 4s timeout and 10s polling interval on `getNodeStatus()` so slow RPC responses during IBD cannot stall page loads.
- Changed `AppConfigService.secureStratumUrl` to only return a value when explicitly configured, hiding `Stratum V1 + TLS` unless enabled.
- Restored `primeflex@^3.3.1` for 12-column Flexbox grid compatibility, set particle canvas `zIndex: -1`, and removed the upstream Donate card.
- Upgraded to Angular `^22.3.0`, PrimeNG `^22.1.5` (`ToggleSwitchModule`), PrimeIcons `^8.0.2`, `@tsparticles/angular@^4.6.0` + `tsparticles@^4.6.0` (replacing `ng-particles`), `ngx-device-detector@^12.0.0`, `bitcoin-address-validation@^4.0.0`, `zone.js@~0.16.3`, `gzipper@^8.3.0`, `jasmine-core@^7.0.2`, `webpack-bundle-analyzer@^5.4.3`, and TypeScript `^6.0.0`.
- Updated `Dockerfile` build stage to `node:26-bookworm-slim` and `angular.json` builders to `@angular-devkit/build-angular:application` and `@angular/build:karma`.
- Added `standalone: false` to NgModule-declared components and pipes for Angular 22 compatibility.

### Fixed
- Fixed empty `<p-table>` headers and rows across `SplashComponent` (`Connected Miners`, `High Scores`, `Found Blocks`) and `DashboardComponent` (`Workers`) by migrating PrimeNG 22 `<ng-template>` bindings from `pTemplate="header"`/`pTemplate="body"`/`pTemplate="groupheader"`/`pTemplate="rowexpansion"` to `#header`/`#body`/`#groupheader`/`#rowexpansion`.
- Fixed `SplashComponent` template crash when `/api/info/accounting` returns `404` (`null`) by providing default zeroed accounting metrics (`Solo 10m`, `Solo 1h`, `Best Difficulty`, `Solo Work`) so the `Solo Hashrate` chart and empty state render cleanly.
- Updated hero fee display in `SplashComponent` to read `fee` dynamically from `/api/info` (`NO FEES` vs `1.5% FEE (>= 50 TH/s, 0% under 50 TH/s)`).
- Fixed `pButton` label (`My Miners`) and copy icon (`pi-copy`) rendering for PrimeNG 22, plus button contrast styling in `SplashComponent`.
- Fixed `AppService` and `ClientService` to fall back to `/api/info/chart` and `/api/client/:address/chart` when `/payout-modes` or `/accounting` endpoints return `404` on Solo-only `public-pool` backends.
- Fixed `DashboardComponent` to reactively subscribe to `route.paramMap` instead of `route.snapshot.params` so switching addresses updates the dashboard without a full reload.
- Added `catchError` guards to `SplashComponent` and `DashboardComponent` streams.
