# DZShop

Boutique en ligne d'électronique et d'accessoires pour l'Algérie (prix en DZD, livraison gratuite dès 10 000 DZD).

## Fonctionnalités
- Catalogue avec recherche, filtre par catégorie et tri
- Fiche produit, panier (conservé après un rafraîchissement)
- Comptes clients (inscription / connexion sécurisées)
- Commande enregistrée en base, historique « Mes commandes »
- Espace admin : ajouter et supprimer des produits

## Technologies
React + Vite + Bootstrap (front) · Node.js + Express + MongoDB / Mongoose (API) · JWT + bcrypt (comptes)

## Lancer le projet en local
1. **API** : `cd dzshop-api`, copier `.env.example` en `.env` et le remplir, puis `npm install` et `npm run dev`
2. **Site** : `cd dzshop`, `npm install`, puis `npm run dev` (http://localhost:5173)
3. **Premier admin** : s'inscrire sur le site, puis `node makeAdmin.js ton-email` dans `dzshop-api`

## Variables d'environnement (noms seulement)
- API : `MONGO_URI`, `JWT_SECRET`, `PORT`, `FRONTEND_URL`
- Site : `VITE_API_URL`