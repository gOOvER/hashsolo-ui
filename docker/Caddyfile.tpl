{
    admin off
}

:80 {
    encode zstd gzip

    header {
        X-Content-Type-Options "nosniff"
        Referrer-Policy "strict-origin-when-cross-origin"
        Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=(), usb=()"
        Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https: http:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
    }

    %%METRICS_GUARD%%

    handle /api/* {
        reverse_proxy {$API_UPSTREAM:hashsolo:3334}
    }

    handle {
        root * /var/www/html

        @runtimeConfig path /assets/runtime-config.js
        header @runtimeConfig Cache-Control "no-cache, no-store, must-revalidate"

        @hashedAssets path_regexp [.-][0-9A-Za-z]{8,}\.(js|css|woff2?|svg|png|webp|ico)$
        header @hashedAssets Cache-Control "public, max-age=31536000, immutable"

        @spa not path *.js *.css *.map *.woff *.woff2 *.svg *.png *.jpg *.jpeg *.gif *.webp *.ico *.json *.webmanifest *.txt
        handle @spa {
            header Cache-Control "no-cache, no-store, must-revalidate"
            try_files {path} /index.html
        }

        file_server {
            precompressed br gzip
        }
    }

    log {
        output stdout
        format %%LOGFORMAT%%
        level %%LOGLEVEL%%
    }
}
