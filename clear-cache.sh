#!/bin/bash

echo "Limpiando caché de Next.js..."

# Detener cualquier proceso de Next.js en ejecución
./cleanup.sh

# Eliminar la carpeta .next
echo "Eliminando carpeta .next..."
rm -rf .next

# Eliminar node_modules/.cache
echo "Eliminando node_modules/.cache..."
rm -rf node_modules/.cache

echo "Caché eliminada. Ahora puedes ejecutar 'npm run dev' para iniciar el servidor con un caché limpio." 