#!/usr/bin/env bash

# Script générique pour pusher des fonctions Appwrite pré-buildées
# Utilisation: ./push.sh <nom-de-fonction-1> [nom-de-fonction-2] [...]
# Exemple:   ./push.sh get-private-key send-notification

set -euo pipefail

if [ $# -eq 0 ]; then
  echo "❌ Erreur: Aucun nom de fonction fourni."
  echo "Utilisation: $0 <nom-de-fonction-1> [nom-de-fonction-2] [...]"
  echo "Exemple:   ./push.sh get-private-key send-notification"
  exit 1
fi

SCRIPTPATH="$(
  cd -- "$(dirname "$0")" >/dev/null 2>&1
  pwd -P
)"
BUILD_SCRIPT="./build.sh"

FAILED_FUNCTIONS=()
SUCCESSFUL_FUNCTIONS=()

for FUNCTION_NAME in "$@"; do
  echo ""
  echo "🔄 Traitement de la fonction: $FUNCTION_NAME"
  echo "============================================"

  ARTIFACT_PATH="$SCRIPTPATH/../artifacts/$FUNCTION_NAME"

  echo "🧐 Checking if artifact for $FUNCTION_NAME exists at $ARTIFACT_PATH..."

  if [ ! -d "$ARTIFACT_PATH" ] || ! find "$ARTIFACT_PATH" -mindepth 1 -print -quit | grep -q .; then

    echo "❌ Artifact directory '$ARTIFACT_PATH' does not exist or is empty."
    echo "   Please build the function first using '$BUILD_SCRIPT $FUNCTION_NAME'"
    FAILED_FUNCTIONS+=("$FUNCTION_NAME (no artifact)")
    continue
  fi

  echo "🔎 Finding $FUNCTION_NAME function ID in Appwrite..."
  FUNCTION_ID=$(appwrite functions list --json | jq -r --arg NAME "$FUNCTION_NAME" '.functions[] | select(.name == $NAME) | ."$id"')

  if [ -z "$FUNCTION_ID" ]; then
    echo "❌ Function '$FUNCTION_NAME' not found in Appwrite."
    FAILED_FUNCTIONS+=("$FUNCTION_NAME (not found in Appwrite)")
    continue
  fi

  echo "✅ Function found (ID: $FUNCTION_ID)."
  echo "🚀 Pushing artifact from $ARTIFACT_PATH to Appwrite function $FUNCTION_NAME..."

  if ! appwrite push function --function-id="$FUNCTION_ID"; then
    echo "❌ Failed to push $FUNCTION_NAME function to Appwrite"
    FAILED_FUNCTIONS+=("$FUNCTION_NAME (push failed)")
    continue
  fi

  echo "✅ Successfully pushed $FUNCTION_NAME function to Appwrite!"
  SUCCESSFUL_FUNCTIONS+=("$FUNCTION_NAME")
done

echo ""
echo "============================================"
echo "📊 Push Summary"
echo "============================================"

if [ ${#SUCCESSFUL_FUNCTIONS[@]} -gt 0 ]; then
  echo "✅ Successfully pushed (${#SUCCESSFUL_FUNCTIONS[@]}):"
  for func in "${SUCCESSFUL_FUNCTIONS[@]}"; do
    echo "   - $func"
  done
fi

if [ ${#FAILED_FUNCTIONS[@]} -gt 0 ]; then
  echo "❌ Failed to push (${#FAILED_FUNCTIONS[@]}):"
  for func in "${FAILED_FUNCTIONS[@]}"; do
    echo "   - $func"
  done
  exit 1
fi

echo "🎉 All functions pushed successfully!"
