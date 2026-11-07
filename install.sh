#!/usr/bin/env bash
# CustomCall - Vencord plugin installer (Linux / macOS)
# Run:  bash install.sh
# Or:   chmod +x install.sh && ./install.sh

set -u

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_SRC="${SCRIPT_DIR}/index.tsx"
VENcord_DIR="${HOME}/Vencord"
PLUGIN_DST="${VENcord_DIR}/src/userplugins/CustomCall"

echo "============================================"
echo "  CustomCall - Vencord plugin installer"
echo "============================================"
echo

# ---------- pre-flight checks ----------
if ! command -v node >/dev/null 2>&1; then
    echo "[ERROR] Node.js not found."
    echo "Install it from https://nodejs.org (LTS version), then run this file again."
    exit 1
fi

if ! command -v git >/dev/null 2>&1; then
    echo "[ERROR] git not found."
    echo "Install it from https://git-scm.com, then run this file again."
    exit 1
fi

if [ ! -f "${PLUGIN_SRC}" ]; then
    echo "[ERROR] index.tsx not found next to this script."
    echo "Put index.tsx in the same folder as this installer and run again."
    exit 1
fi

# ---------- [1/5] pnpm via corepack ----------
echo "[1/5] Enabling pnpm..."
if command -v corepack >/dev/null 2>&1; then
    corepack enable >/dev/null 2>&1 || true
fi

if ! command -v pnpm >/dev/null 2>&1; then
    echo "[ERROR] pnpm is not available after 'corepack enable'."
    echo "Make sure Node.js LTS is installed (it ships with corepack):"
    echo "  https://nodejs.org"
    echo
    echo "If corepack is present but not on PATH, try:"
    echo "  sudo corepack enable"
    echo "  # or: npm i -g pnpm"
    exit 1
fi

# ---------- [2/5] clone Vencord ----------
if [ -d "${VENcord_DIR}" ]; then
    echo "[2/5] Vencord folder already exists, skipping clone."
else
    echo "[2/5] Cloning Vencord..."
    if ! git clone https://github.com/Vencord/Vencord "${VENcord_DIR}"; then
        echo "[ERROR] Failed to clone Vencord. Check your internet connection."
        exit 1
    fi
fi

# ---------- [3/5] copy plugin ----------
echo "[3/5] Copying CustomCall into Vencord..."
mkdir -p "${VENcord_DIR}/src/userplugins" || {
    echo "[ERROR] Cannot create ${VENcord_DIR}/src/userplugins"
    exit 1
}

# clean previous copy so stale files don't linger
rm -rf "${PLUGIN_DST}"
mkdir -p "${PLUGIN_DST}" || {
    echo "[ERROR] Cannot create ${PLUGIN_DST}"
    echo "Check write permissions on ${VENcord_DIR}."
    exit 1
}

# copy everything except the installer scripts themselves
(
    cd "${SCRIPT_DIR}" || exit 1
    for f in *; do
        case "${f}" in
            install.sh|install.bat|"$(basename "${BASH_SOURCE[0]}")") continue ;;
        esac
        cp -R -- "${f}" "${PLUGIN_DST}/"
    done
) || {
    echo "[ERROR] Failed to copy plugin files."
    echo "Check write permissions on ${PLUGIN_DST}."
    exit 1
}

if [ ! -f "${PLUGIN_DST}/index.tsx" ]; then
    echo "[ERROR] index.tsx did not end up in ${PLUGIN_DST}."
    exit 1
fi

cd "${VENcord_DIR}" || {
    echo "[ERROR] Cannot cd into ${VENcord_DIR}."
    exit 1
}

# ---------- [4/5] build ----------
echo "[4/5] Installing dependencies and building..."
if ! pnpm install; then
    echo "[ERROR] 'pnpm install' failed."
    echo "Try deleting ${VENcord_DIR} and running this installer again."
    exit 1
fi

if ! pnpm build; then
    echo "[ERROR] Build failed."
    echo "If a plugin failed to compile, check its error message above."
    echo "To start fresh: rm -rf \"${VENcord_DIR}\" and run again."
    exit 1
fi

# ---------- [5/5] inject ----------
echo "[5/5] Injecting into Discord..."
echo "(in the menu press Enter on your Discord install)"
if ! pnpm inject; then
    echo "[ERROR] Inject failed - usually a network problem (GitHub unreachable)."
    echo
    echo "Try ONE of these:"
    echo "  1. Retry: open a terminal in \"${VENcord_DIR}\" and run: pnpm inject"
    echo "  2. Download the installer manually and run it:"
    echo "     https://github.com/Vencord/Installer/releases/latest"
    echo "     (pick the Linux/macOS build appropriate for your system)"
    echo "  3. One-liner install script:"
    echo "     curl -sS https://raw.githubusercontent.com/Vencord/Installer/main/install.sh | sh"
    echo
    echo "The plugin itself IS built already - only the inject step failed."
    exit 1
fi

echo
echo "============================================"
echo "  Done! Fully restart Discord and enable"
echo "  CustomCall in Vencord settings."
echo "============================================"
exit 0
