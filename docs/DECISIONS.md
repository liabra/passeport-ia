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

---

## 7. Le référentiel pédagogique est la source de vérité (règle permanente)

**Contexte.** Lors du premier jet, le contenu du parcours (noms de territoires,
titres d'étapes, ordre, phrases de cristallisation) avait été **inventé** au lieu
de suivre `docs/referentiel.md`. Réaligné dans un second temps.

**Règle intangible.** *Aucun contenu pédagogique — nom de territoire, titre
d'étape, phrase de cristallisation, texte de révélation — ne doit être créé ou
reformulé sans instruction explicite. En cas de manque, poser la question plutôt
qu'inventer.* `docs/referentiel.md` fait foi.

**Conséquences.**
- `content/parcours.json` reprend exactement les 6 territoires / 17 étapes du
  Noyau citoyen dans l'ordre canonique.
- Les phrases de cristallisation des activités sont copiées mot pour mot depuis le
  référentiel (notions 2, 3 et 7).
- **Journal des évolutions du référentiel** : notion 3 reformulée — la
  variété/qualité des exemples prime sur la quantité, cohérent avec l'activité du
  renard ; validé par la cofondatrice.
- Les étapes non encore développées portent `"activiteType": "aVenir"` (sans
  `activiteId`) : le schéma zod l'exige, et elles affichent l'écran « en cours de
  fabrication ». Le chemin reste bloquant.
- **Note produit** : le CNIL (`https://www.cnil.fr/fr/intelligence-artificielle-ia`)
  a été retiré du parcours ; il est destiné au futur écran « À propos », pas à un
  « pont vers le réel » d'étape.
- **Conséquence** : dans l'ordre canonique, l'étape 1 est « aVenir »
  (placeholder). Le chemin étant bloquant, les deux activités développées ne
  seraient pas atteignables par progression linéaire. Résolu par la §8 (Sentier
  de découverte), sans affaiblir le blocage.

---

## 8. Deux parcours, une source de vérité (Sentier de découverte)

**Contexte.** Le référentiel et l'ordre canonique sont intangibles, mais l'ordre
canonique place une étape « aVenir » en tête : avec un chemin strictement
bloquant, rien de jouable n'était atteignable. On refuse d'affaiblir le blocage
ou de rendre les placeholders traversables.

**Décision.** Introduire une **séparation** entre l'ordre pédagogique de référence
et ce qui est jouable aujourd'hui.
- `content/parcours.json` reste la source de vérité complète (inchangée).
- `content/sentier-decouverte.json` décrit un sous-ensemble séquentiel, à plat,
  qui **référence des étapes canoniques par `id`** (zéro duplication de contenu :
  mêmes activités, mêmes ponts-vers-le-réel).
- `NEXT_PUBLIC_PARCOURS_ACTIF` bascule l'affichage : `sentier` (défaut, jouable
  de bout en bout) ou `complet` (voyage canonique intégral). Simple bascule, aucun
  secret.
- `src/content/getParcoursActif()` est l'unique point d'entrée ; carte, liste et
  passeport le consomment. Le blocage linéaire strict est identique dans les deux
  modes ; seule la liste des étapes change.

**Le référentiel et l'ordre canonique restent intangibles ; le Sentier de
découverte est une projection jouable qui grandit à mesure que les activités sont
produites, jusqu'à fusion avec le parcours complet au lancement.**
