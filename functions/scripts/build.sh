#!/usr/bin/env bash

# Script générique pour builder des fonctions Appwrite avec esbuild
# Utilisation: ./build.sh <nom-de-fonction-1> [nom-de-fonction-2] [...]
# Exemple:   ./build.sh get-private-key send-notification

set -euo pipefail

SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

if [ $# -eq 0 ]; then
  echo "❌ Erreur: Aucun nom de fonction fourni."
  echo "Utilisation: $0 <nom-de-fonction-1> [nom-de-fonction-2] [...]"
  echo "Exemple:   ./build.sh get-private-key send-notification"
  exit 1
fi

FAILED_FUNCTIONS=()
SUCCESSFUL_FUNCTIONS=()

for FUNCTION_NAME in "$@"; do
    echo ""
    echo "🔄 Traitement de la fonction: $FUNCTION_NAME"
    echo "============================================"
    
    FUNCTION_ID=$(jq -r --arg NAME "$FUNCTION_NAME" '.functions[] | select(.name == $NAME) | ."$id"' "$SCRIPTPATH/../../appwrite.json")

    if [ -z "$FUNCTION_ID" ]; then
        echo "❌ Function '$FUNCTION_NAME' not found in Appwrite."
        FAILED_FUNCTIONS+=("$FUNCTION_NAME (not found in appwrite.json)")
        continue
    fi

    echo "ℹ️ Function $FUNCTION_NAME found in Appwrite with ID $FUNCTION_ID"

    MODULE_PATH="$SCRIPTPATH/../modules/$FUNCTION_NAME"
    DESTINATION_PATH="$SCRIPTPATH/../artifacts/$FUNCTION_NAME"
    OUTPUT_FILE="index.js"

    if [ ! -d "$MODULE_PATH" ]; then
        echo "❌ Function $FUNCTION_NAME not found in $MODULE_PATH"
        FAILED_FUNCTIONS+=("$FUNCTION_NAME (module not found)")
        continue
    fi

    echo "🔨 Building $FUNCTION_NAME function with esbuild..."
    if ! pnpm run --filter "@vtube-stamp-rally/functions__$FUNCTION_NAME" build; then
        echo "❌ esbuild failed for $FUNCTION_NAME"
        FAILED_FUNCTIONS+=("$FUNCTION_NAME (build failed)")
        continue
    fi

    echo "✨ esbuild bundling successful. Preparing artifact for $FUNCTION_NAME..."

    if [ -d "$DESTINATION_PATH" ]; then
        echo "🧹 Removing existing artifact directory: $DESTINATION_PATH"
        rm -rf "$DESTINATION_PATH"
    fi

    mkdir -p "$DESTINATION_PATH"

    echo "📦 Copying esbuild bundle ($MODULE_PATH/dist/$OUTPUT_FILE) to artifact directory..."
    if [ ! -f "$MODULE_PATH/dist/$OUTPUT_FILE" ]; then
        echo "❌ File $MODULE_PATH/dist/$OUTPUT_FILE not found"
        FAILED_FUNCTIONS+=("$FUNCTION_NAME (output file not found)")
        continue
    fi
    
    if ! cp "$MODULE_PATH/dist/$OUTPUT_FILE" "$DESTINATION_PATH/"; then
        echo "❌ Failed to copy esbuild bundle for $FUNCTION_NAME"
        FAILED_FUNCTIONS+=("$FUNCTION_NAME (copy failed)")
        continue
    fi

    echo "✅ Created $FUNCTION_NAME artifact (single bundle) at $DESTINATION_PATH"
    echo "🔍 Size of $FUNCTION_NAME artifact:"
    du -sh "$DESTINATION_PATH"
    
    SUCCESSFUL_FUNCTIONS+=("$FUNCTION_NAME")
done

echo ""
echo "============================================"
echo "📊 Build Summary"
echo "============================================"

if [ ${#SUCCESSFUL_FUNCTIONS[@]} -gt 0 ]; then
    echo "✅ Successfully built (${#SUCCESSFUL_FUNCTIONS[@]}):"
    for func in "${SUCCESSFUL_FUNCTIONS[@]}"; do
        echo "   - $func"
    done
fi

if [ ${#FAILED_FUNCTIONS[@]} -gt 0 ]; then
    echo "❌ Failed to build (${#FAILED_FUNCTIONS[@]}):"
    for func in "${FAILED_FUNCTIONS[@]}"; do
        echo "   - $func"
    done
    exit 1
fi

echo "🎉 All functions built successfully!"