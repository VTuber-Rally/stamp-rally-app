# Stats-server
Cette brique est une simple application Express qui expose un endpoint `/webhook`, qui est appelé par Appwrite lorsqu'une soumission est créée (enfin, ça sera le cas).
Le handler de cette fonction ajoute alors un point à la base de données InfluxDB.

*Voilà c'est tout pour l'instant*