## ⚙️ Configuration

| Paramètre          | Valeur                             |
| ------------------ | ---------------------------------- |
| Runtime            | Node (18.0)                        |
| Point d'entrée     | `src/main.ts`                      |
| Commandes de build | `npm install && npm run build`     |
| Permissions        | `users`                            |
| Timeout (Secondes) | 15 (par défaut)                    |

## 🔒 Variables d'environnement

| Variable                           | Description                                      |
| ---------------------------------- | ------------------------------------------------ |
| DATABASE_ID                        | ID de la base de données Appwrite                |
| SUBMISSIONS_COLLECTION_ID          | ID de la collection des soumissions              |
| CONTEST_PARTICIPANTS_COLLECTION_ID | ID de la collection des participants au concours |
| KV_COLLECTION_ID                   | ID de la collection des variables clé-valeur     |