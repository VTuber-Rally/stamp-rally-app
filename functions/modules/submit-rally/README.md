# submit-rally

Vérifie les signatures d'un rally complété puis crée une soumission.

## Étape par étape

- Importe les clés publiques de tous les artistes
- Reçoit la liste des stamps collectés par l'utilisateur
- Valide la signature de chaque tampon
- Si toutes les signatures sont valides, crée un nouveau document Appwrite dans la collection des soumissions et on renvoie l'id de la soumission
- Sinon on renvoie une erreur

## Requêtes

Le corps de la requête est composé d'un tableau `stamps` de type `Stamp`. Par ex:

```json
{
  "stamps": [
    {
      "standistId": "artisteA",
      "timestamp": "2025-07-01T10:00:00.000Z",
      "signature": "data:application/octet-stream;signature...",
      "scanTimestamp": "2025-07-01T11:05:30.123Z"
    },
    {
      "standistId": "artisteB",
      "timestamp": "2025-07-01T10:15:00.000Z",
      "signature": "data:application/octet-stream;signature...",
      "scanTimestamp": "2025-07-01T11:20:45.456Z"
    }
  ]
}
```

## Réponses Possibles

- Les signatures ont été validées et la soumission a été créée avec succès:

  ```json
  {
    "status": "success",
    "submissionId": "abc123"
  }
  ```

- Si au moins une signature est invalide, ou autre:
  ```json
  {
    "status": "error",
    "message": "Invalid signature"
  }
  ```

## ⚙️ Configuration

| Paramètre      | Valeur        |
| -------------- | ------------- |
| Runtime        | Node (20.0)   |
| Point d'entrée | `src/main.ts` |
