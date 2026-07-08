# Décisions d'architecture — Passeport IA

Registre des décisions structurantes de la v1. Format léger : contexte → décision
→ conséquences.

---

## 1. Zéro compte, zéro donnée (v1)

**Contexte.** Public grand public et éloigné du numérique, souvent méfiant vis-à-vis
de la collecte de données ; usage en bibliothèque sur postes partagés.

**Décision.** Aucune base de données, aucun compte, aucun cookie, aucun tracker,
aucune analytics. La progression vit dans le **localStorage** du navigateur.

**Conséquences.**
- Meilleure protection possible : la donnée non collectée ne fuit pas.
- Progression liée à l'appareil/navigateur (pas de reprise ailleurs) — assumé en v1.
- Le stockage passe par l'abstraction asynchrone `ProgressStore`
  (`src/lib/progress-store.ts`) : brancher une sync serveur plus tard ne touchera
  pas les écrans, qui n'attaquent jamais `localStorage` directement.

---

## 2. Contenu découplé, en JSON, validé par zod

**Contexte.** Le contenu (parcours, activités) doit pouvoir évoluer sans toucher au
code, et être relu/complété par des non-développeurs (médiateurs, éditeurs).

**Décision.** Le contenu est un ensemble de fichiers JSON dans `/content`, décrit
et validé par des schémas **zod** (`src/content/schema.ts`). La validation tourne
**à l'import dans l'app** (fail-fast au build) **et** via `npm run validate:content`
en CI.

**Conséquences.**
- Un JSON invalide fait échouer le build, jamais l'exécution côté utilisateur.
- Les invariants métier sont encodés dans les schémas : pourcentages du perroquet
  = 100, exactement un détail inventé côté intrus, passage surligné présent dans
  l'extrait, `ordre` des étapes contigu, cohérence parcours ↔ type d'activité.
- Chaque type d'activité = un schéma + un composant React piloté par le JSON.

**Règle d'intégrité.** On ne présente jamais une donnée fabriquée comme réelle
(mention « répartitions illustratives — corpus réel documenté à venir »).

---

## 3. Positions de la carte générées, pas codées à la main

**Contexte.** La carte est un chemin serpentin unique dont la longueur dépend du
nombre d'étapes ; coder les coordonnées à la main serait fragile.

**Décision.** Un algorithme simple de **zigzag vertical** (`src/lib/chemin.ts`)
calcule les points à partir du nombre d'étapes ; les marqueurs HTML sont
positionnés en pourcentage sur un SVG dont le `viewBox` fixe le ratio.

**Conséquences.**
- Ajouter/retirer une étape re-génère tout le tracé automatiquement.
- Fonction pure, testée unitairement (croissance verticale, alternance des couloirs).

---

## 4. PWA hors-ligne avec service worker maison

**Contexte.** Postes de bibliothèque, connexions faibles ou intermittentes.
L'app et le contenu jouable doivent fonctionner sans réseau après la 1re visite.

**Décision.** Manifest + **service worker écrit à la main** (`public/sw.js`), sans
dépendance de PWA lourde. App shell précaché à l'install ; navigations en
réseau-d'abord/repli-cache ; autres ressources same-origin en
*stale-while-revalidate*.

**Conséquences.**
- Zéro dépendance supplémentaire, comportement lisible et auditable.
- Le contenu étant statique et bundlé, la navigation entre étapes fonctionne
  hors-ligne une fois les chunks mis en cache.

---

## 5. Pile technique et périmètre

**Décision.** Next.js (App Router) + TypeScript strict + Tailwind (tokens du design
system « carte de randonnée »). État applicatif : React + Context uniquement.
Tests : vitest. Déploiement : Railway via build standalone (Dockerfile).

**Écarté volontairement.** Base de données, auth, analytics, librairie de
gamification ou de state management, appel à une API d'IA, vocabulaire « gamer »
(XP, niveau, streak), emojis dans l'interface.

---

## 6. CSP à base de nonce

**Contexte.** Exigence d'une CSP stricte (uniquement `self` + Google Fonts) sans
casser les scripts internes de Next.

**Décision.** CSP générée par requête dans `src/proxy.ts` (convention *proxy* de
Next 16, ex-*middleware*) avec un *nonce*
(`script-src 'self' 'nonce-…' 'strict-dynamic'`). Les autres en-têtes (HSTS,
nosniff, Referrer-Policy, Permissions-Policy) sont statiques dans `next.config.mjs`.
`style-src` conserve `'unsafe-inline'` (styles injectés par Tailwind/Next, sans
mécanisme de nonce pour les attributs `style`).
