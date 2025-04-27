# Fonctions serverless Appwrite

## Fonctions

- `get-private-key`: Utilisé par le staff, renvoie la clé privée d'un utilisateur, pour ensuite générer un stamp en usurpant l'identité d'un utilisateur
- `submit-rally`: Utilisée par les utilisateurs pour soumettre leur rally
- `register-contest-participant`: Utilisée par les utilisateurs pour s'enregistrer à un concours

## Utilisation
Pour build/déployer sur Appwrite, exécuter les scripts dans l'ordre :

```bash
scripts/build.sh <nom de la fonction>
scripts/push.sh <nom de la fonction>
```