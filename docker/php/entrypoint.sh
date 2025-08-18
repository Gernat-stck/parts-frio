#!/bin/bash

echo "🔧 Ejecutando comandos Artisan..."

php artisan migrate --force

# Ejecutar seeder solo si no hay usuarios
USER_COUNT=$(php artisan tinker --execute="echo \App\Models\User::count();")

if [ "$USER_COUNT" -eq "0" ]; then
  echo "🌱 Ejecutando seeder inicial..."
  php artisan db:seed
else
  echo "✅ Seeder ya ejecutado anteriormente"
fi


php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan storage:link

echo "✅ Laravel listo para servir"

exec "$@"