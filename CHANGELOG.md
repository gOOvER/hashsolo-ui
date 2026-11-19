# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added
- Added DE/EN language toggle (`I18nService`), device Quick Setup tabs (`Bitaxe / NerdAxe`, `NMMiner`, `Antminer / ASIC`), and `mempool.space` block height links in `SplashComponent`.
- Added 15s live auto-refresh toggle and `Solo Block Chance` odds/yearly-probability metric in `DashboardComponent`.
- Added Bitcoin P2P peer count (`connections`) and live next-block reward (`BTC` from `/api/info/next-block-reward`) to the **Bitcoin Node** status card.
- Added live Bitcoin Node status card (Synced/Syncing/Offline, blocks/headers, verification progress bar, pruned/disk size) polling `/api/node/status` every 5 seconds.
- Added live `<address>.bitaxe01` username preview with one-click copy in `SplashComponent`.
- Added empty-state messages for `Solo Hashrate` and `Connected Miners` when no data or miners are present yet.
- Added `.node-version` (`26`) and `engines.node` (`>=26.0.0`) in `package.json`.
- Added unit tests in `AppService` and `ClientService` verifying `404` fallbacks to `/api/info/chart`, `/api/client/:address/chart`, and `null` accounting.

### Changed
- Replaced `DE`/`EN` text toggle with inline SVG country flags, expanded German translations across `SplashComponent` & `DashboardComponent`, and replaced `bitaxe01` examples with neutral `worker1` / `Standard / ESP-Miner` labels.
- Enabled Brotli/Gzip precompression, `zstd`/`gzip` encoding, and immutable caching for hashed assets in `docker/Caddyfile.tpl` (~5x smaller transfer size).
- Added 4s timeout and 10s polling interval on `getNodeStatus()` so slow RPC responses during IBD cannot stall page loads.
- Changed `AppConfigService.secureStratumUrl` to only return a value when explicitly configured, hiding `Stratum V1 + TLS` unless enabled.
- Restored `primeflex@^3.3.1` for 12-column Flexbox grid compatibility, set particle canvas `zIndex: -1`, and removed the upstream Donate card.
- Upgraded to Angular `^22.3.0`, PrimeNG `^22.1.5` (`ToggleSwitchModule`), PrimeIcons `^8.0.2`, `@tsparticles/angular@^4.6.0` + `tsparticles@^4.6.0` (replacing `ng-particles`), `ngx-device-detector@^12.0.0`, `bitcoin-address-validation@^4.0.0`, `zone.js@~0.16.3`, `gzipper@^8.3.0`, `jasmine-core@^7.0.2`, `webpack-bundle-analyzer@^5.4.3`, and TypeScript `^6.0.0`.
- Updated `Dockerfile` build stage to `node:26-bookworm-slim` and `angular.json` builders to `@angular-devkit/build-angular:application` and `@angular/build:karma`.
- Added `standalone: false` to NgModule-declared components and pipes for Angular 22 compatibility.

### Fixed
- Fixed `SplashComponent` template crash when `/api/info/accounting` returns `404` (`null`) by providing default zeroed accounting metrics (`Solo 10m`, `Solo 1h`, `Best Difficulty`, `Solo Work`) so the `Solo Hashrate` chart and empty state render cleanly.
- Updated hero fee display in `SplashComponent` to read `fee` dynamically from `/api/info` (`NO FEES` vs `1.5% FEE (>= 50 TH/s, 0% under 50 TH/s)`).
- Fixed `pButton` label (`My Miners`) and copy icon (`pi-copy`) rendering for PrimeNG 22, plus button contrast styling in `SplashComponent`.
- Fixed `AppService` and `ClientService` to fall back to `/api/info/chart` and `/api/client/:address/chart` when `/payout-modes` or `/accounting` endpoints return `404` on Solo-only `public-pool` backends.
- Fixed `DashboardComponent` to reactively subscribe to `route.paramMap` instead of `route.snapshot.params` so switching addresses updates the dashboard without a full reload.
- Added `catchError` guards to `SplashComponent` and `DashboardComponent` streams.
