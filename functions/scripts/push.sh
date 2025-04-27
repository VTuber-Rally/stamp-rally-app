#!/usr/bin/env bash

# Script générique pour pusher une fonction Appwrite pré-buildée
# Utilisation: ./push.sh <nom-de-la-fonction>
# Exemple:   ./push.sh get-private-key

set -euo pipefail

FUNCTION_NAME=$1

if [ -z "$FUNCTION_NAME" ]; then
  echo "❌ Erreur: Nom de la fonction manquant."
  echo "Utilisation: $0 <nom-de-la-fonction>"
  exit 1
fi

SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
ARTIFACT_PATH="$SCRIPTPATH/../artifacts/$FUNCTION_NAME"
BUILD_SCRIPT="./build.sh $FUNCTION_NAME"

echo "🧐 Checking if artifact for $FUNCTION_NAME exists at $ARTIFACT_PATH..."

if [ ! -d "$ARTIFACT_PATH" ] || [ -z "$(ls -A "$ARTIFACT_PATH")" ]; then
    echo "❌ Artifact directory '$ARTIFACT_PATH' does not exist or is empty."
    echo "   Please build the function first using '$BUILD_SCRIPT'"
    exit 1
fi

echo "🔎 Finding $FUNCTION_NAME function ID in Appwrite..."
FUNCTION_ID=$(appwrite functions list --json | jq -r --arg NAME "$FUNCTION_NAME" '.functions[] | select(.name == $NAME) | ."$id"')

if [ -z "$FUNCTION_ID" ]; then
    echo "❌ Function '$FUNCTION_NAME' not found in Appwrite."
    exit 1
fi

echo "✅ Function found (ID: $FUNCTION_ID)."
echo "🚀 Pushing artifact from $ARTIFACT_PATH to Appwrite function $FUNCTION_NAME..."

appwrite push function --function-id="$FUNCTION_ID"

if [ $? -ne 0 ]; then
    echo "❌ Failed to push $FUNCTION_NAME function to Appwrite"
    exit 1
fi

echo "🎉 Successfully pushed $FUNCTION_NAME function to Appwrite!" 