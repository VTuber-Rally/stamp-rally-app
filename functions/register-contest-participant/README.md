# register-contest-participant

Cette fonction Appwrite permet d'enregistrer un participant au concours. Elle vérifie plusieurs conditions avant d'autoriser l'inscription.

## 🧰 Utilisation

### POST /

Enregistre un participant au concours.

**Corps de la requête**

```json
{
  "secret": "string" // Secret d'inscription au concours
}
```

**Réponses possibles**

Succès (200):

```json
{
  "status": "success",
  "message": "contest.registration.success",
  "contestParticipantId": "string"
}
```

Erreurs (200, malheureusement):

```json
{
  "status": "error",
  "message": "contest.registration.notOpen",
  "error": "Contest is not open to registration"
}
```

```json
{
  "status": "error",
  "message": "contest.registration.noSubmissions",
  "error": "User has no submissions"
}
```

```json
{
  "status": "error",
  "message": "contest.registration.alreadyRegistered",
  "error": "User has already registered"
}
```

## ⚙️ Configuration

| Paramètre          | Valeur                        |
| ------------------ | ----------------------------- |
| Runtime            | Node (18.0)                   |
| Point d'entrée     | `src/main.js`                 |
| Commandes de build | `npm install & npm run build` |
| Permissions        | `users`                       |
| Timeout (Secondes) | 15 (par défaut)               |

## 🔒 Variables d'environnement

| Variable                       | Description                                      |
| ------------------------------ | ------------------------------------------------ |
| DATABASE_ID                    | ID de la base de données Appwrite                |
| SUBMISSION_COLLECTION_ID       | ID de la collection des soumissions              |
| CONTEST_COLLECTION_ID          | ID de la collection des participants au concours |
| KV_COLLECTION_ID               | ID de la collection des variables clé-valeur     |