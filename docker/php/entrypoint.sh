#!/bin/bash
set -e

echo "⏳ Esperando a que la base de datos esté disponible..."
until php -r "try { new PDO('pgsql:host=' . getenv('DB_HOST') . ';port=' . getenv('DB_PORT') . ';dbname=' . getenv('DB_DATABASE'), getenv('DB_USERNAME'), getenv('DB_PASSWORD')); echo 'DB OK'; } catch (Exception \$e) { exit(1); }"; do
    sleep 2
done

echo "🔧 Ejecutando migraciones..."
php artisan migrate --force

USER_COUNT=$(php -r "echo \App\Models\User::count();")

if [ "$USER_COUNT" -eq "0" ]; then
    echo "🌱 Ejecutando seeder inicial..."
    php artisan db:seed --force
else
    echo "✅ Seeder ya ejecutado anteriormente"
fi

exec "$@"
