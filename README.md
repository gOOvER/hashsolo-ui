# HashSolo UI

Angular 22 + PrimeNG 22 web dashboard for **HashSolo** (requires Node.js 26+ for building).

## Dependencies

Requires [HashSolo](https://github.com/gOOvER/HashSolo) backend to be running.

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
  -e PUBLIC_POOL_API_URL=https://api.pool.example.com \
  -e PUBLIC_POOL_STRATUM_URL=pool.example.com:3333 \
  hashsolo-ui
```

Available runtime environment variables:
- `PUBLIC_POOL_API_URL`: Backend API URL injected into `assets/runtime-config.js`
- `PUBLIC_POOL_STRATUM_URL`: Stratum host:port displayed on the landing page
- `LOGLEVEL`: Caddy stdout log level (default: `INFO`)
- `LOGFORMAT`: Caddy stdout log format (default: `json`)
