# Vérification de Rituel

Vérifié le 1er octobre 2026.

## Résultat

Application locale Next.js fonctionnelle, en français, inspirée du traqueur sombre fourni. Sauvegarde dans ce navigateur, conformément au choix de l’utilisateur. Aucun compte Supabase ni déploiement distant nécessaire pour cette version.

## Parcours vérifiés

- Création d’une habitude, saisie d’une intention et choix d’une couleur.
- Validation quotidienne, annulation et persistance après rechargement.
- Modification d’une habitude ; annulation puis confirmation de suppression.
- Vues semaine et année, périodes précédente/suivante, statistiques.
- Export téléchargé et lu : JSON version 1, cinq habitudes, historique cohérent.
- Import de cet export, confirmation de remplacement et restauration vérifiée après rechargement.
- Import incompatible refusé sans remplacement des habitudes.
- Écran mobile 390 × 844 : aucun débordement horizontal de la page ; les calendriers défilent dans leur carte.

## Contrôles techniques et sécurité

ESLint, TypeScript, compilation de production et les sept tests de logique passent. Les tests couvrent les années bissextiles, changements de mois/année, validation des dates, séries actuelles et records, normalisation et rejet des imports incorrects. Audit npm : zéro vulnérabilité après mise à jour vers Next.js 16.3.8.

Aucun secret ni service tiers dans l’application. Les données importées sont bornées et validées. React affiche les saisies comme du texte. Dates futures désactivées ; confirmation avant suppression ou remplacement. Le stockage local peut être effacé par le navigateur : l’export permet de conserver une copie.

## Vérification visuelle

Concept : `docs/concept.png`, généré avec l’outil Imagegen intégré. Brief : interface complète de traqueur français Rituel, fond marine #10111b, cartes #1b1d2e, accent violet #8b72ff, cinq habitudes colorées, résumé, navigation, vues semaine/année et calendriers annuels. Textes et contrôles réalisés en code natif, sans image utilisée comme interface.

Rendus : `docs/desktop.png` et `docs/mobile.png`. Captures via Playwright Chromium, après deux échecs par délai dépassé du navigateur intégré. Bureau vérifié avec un viewport de 1536 × 1024 correspondant au concept ; captures complètes pour inclure le pied de page. Concept et rendus inspectés directement avec `view_image`.

Comparaison effectuée sur :

1. Structure : navigation, titre, action principale, résumé, commandes de période et grille de cinq cartes conservés.
2. Palette : fond marine, panneaux sombres, violet principal et cinq couleurs d’habitudes conservés.
3. Typographie : hiérarchie titre/intertitres/libellés vérifiée ; police système sans dépendance réseau.
4. Espacements : en-tête et cartes initialement trop hauts resserrés après comparaison.
5. Calendriers : sept lignes, année complète, colonnes hebdomadaires, dates futures atténuées et jour courant repéré.
6. Icônes et contrôles : livre, activité, eau, cible, cœur ; actions de validation et de modification accessibles.
7. Responsive : une colonne sur mobile, formulaire lisible, défilement interne du calendrier.

Les différences de contenu sont intentionnelles et fonctionnelles : historique vide au premier lancement au lieu des exemples colorés de la maquette ; états binaires « À faire / Fait » ; menu de sauvegarde remplaçant l’avatar ; actions de modification et séries ; mention de la sauvegarde locale. Les intentions des habitudes sont légèrement raccourcies pour leur lisibilité. Le titre, la navigation et l’action principale reprennent le concept. Aucun ajout marketing ni donnée fictive. La structure et la direction visuelle ont été vérifiées face à la maquette ; le rendu est une adaptation fonctionnelle, pas une reproduction pixel par pixel.

Contrôles complémentaires : écran 320 × 740 sans débordement ; formulaire mobile opaque et lisible après son animation ; déplacement au clavier entre dates, validation par Entrée et navigation vers l’année précédente vérifiés. Les données temporaires de test ont été supprimées/restaurées ; les cinq habitudes initiales sont présentes sans historique artificiel.


## Mise à jour : icônes personnalisables

Ajout de 14 pictogrammes et d’un emoji personnel, indépendants de la couleur. Clic direct sur l’icône pour ouvrir la modification. Compatibilité des sauvegardes antérieures : leur icône initiale et leur historique sont préservés. Trois nouveaux tests couvrent la compatibilité, l’aller-retour JSON avec des emojis composés et le rejet des valeurs incorrectes (10 tests au total). Le formulaire mis à jour a été inspecté dans le navigateur ; le test interactif complet de cette mise à jour n’a pas pu être exécuté, la vérification automatique d’autorisation ayant échoué sur une limite d’usage Codex.
