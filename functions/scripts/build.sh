#!/usr/bin/env bash

# Script générique pour builder une fonction Appwrite avec esbuild
# Utilisation: ./build.sh <nom-de-la-fonction>
# Exemple:   ./build.sh get-private-key

set -euo pipefail

SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

FUNCTION_NAME=$1

if [ -z "$FUNCTION_NAME" ]; then
  echo "❌ Erreur: Nom de la fonction manquant."
  echo "Utilisation: $0 <nom-de-la-fonction>"
  exit 1
fi

FUNCTION_ID=$(jq -r --arg NAME "$FUNCTION_NAME" '.functions[] | select(.name == $NAME) | ."$id"' "$SCRIPTPATH/../../appwrite.json")

if [ -z "$FUNCTION_ID" ]; then
    echo "❌ Function '$FUNCTION_NAME' not found in Appwrite."
    exit 1
fi

echo "ℹ️ Function $FUNCTION_NAME found in Appwrite with ID $FUNCTION_ID"

MODULE_PATH="$SCRIPTPATH/../modules/$FUNCTION_NAME"
DESTINATION_PATH="$SCRIPTPATH/../artifacts/$FUNCTION_NAME"
OUTPUT_FILE="index.js"

if [ ! -d "$MODULE_PATH" ]; then
    echo "❌ Function $FUNCTION_NAME not found in $MODULE_PATH"
    exit 1
fi

echo "🔨 Building $FUNCTION_NAME function with esbuild..."
pnpm run --filter "$FUNCTION_NAME" build

if [ $? -ne 0 ]; then
    echo "❌ esbuild failed for $FUNCTION_NAME"
    exit 1
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
    exit 1
fi
cp "$MODULE_PATH/dist/$OUTPUT_FILE" "$DESTINATION_PATH/"

if [ $? -ne 0 ]; then
    echo "❌ Failed to copy esbuild bundle for $FUNCTION_NAME"
    exit 1
fi

echo "✅ Created $FUNCTION_NAME artifact (single bundle) at $DESTINATION_PATH"

echo "🔍 Size of $FUNCTION_NAME artifact:"
du -sh "$DESTINATION_PATH"