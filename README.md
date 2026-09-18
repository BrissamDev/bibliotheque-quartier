# Bibliothèque de quartier

Application web de gestion d'une bibliothèque de quartier.

## Fonctionnalités

- Gestion des auteurs
- Gestion des livres
- Gestion des adhérents
- Gestion des emprunts
- Retour des livres
- Recherche de livres par titre ou auteur
- Historique des emprunts d'un adhérent
- Détection des emprunts en retard
- Tableau de bord avec statistiques

## Technologies

- HTML5
- CSS3
- JavaScript
- Node.js
- Express.js
- PostgreSQL
- Git / GitHub

## Architecture

```text
bibliotheque/
├── controllers/
├── database/
│   └── schema.sql
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── middleware/
├── routes/
├── .env
├── .env.example
├── .gitignore
├── app.js
├── db.js
├── main.js
├── package.json
└── test-db.js