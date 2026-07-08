# Passeport IA

Un voyage à travers **six territoires** pour comprendre l'intelligence artificielle,
une notion à la fois. On avance sur un chemin unique inspiré des sentiers de grande
randonnée : une étape, une activité de 2 à 5 minutes, un tampon dans son passeport.
Pensé pour le grand public — seniors, personnes éloignées du numérique, familles,
médiateurs en bibliothèque. **Aucun compte, aucune donnée collectée, fonctionne hors-ligne.**

---

## Démarrage

```bash
npm install
npm run dev        # http://localhost:3000
```

Autres commandes :

```bash
npm run build            # build de production (standalone)
npm start                # sert le build
npm run lint             # ESLint
npm run typecheck        # TypeScript strict, sans émission
npm run validate:content # valide tout /content avec zod
npm test                 # tests vitest (logique + contenu)
npm run check:links      # vérifie que les URL externes de /content répondent en 200
```

Prérequis : Node ≥ 18.18.

---

## Structure des dossiers

```
content/                 Contenu éditorial (découplé du code, validé par zod)
  parcours.json          Territoires et étapes (le « Noyau citoyen » : 17 étapes)
  activites/*.json       Une activité par fichier
scripts/
  validate-content.ts    Validation du contenu (CI + local)
  check-links.mjs        Vérification des liens externes (job hebdo)
public/
  manifest.webmanifest   Manifest PWA
  sw.js                  Service worker (hors-ligne)
  icone.svg              Icône de l'app
src/
  app/                   Routes (App Router)
    page.tsx             Carte (/)
    liste/               Vue liste (alternative accessible à la carte)
    passeport/           Grille des tampons
    etape/[id]/          Rendu de l'activité d'une étape + écran tampon
  components/
    ui/                  Design system : BigButton, Blaze, Stamp, CrystalCard, Toast…
    map/                 Carte SVG (chemin serpentin généré)
    activities/          PerroquetActivity, IntrusActivity, placeholder, tampon
  content/               Schémas zod + chargement/validation du contenu
  lib/                   ProgressStore, contexte, génération du chemin, progression
  proxy.ts               CSP nonce-based (voir « Sécurité »)
Dockerfile, railway.json Déploiement Railway (build standalone)
```

---

## Ajouter une activité (guide pas à pas)

Deux **types** d'activité existent : `perroquet` (prédiction du mot suivant) et
`intrus` (enquête de vérification des faits). Pour ajouter une nouvelle activité
d'un type existant :

1. **Créer le JSON** dans `content/activites/`, par ex. `perroquet-biais.json`.
   Sa forme est décrite par les schémas de [`src/content/schema.ts`](src/content/schema.ts) :
   ```json
   {
     "id": "perroquet-biais",
     "type": "perroquet",
     "notion": "…",
     "phraseCristallisation": "…",
     "dureeMin": 4,
     "fragilite": "moyenne",
     "donnees": { "manches": [ … ], "verification": { … } }
   }
   ```
2. **Enregistrer** le fichier dans [`src/content/registry.ts`](src/content/registry.ts)
   (un `import` + une entrée dans le tableau).
3. **Rattacher** l'activité à une étape dans
   [`content/parcours.json`](content/parcours.json) via `activiteId` + `activiteType`.
4. **Valider** : `npm run validate:content`. Le script vérifie la forme, les
   pourcentages (perroquet), l'unique détail inventé (intrus), la cohérence
   parcours ↔ activité, etc.

> Une étape dont l'`activiteId` n'existe pas encore affiche automatiquement
> l'écran « Cette étape est en cours de fabrication ». Le chemin reste bloquant :
> on ne saute pas d'étape.

Créer un **nouveau type** d'activité demande, en plus : un schéma zod dans
`schema.ts`, un composant React piloté par le JSON dans `components/activities/`,
et son branchement dans `app/etape/[id]/page.tsx`.

### Règle d'intégrité du contenu

On ne présente **jamais** une donnée fabriquée comme réelle. Les répartitions du
perroquet sont affichées comme « illustratives — corpus réel documenté à venir ».

---

## Sécurité & vie privée

**Choix « zéro-donnée » (v1, volontaire).** Le public visé est éloigné du
numérique et souvent méfiant : la meilleure protection des données est de ne pas
en collecter. Concrètement :

- **Pas de base de données, pas de compte, pas de cookie, pas de tracker, pas d'analytics.**
- La progression est stockée dans le **localStorage** du navigateur, derrière une
  abstraction asynchrone [`ProgressStore`](src/lib/progress-store.ts) — on pourra
  brancher une synchronisation serveur plus tard sans réécrire les écrans.
- **Aucun appel à une API d'IA** : le contenu est statique et archivé.
- **Aucun secret** dans le code ; `.env.example` est vide et commenté.

**En-têtes HTTP** (voir [`next.config.mjs`](next.config.mjs) et [`src/proxy.ts`](src/proxy.ts)) :
`Content-Security-Policy` stricte à base de *nonce* (autorise uniquement `self` +
Google Fonts), `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` minimal.

**CI** : `npm audit` (niveau high) à chaque push/PR ; vérification hebdomadaire des
liens externes.

---

## Accessibilité (cible RGAA / WCAG AA)

- Toute interaction est un vrai `<button>` (ou un `<a>` pour la navigation) ;
  navigation clavier complète, **focus visible épais**, cibles ≥ 44px, bouton
  principal ≥ 56px.
- `prefers-reduced-motion` respecté partout (animations coupées globalement).
- Contrastes AA ; **jamais d'information portée par la seule couleur** (statuts
  doublés d'un texte et d'une coche vectorielle).
- **Vue liste** alternative à la carte (même contenu, HTML sémantique), accessible
  en un clic depuis l'en-tête.
- Police de corps **Atkinson Hyperlegible** (conçue pour les malvoyants), base
  ≥ 17px, français simple (niveau A2/B1), aucun jargon technique dans l'interface.

---

## Hors-ligne (PWA)

Après la première visite, l'app et tout le contenu jouable fonctionnent sans
réseau (contrainte : PC de bibliothèques, connexions faibles). L'app shell est
précaché à l'installation du service worker ; les ressources sont ensuite servies
en *stale-while-revalidate*. Voir [`public/sw.js`](public/sw.js).

---

## Déploiement (Railway)

Le [`Dockerfile`](Dockerfile) construit l'image à partir de la sortie
**standalone** de Next. [`railway.json`](railway.json) pointe dessus. Railway
fournit `PORT` automatiquement ; aucune variable d'environnement n'est requise.
