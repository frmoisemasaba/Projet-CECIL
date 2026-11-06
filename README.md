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
```

Cecil génère le site publiable dans `_site/`. Les fichiers sources du projet et le site généré sont séparés.

## Fonctionnalités

- Boutique responsive et navigation en français
- Recherche et filtres par catégorie
- Panier de démonstration avec quantités et sous-total
- Formulaire d’inscription de démonstration : aucune donnée n’est envoyée

Les images et les polices sont chargées depuis Unsplash et Google Fonts. Le paiement et les commandes ne sont pas connectés à un service réel.
