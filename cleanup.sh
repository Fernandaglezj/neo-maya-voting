#!/bin/bash

echo "Buscando procesos de Next.js..."
PIDS=$(ps aux | grep "next" | grep -v grep | awk '{print $2}')

if [ -z "$PIDS" ]; then
  echo "No se encontraron procesos de Next.js en ejecución."
  exit 0
fi

echo "Procesos encontrados:"
ps aux | grep "next" | grep -v grep

echo "Deteniendo procesos Next.js..."
for pid in $PIDS; do
  echo "Deteniendo proceso $pid..."
  kill -9 $pid
done

echo "Todos los procesos Next.js han sido detenidos."
echo "Ahora puedes ejecutar 'npm run dev' en un puerto limpio." 