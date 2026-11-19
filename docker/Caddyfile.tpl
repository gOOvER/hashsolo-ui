:80 {
    handle /api/* {
        reverse_proxy {$API_UPSTREAM:hashsolo:3334}
    }

    handle {
        root * /var/www/html
        try_files {path} /index.html
        file_server
    }

    log {
        output stdout
        format %%LOGFORMAT%%
        level %%LOGLEVEL%%
    }
}
