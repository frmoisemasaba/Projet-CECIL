# CECIL — Boutique maison

Site statique créé avec Cecil, Twig, CSS et JavaScript natifs. La présentation de la boutique reste dans le modèle Twig, et le catalogue est géré dans `data/products.yml`.

## Prérequis

- PHP 8.3 ou plus récent avec les extensions `fileinfo`, `gd` et `mbstring`
- Cecil (`cecil.phar`)

Téléchargez `cecil.phar` depuis [cecil.app](https://cecil.app/), puis placez-le à la racine du projet.

## Prévisualiser le site

```powershell
php cecil.phar serve --config=config/dev.yml
```

Le site sera disponible sur [http://localhost:8000](http://localhost:8000).

## Générer le site

```powershell
php cecil.phar build
php scripts/export-index.php
```

Cecil génère le site publiable dans `_site/`. La seconde commande met à jour `index.html` à la racine du dépôt à partir de cette génération. Le dépôt et GitHub Pages présentent ainsi la vraie boutique, avec les fichiers communs `assets/styles.css` et `assets/app.js`.

## Publier sur GitHub Pages

Le workflow `.github/workflows/pages.yml` compile le site avec Cecil puis déploie automatiquement `_site/` sur GitHub Pages à chaque push sur `main`. Dans les paramètres du dépôt, sélectionnez **Settings → Pages → Source → GitHub Actions**.

## Fonctionnalités

- Boutique responsive et navigation en français
- Recherche et filtres par catégorie
- Panier de démonstration avec quantités et sous-total
- Formulaire d’inscription de démonstration : aucune donnée n’est envoyée

Les images et les polices sont chargées depuis Unsplash et Google Fonts. Le paiement et les commandes ne sont pas connectés à un service réel.
