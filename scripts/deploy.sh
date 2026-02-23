#!/usr/bin/env bash
# =============================================================================
# arsnova.click V3 – Deploy-Skript (auf dem Server oder via CI per SSH)
# Voraussetzung: Im Repo-Verzeichnis, .env.production vorhanden.
# Nutzung: ./scripts/deploy.sh   oder   bash scripts/deploy.sh
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.production"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Fehler: $ENV_FILE nicht gefunden. Bitte anlegen (siehe .env.production.example)."
  exit 1
fi

echo ">>> Docker Compose: Build & Start (Produktion)"
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d --build

echo ">>> Prisma: Migrationen anwenden"
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T app npx prisma migrate deploy

echo ">>> Deploy abgeschlossen."
