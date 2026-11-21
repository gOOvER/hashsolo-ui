:80 {
    encode zstd gzip

    handle /api/* {
        reverse_proxy {$API_UPSTREAM:hashsolo:3334}
    }

    handle {
        root * /var/www/html
        @index path / /index.html /assets/runtime-config.js
        header @index Cache-Control "no-cache, no-store, must-revalidate"
        @hashedAssets path_regexp \.[0-9A-Za-z]{8,}\.(js|css|woff2?|svg|png|ico)$
        header @hashedAssets Cache-Control "public, max-age=31536000, immutable"
        @spa not path *.js *.css *.map *.woff *.woff2 *.svg *.png *.jpg *.jpeg *.gif *.ico *.json
        handle @spa {
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
