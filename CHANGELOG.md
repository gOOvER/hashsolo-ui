# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added
- Added `.node-version` (`26`) and `engines.node` (`>=26.0.0`) in `package.json`.
- Added unit tests in `AppService` and `ClientService` verifying `404` fallbacks to `/api/info/chart`, `/api/client/:address/chart`, and `null` accounting.

### Changed
- Upgraded to Angular `^22.3.0`, PrimeNG `^22.1.5` (`ToggleSwitchModule`), PrimeIcons `^8.0.2`, PrimeFlex `^4.0.0`, `@tsparticles/angular@^4.6.0` + `tsparticles@^4.6.0` (replacing `ng-particles`), `ngx-device-detector@^12.0.0`, `bitcoin-address-validation@^4.0.0`, `zone.js@~0.16.3`, `gzipper@^8.3.0`, `jasmine-core@^7.0.2`, `webpack-bundle-analyzer@^5.4.3`, and TypeScript `^6.0.0`.
- Updated `Dockerfile` build stage to `node:26-bookworm-slim` and `angular.json` builders to `@angular-devkit/build-angular:application` and `@angular/build:karma`.
- Added `standalone: false` to NgModule-declared components and pipes for Angular 22 compatibility.

### Fixed
- Fixed `AppService` and `ClientService` to fall back to `/api/info/chart` and `/api/client/:address/chart` when `/payout-modes` or `/accounting` endpoints return `404` on Solo-only `public-pool` backends.
- Fixed `DashboardComponent` to reactively subscribe to `route.paramMap` instead of `route.snapshot.params` so switching addresses updates the dashboard without a full reload.
- Added `catchError` guards to `SplashComponent` and `DashboardComponent` streams.
