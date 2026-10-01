# Rituel

Un traqueur d’habitudes personnel inspiré de calendriers de contributions, en français, avec une interface sombre adaptée au mobile et à l’ordinateur.

## Démarrer

Node.js 24 LTS recommandé. Depuis ce dossier :

```sh
npm ci
npm run dev -- --hostname 127.0.0.1
```

Ouvrir http://127.0.0.1:3000. Toujours utiliser la même adresse et le même navigateur pour retrouver les données : le stockage est propre à chaque origine.

## Utilisation

- Cinq habitudes de départ, sans historique inventé.
- Bouton de validation quotidienne ; clic sur une case pour corriger une date passée.
- Vues année et semaine, navigation dans les périodes, séries et statistiques réelles.
- Ajout, modification, choix de couleur et suppression avec confirmation.
- Paramètres en haut à droite : export JSON et import avec validation et confirmation avant remplacement.
- Navigation clavier : Tab vers le calendrier, flèches pour parcourir les dates, Entrée pour valider.

Les données restent dans le localStorage de ce navigateur. Aucun compte, service tiers ou télémétrie applicative. Effacer le stockage du navigateur efface les données : exporter régulièrement. Pas de synchronisation entre appareils ni de garantie de conservation en navigation privée. L’interface est responsive ; un déploiement est nécessaire pour y accéder depuis un autre appareil.

## Architecture

Next.js App Router, React, TypeScript, Tailwind CSS, composants Shadcn/Radix, icônes Lucide. `src/lib/habits.ts` contient la logique de dates, les calculs et la validation. `src/components` sépare le tableau de bord, les cartes, le calendrier, le formulaire et les statistiques. La version locale a été choisie par l’utilisateur ; Supabase et l’authentification ne sont donc pas nécessaires ici. La logique de stockage pourra être remplacée par un dépôt Supabase avec RLS si une synchronisation est demandée.

## Vérifier

```sh
npm run lint
npx tsc --noEmit
node --test tests/habits.test.mjs
npm run build
npm audit
```

Les imports sont limités à 5 Mo et 100 habitudes ; textes, identifiants, couleurs et dates sont validés. Les dates futures sont refusées. Les saisies sont rendues comme texte par React. La suppression et le remplacement d’un historique nécessitent une confirmation. Aucun secret dans le code.

## Production

Le projet peut être importé dans Vercel avec le framework Next.js, sans variable d’environnement. Aucun déploiement distant n’a été effectué. Les données resteront propres au navigateur et à l’URL déployée : utiliser l’export/import pour transférer celles de l’aperçu local.

## Personnaliser une icône

Clique directement sur l’icône d’une carte (ou sur son menu de modification). Choisis l’un des 14 pictogrammes ou saisis un seul emoji dans « Ou ton propre emoji », puis enregistre. La couleur est indépendante. Les anciennes sauvegardes restent compatibles et les nouvelles icônes sont incluses dans les exports JSON.
