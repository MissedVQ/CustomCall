#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

echo "============================================"
echo "  CustomCall - Vencord plugin installer"
echo "============================================"
echo

command -v node >/dev/null 2>&1 || { echo "[ERROR] Node.js not found. Install it from https://nodejs.org (LTS), then run again."; exit 1; }
command -v git  >/dev/null 2>&1 || { echo "[ERROR] git not found. Install it via your package manager, then run again."; exit 1; }

echo "[1/5] Enabling pnpm..."
corepack enable 2>/dev/null || true

VENCORD_DIR="$HOME/Vencord"
if [ ! -d "$VENCORD_DIR" ]; then
    echo "[2/5] Cloning Vencord..."
    git clone https://github.com/Vencord/Vencord "$VENCORD_DIR"
else
    echo "[2/5] Vencord folder already exists, skipping clone."
fi

echo "[3/5] Copying CustomCall into Vencord..."
mkdir -p "$VENCORD_DIR/src/userplugins"
rm -rf "$VENCORD_DIR/src/userplugins/CustomCall"
cp -r "$(pwd)" "$VENCORD_DIR/src/userplugins/CustomCall"

cd "$VENCORD_DIR"

echo "[4/5] Installing dependencies and building..."
pnpm install
pnpm build

echo "[5/5] Injecting into Discord..."
echo "(in the menu press Enter on your Discord install)"
pnpm inject

echo
echo "============================================"
echo "  Done! Fully restart Discord and enable"
echo "  CustomCall in Vencord settings."
echo "============================================"
