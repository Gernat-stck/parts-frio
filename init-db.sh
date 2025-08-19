#!/bin/bash
set -e

echo "🚀 Inicializando bases de datos para el usuario '$POSTGRES_USER'..."

# Crear DB principal si no existe
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    SELECT 'CREATE DATABASE nexus_db OWNER $POSTGRES_USER'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'nexus_db')\gexec
EOSQL

# Crear DB de test si no existe
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    SELECT 'CREATE DATABASE nexus_test OWNER $POSTGRES_USER'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'nexus_test')\gexec
EOSQL

echo "✅ Bases de datos nexus_db y nexus_test listas para '$POSTGRES_USER'"