#!/usr/bin/env bash

# Script générique pour valider des fonctions Appwrite avec TSC
# Utilisation: ./validate.sh <nom-de-fonction-1> [nom-de-fonction-2] [...]
# Exemple:   ./validate.sh get-private-key send-notification

set -euo pipefail

SCRIPTPATH="$(
  cd -- "$(dirname "$0")" >/dev/null 2>&1
  pwd -P
)"

if [ $# -eq 0 ]; then
  echo "❌ Erreur: Aucun nom de fonction fourni."
  echo "Utilisation: $0 <nom-de-fonction-1> [nom-de-fonction-2] [...]"
  echo "Exemple:   ./validate.sh get-private-key send-notification"
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

  if [ ! -d "$MODULE_PATH" ]; then
    echo "❌ Function $FUNCTION_NAME not found in $MODULE_PATH"
    FAILED_FUNCTIONS+=("$FUNCTION_NAME (module not found)")
    continue
  fi

  echo "🔨 Checking $FUNCTION_NAME with TypeScript..."
  if ! pnpm run --filter "@vtube-stamp-rally/functions__$FUNCTION_NAME" check-types; then
    echo "❌ TypeScript validation failed for $FUNCTION_NAME"
    FAILED_FUNCTIONS+=("$FUNCTION_NAME (type check failed)")
    continue
  fi

  echo "✅ $FUNCTION_NAME is valid"
  SUCCESSFUL_FUNCTIONS+=("$FUNCTION_NAME")
done

echo ""
echo "============================================"
echo "📊 Validation Summary"
echo "============================================"

if [ ${#SUCCESSFUL_FUNCTIONS[@]} -gt 0 ]; then
  echo "✅ Successfully validated (${#SUCCESSFUL_FUNCTIONS[@]}):"
  for func in "${SUCCESSFUL_FUNCTIONS[@]}"; do
    echo "   - $func"
  done
fi

if [ ${#FAILED_FUNCTIONS[@]} -gt 0 ]; then
  echo "❌ Failed to validate (${#FAILED_FUNCTIONS[@]}):"
  for func in "${FAILED_FUNCTIONS[@]}"; do
    echo "   - $func"
  done
  exit 1
fi

echo "🎉 All functions are valid!"
