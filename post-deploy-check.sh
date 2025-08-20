#!/bin/bash
set -e

APP_CONTAINER="nexus-app"
NGINX_CONTAINER="nexus-testing-nginx"
DB_CONTAINER="nexus-postgres"

echo "🔍 Validando estado de contenedores..."
docker compose ps

# 1️⃣ Verificar healthchecks (si están definidos en compose)
if docker inspect --format='{{.State.Health.Status}}' $APP_CONTAINER 2>/dev/null | grep -q healthy; then
    echo "✅ App container saludable"
else
    echo "❌ App container no saludable"; exit 1
fi

if docker inspect --format='{{.State.Health.Status}}' $DB_CONTAINER 2>/dev/null | grep -q healthy; then
    echo "✅ DB container saludable"
else
    echo "❌ DB container no saludable"; exit 1
fi

# 2️⃣ Archivos críticos en contenedor PHP
echo "📂 Verificando archivos críticos en contenedor..."
docker compose exec -T $APP_CONTAINER bash -c '
    for f in public/index.php vendor/autoload.php; do
        if [ -f "$f" ]; then
            echo "✅ $f existe"
        else
            echo "❌ $f falta"; exit 1
        fi
    done
'

# 3️⃣ Permisos de storage/ y bootstrap/cache
docker compose exec -T $APP_CONTAINER bash -c '
    for dir in storage bootstrap/cache; do
        if [ -w "$dir" ]; then
            echo "✅ $dir con permisos de escritura"
        else
            echo "❌ $dir no tiene permisos de escritura"; exit 1
        fi
    done
'

# 4️⃣ Verificar conexión a base de datos
echo "🗄  Probando conexión DB..."
docker compose exec -T $APP_CONTAINER php -r "
try {
    new PDO(
        getenv('DB_CONNECTION').':host='.getenv('DB_HOST').';port='.getenv('DB_PORT').';dbname='.getenv('DB_DATABASE'),
        getenv('DB_USERNAME'),
        getenv('DB_PASSWORD')
    );
    echo '✅ Conexión DB OK';
} catch (Exception \$e) {
    echo '❌ Fallo conexión DB: ' . \$e->getMessage();
    exit(1);
}
"

# 5️⃣ Probar endpoint HTTP principal
echo "🌐 Verificando respuesta HTTP..."
if curl -sS --fail --max-time 5 https://test.nexus.isolu.tech > /dev/null; then
    echo "✅ Nginx responde correctamente (Código 200)"
else
    echo "❌ Respuesta HTTP inválida o sin conexión"; exit 1
fi

echo "🎯 Post-deploy check finalizado con éxito"