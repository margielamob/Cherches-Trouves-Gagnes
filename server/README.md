# LOG3990 - Server Setup Guide

Dans ce document est décrit les commandes a effectué pour run le server

## Installation des dépendances de l'application

1. Installer `npm`. `npm` vient avec `Node` que vous pouvez télécharger [ici](https://nodejs.org/en/download/)

2. Lancer `npm ci` (Continuous Integration) pour installer les versions exactes des dépendances du projet. Ceci est possiblement seulement si le fichier `package-lock.json` existe. Ce fichier vous est fourni dans le code de départ.

## Ajout de dépendances aux projets

Vous pouvez ajouter d'autres dépendances aux deux projets avec la commande `npm install nomDependance`.

Pour ajouter une dépendance comme une dépendance de développement (ex : librairie de tests, types TS, etc.) ajoutez l'option `--save-dev` : `npm install nomDependance --save-dev`.

Un ajout de dépendance modifiera les fichiers `package.json` et `package-lock.json`.

# Serveur

Lorsque la commande `npm start` est lancée dans le dossier _/server_, le script suivant (disponible dans `package.json`) est exécuté : `nodemon` qui effectue 2 étapes similaires au client :

1. **Build** : transpile le code TypeScript en JavaScript et copie les fichiers dans le répertoire `/out`.

    **Note** : L'outil `nodemon` est un utilitaire qui surveille pour des changements dans vos fichiers `*.ts` et relance automatiquement le serveur si vous modifiez un de ses fichiers. La modification d'un autre fichier nécessitera un relancement manuel du serveur (interrompre le processus et relancer `npm start`).

2. **Deploy** : lance le serveur à partir du fichier `index.js`. Le serveur est lancé sur `http://ec2-35-182-254-204.ca-central-1.compute.amazonaws.com:3000`.
