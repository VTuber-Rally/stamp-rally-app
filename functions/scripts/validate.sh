#!/usr/bin/env bash

# Script générique pour valider une fonction Appwrite avec TSC
# Utilisation: ./validate.sh <nom-de-la-fonction>
# Exemple:   ./validate.sh get-private-key

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

if [ ! -d "$MODULE_PATH" ]; then
    echo "❌ Function $FUNCTION_NAME not found in $MODULE_PATH"
    exit 1
fi

echo "🔨 Checking $FUNCTION_NAME with TypeScript..."
pnpm run --filter "@vtube-stamp-rally/functions__$FUNCTION_NAME" check-types

echo "✅ $FUNCTION_NAME is valid"