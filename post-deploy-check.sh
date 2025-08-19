#!/bin/bash
set -euo pipefail

# Colores para la salida
OK="\e[32m✔\e[0m"
FAIL="\e[31m✘\e[0m"
INFO="\e[34mℹ\e[0m"

APP_CONTAINER="nexus-app"
NGINX_CONTAINER="partsfrio-nginx"
DB_CONTAINER="nexus-postgres"

echo -e "$INFO Iniciando validaciones post‑deploy..."

# 1️⃣ Estado de contenedores
echo -n "🛠 Verificando contenedores... "
if docker ps --format '{{.Names}}' | grep -q "$APP_CONTAINER" && \
   docker ps --format '{{.Names}}' | grep -q "$DB_CONTAINER"; then
    echo -e "$OK"
else
    echo -e "$FAIL Algún contenedor no está corriendo" && exit 1
fi

# 2️⃣ Healthcheck DB
echo -n "🗄 Verificando conexión a Postgres... "
if docker exec "$DB_CONTAINER" pg_isready -U "${POSTGRES_USER:-dev08_db}" >/dev/null; then
    echo -e "$OK"
else
    echo -e "$FAIL Base de datos no responde" && exit 1
fi

# 3️⃣ Migraciones pendientes
echo -n "📜 Comprobando migraciones pendientes... "
if docker exec "$APP_CONTAINER" php artisan migrate:status | grep -q 'Pending'; then
    echo -e "$FAIL Migraciones pendientes detectadas" && exit 1
else
    echo -e "$OK"
fi

# 4️⃣ Seeders críticos (roles/datos base)
echo -n "🌱 Verificando roles base... "
ROLE_COUNT=$(docker exec "$APP_CONTAINER" php -r "echo \App\Models\Role::count();")
if [ "$ROLE_COUNT" -gt 0 ]; then
    echo -e "$OK ($ROLE_COUNT roles)"
else
    echo -e "$FAIL Sin roles en DB" && exit 1
fi

# 5️⃣ Accesibilidad de endpoints críticos
for url in "https://nexus.isolu.tech/health" \
           "https://nexus.isolu.tech/api/ping"; do
    echo -n "🌐 Probing $url ... "
    if curl -sk --max-time 5 "$url" | grep -qi "ok"; then
        echo -e "$OK"
    else
        echo -e "$FAIL Error en endpoint: $url" && exit 1
    fi
done

# 6️⃣ Certificados HTTPS
echo -n "🔐 Validando certificados SSL... "
EXP_DAYS=$(echo | openssl s_client -servername nexus.isolu.tech -connect nexus.isolu.tech:443 2>/dev/null \
            | openssl x509 -noout -dates \
            | grep 'notAfter' \
            | sed 's/.*=//')
if [ -n "$EXP_DAYS" ]; then
    echo -e "$OK Válido hasta: $EXP_DAYS"
else
    echo -e "$FAIL No se pudo validar SSL" && exit 1
fi

echo -e "$OK Todas las validaciones pasaron con éxito 🎉"
