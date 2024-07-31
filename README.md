 # Japan Expo 2024 VTuber Stamp Rally
[![Netlify Status](https://api.netlify.com/api/v1/badges/0ca7b7bc-c703-4bce-b845-1e5670cc3c01/deploy-status)](https://app.netlify.com/sites/stamp-rally-devel/deploys) [Demo](https://stamp-rally-devel.netlify.app/) | [Storybook](http://rally-storybook.luc.ovh/)

![Logo](/web/src/assets/logo.png)

## Introduction
Cette application est un projet de Stamp Rally pour la Japan Expo 2024, avec un thème sur les stands vendant des produits en lien avec le monde du VTubing. Inspiré librement du concept d'[Holoquest](https://github.com/watsonindustries/holoquest), mais entièrement développé de zéro. 

## Stamp Rally
Un stamp rally est un jeu où les participants (ici appelé _rallyiste_) doivent se rendre à différents stands pour obtenir un tampon (un _stamp_). Une fois un nombre minimum de tampons obtenus (ici 10), le rallyiste peut venir à un stand spécifique, pour faire valider sa participation par un membre du staff du rally, faire tourner une roue de la fortune, et obtenir un prix (ici un certain nombre de cartes exclusives).

Voici le fonctionnement rapidement :
## Backend Appwrite
- le backend est composé d'un serveur Appwrite, qui gère :
  - les utilisateurs (avec l'Authentification)
  - les fiches de stand (nom, position, clé publique, etc) ainsi que les soumissions, et tampons qui lui sont liés (avec les Collections)

- Chaque standiste possède un compte "standist", et possède une clé ECDSA qui lui est personnelle
  - Depuis son espace "standist", le standiste peut générer un QR code, qui contient un timestamp de génération, son identifiant et une signature de ces deux champs, par sa clé ECDSA
- chaque rallyiste peut scanner un de ces QR codes générés par un standiste, et obtenir un tampon. La signature est vérifiée au moment de l'ajout du tampon, pour éviter tout tampering, et le timestamp est vérifié pour éviter les attaques de rejeu basiques.
- les permissions sont gérées par des labels Appwrite :
  - les rallyistes n'ont pas de label
  - les standistes ont le label `standist`
  - les staffs ont le label `staff`
- Lorsqu'un rallyiste a obtenu le nombre minimum de tampons, il peut soumettre sa participation. C'est un appel POST à une fonction cloud Appwrite (une fonction serverless) `verify-qrcodes`, qui vérifie les tampons, et si tout est bon, ajoute une soumission à la collection `submissions`, avec le timestamp de soumission, l'identifiant du rallyiste, et les tampons obtenus.

## Frontend
Le frontend est une application Vite-React qui contient trois "sous-applications"
- la partie rallyiste, qui permet de voir la liste des stands, de scanner un QR code, et de voir les tampons obtenus, ainsi qu'une carte ded la convention développée avec MapLibre
- la partie standiste, qui permet de générer un QR code
- la partie staff, qui permet de valider une soumission d'un rallyiste, de faire tourner la roue de la fortune, ainsi qu'une fonction de génération de QR code, pour tester et débugger.

Il est possible de naviguer entre ces trois parties, en revenant à la page d'accueil (espace rallyiste), puis dans "À propos" et tout en bas, il y a deux liens.

## Particularités
- Les QR codes générés par les standistes sont régénérés toutes les 5 secondes, et "expirent" (ne sont plus acceptés) après 2 minutes. Cependant, afin de disposer d'une solution pour les standistes qui ne peuvent pas avoir l'application sur un téléphone, il est possible de générer un QR code "permanent" (qui n'expire pas) depuis la partie staff, pour l'imprimer. La date est alors remplacée par -1. Dans ce cas-là, on ne vérifie donc pas le timestamp.

## Déploiement
Le déploiement est automatisé avec Netlify. Le backend Appwrite est déployé à partir du fichier de configuration [appwrite.json](/appwrite.json), et le frontend est déployé à partir du fichier de configuration [netlify.toml](/netlify.toml).
