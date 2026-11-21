#!/bin/sh

js_escape() {
    printf '%s' "$1" | sed 's#\\#\\\\#g; s#"#\\"#g'
}

write_runtime_config() {
    config="{"
    separator=""

    if [ "${PUBLIC_POOL_API_URL+x}" ]; then
        config="${config}${separator}\"API_URL\":\"$(js_escape "$PUBLIC_POOL_API_URL")\""
        separator=","
    fi

    if [ "${PUBLIC_POOL_STRATUM_URL+x}" ]; then
        config="${config}${separator}\"STRATUM_URL\":\"$(js_escape "$PUBLIC_POOL_STRATUM_URL")\""
        separator=","
    fi

    if [ "${PUBLIC_POOL_SECURE_STRATUM_URL+x}" ]; then
        config="${config}${separator}\"SECURE_STRATUM_URL\":\"$(js_escape "$PUBLIC_POOL_SECURE_STRATUM_URL")\""
        separator=","
    fi

    if [ "${PUBLIC_POOL_STRATUM_V2_URL+x}" ]; then
        config="${config}${separator}\"STRATUM_V2_URL\":\"$(js_escape "$PUBLIC_POOL_STRATUM_V2_URL")\""
        separator=","
    fi

    for var_name in DONATION_BTC_ADDRESS DONATION_URL DONATION_LINK_LABEL DONATION_TITLE DONATION_SUBTITLE; do
        eval "var_val=\${$var_name:-}"
        if [ -n "$var_val" ]; then
            config="${config}${separator}\"${var_name}\":\"$(js_escape "$var_val")\""
            separator=","
        fi
    done

    config="${config}}"

    rm -f /var/www/html/assets/runtime-config.js.gz /var/www/html/assets/runtime-config.js.br
    cat > /var/www/html/assets/runtime-config.js <<EOF
window.__PUBLIC_POOL_CONFIG__ = ${config};
EOF
}

if [ ! -e "/etc/Caddyfile" ]; then
    sed -i "s#%%LOGLEVEL%%#${LOGLEVEL:-INFO}#g" /etc/Caddyfile.tpl
    sed -i "s#%%LOGFORMAT%%#${LOGFORMAT:-json}#g" /etc/Caddyfile.tpl
    mv /etc/Caddyfile.tpl /etc/Caddyfile
else
    rm -f /etc/Caddyfile.tpl
fi

write_runtime_config

echo "Starting UI on port 80"
echo "Logs output: ${LOGLEVEL:-INFO} (${LOGFORMAT:-json})"

exec caddy run --config /etc/Caddyfile
