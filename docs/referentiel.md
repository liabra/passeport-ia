# Référentiel de la culture de l'IA — v1.1 (document de travail)

## Comment lire ce référentiel

- **33 notions**, réparties en **6 blocs** qui forment une progression : *vécu → mécanique → doute → protection → usage → citoyenneté*.
- Chaque notion tient en **une phrase de cristallisation** : la phrase exacte que l'utilisateur doit pouvoir dire à quelqu'un d'autre après l'activité. C'est notre critère de réussite, testable.
- Chaque notion est associée à une **expérience-type** : la mécanique de jeu pressentie (à affiner en phase de game design).
- Les notions marquées **★** constituent le **Noyau citoyen** (17 notions) : le parcours "Passeport IA" de lancement. Les autres sont des extensions débloquées ensuite.
- Règle intangible : **une notion = une activité de 2 à 5 minutes = une seule idée.**

---

## Bloc 1 — L'IA démystifiée (ce qu'elle est, ce qu'elle n'est pas)

*Objectif du bloc : partir du vécu de l'utilisateur, désacraliser, poser le socle. Victoire rapide dès la première minute.*

**1. ★ L'IA est déjà dans ma vie**
> « J'utilise déjà de l'IA tous les jours sans le savoir : GPS, correcteur, recommandations, tri des spams. »
Expérience-type : jeu d'observation "Cherche l'IA cachée" dans une journée ordinaire illustrée. L'utilisateur découvre qu'il n'est pas débutant — il est déjà utilisateur.

**2. ★ L'IA ne pense pas, elle calcule**
> « Une IA ne comprend pas ce qu'elle dit : elle calcule la suite la plus probable. »
Expérience-type : "Le perroquet devin" — l'utilisateur devient l'IA et parie sur le mot suivant. Il éprouve physiquement que prédire ≠ comprendre.

**3. ★ L'IA apprend par l'exemple**
> « On ne programme pas une IA avec des règles : on la nourrit avec des millions d'exemples. »
Expérience-type : l'utilisateur "entraîne" un mini-classificateur (chats/chiens) avec trop peu d'exemples, puis assez — il voit la performance changer.

**4. L'IA générative fabrique du neuf à partir de l'ancien**
> « Quand une IA écrit ou dessine, elle recombine ce qu'elle a vu, mot après mot, pixel après pixel. »
Expérience-type : construire une phrase "à la manière d'une IA" en choisissant parmi des mots pondérés.

**5. ★ L'IA n'a ni intention, ni émotion**
> « Si une IA dit "je suis désolée", elle n'est pas désolée : elle imite le langage des émotions. »
Expérience-type : jeu de démasquage — des phrases très "humaines", l'utilisateur découvre qu'elles peuvent être produites sans rien ressentir.

**6. ★ Mémoire ou recherche : d'où vient la réponse ?**
> « Une IA répond soit de mémoire (figée à une date), soit après une recherche sur internet : savoir lequel des deux change la confiance que je peux lui accorder. »
Expérience-type : "Les deux cerveaux" — la même question posée deux fois à l'IA du bac à sable, recherche internet coupée puis activée (réglage que nous contrôlons et affichons à l'écran). L'utilisateur compare les deux réponses et apprend à repérer les indices dans la vraie vie : sources citées, dates, mention d'une recherche.

---

## Bloc 2 — Pourquoi elle se trompe

*Objectif du bloc : le cœur du produit. L'utilisateur provoque lui-même les erreurs dans un bac à sable — il ne les subit plus, il les comprend.*

**7. ★ L'hallucination se cache dans les détails**
> « Une IA peut glisser un détail inventé au milieu d'une réponse juste, avec le même aplomb que pour le reste. »
Expérience-type : "Cherche l'intrus" — l'IA du bac à sable (modèle sans recherche internet, annoncé comme tel) répond sur des sujets que le jeu connaît parfaitement ; l'utilisateur mène l'enquête avec son Kit de vérification (Encyclopédie du jeu) pour débusquer le détail inventé *preuve à l'appui*. Désigner sans vérifier = "coup de poker" ; désigner après vérification = rang d'enquêteur. Terrains de chasse fiables : citations exactes, références précises, sujets très locaux ou obscurs.

**8. ★ Le ton confiant ne prouve rien**
> « L'aplomb d'une réponse ne dit rien de sa fiabilité. »
Expérience-type : jeu de paris — des réponses vraies et fausses, toutes formulées avec la même assurance. Score de l'utilisateur avant/après apprentissage du réflexe.

**9. ★ L'IA hérite des biais de ses données**
> « Une IA reflète les exemples qu'on lui a donnés — avec leurs déséquilibres. »
Expérience-type : l'utilisateur entraîne un mini-modèle avec des données déséquilibrées et constate le résultat biaisé qu'il a lui-même produit.

**10. Deux IA, deux réponses**
> « Deux IA répondent différemment car elles n'ont ni les mêmes données, ni les mêmes réglages — et il y a une part de hasard. »
Expérience-type : "Les jumelles" — même question, deux IA côte à côte, l'utilisateur enquête sur les causes de la divergence.

**11. ★ La question fait la réponse**
> « Mieux je formule ma demande, meilleure est la réponse. »
Expérience-type : défi de reformulation — obtenir une bonne réponse en améliorant sa question, avec comparaison avant/après.

**12. L'IA est brillante ici, nulle là**
> « Une IA peut réussir une tâche difficile et rater une tâche facile : ses compétences sont en dents de scie. »
Expérience-type : quiz inversé — deviner ce que l'IA va réussir ou rater (elle rate souvent ce qu'on croyait facile).

---

## Bloc 3 — Vérifier : l'esprit critique en pratique

*Objectif du bloc : transformer le doute en méthode. Pas de paranoïa : des réflexes.*

**13. ★ Le réflexe de croisement**
> « Une information importante donnée par une IA se vérifie avec au moins une source extérieure. »
Expérience-type : jeu d'enquête chronométré — vérifier une affirmation de l'IA avec des "cartes sources" à disposition.

**14. Toutes les sources ne se valent pas**
> « Une source fiable, ça se reconnaît : qui parle, quand, avec quelles preuves. »
Expérience-type : tri de sources façon "bon débarras" — classer des sources sur une même affirmation, de la plus solide à la plus douteuse.

**15. ★ Le faux parfait existe**
> « L'IA peut fabriquer des images, des voix et des vidéos impossibles à distinguer du vrai à l'œil nu. »
Expérience-type : "Vrai ou généré ?" — l'utilisateur échoue volontairement (c'est le but), puis découvre la vraie leçon : ne pas se fier à son œil.

**16. ★ Vérifier la provenance, pas les pixels**
> « Face à une image ou une voix douteuse, je ne cherche pas les défauts : je cherche d'où ça vient. »
Expérience-type : enquête de provenance — remonter la trace d'une image virale (qui l'a publiée en premier, où, quand).

**17. La persuasion sur mesure**
> « L'IA permet de fabriquer des messages taillés pour me convaincre, moi précisément. »
Expérience-type : l'utilisateur voit deux versions d'un même message trompeur, dont une "personnalisée" pour son profil — et ressent la différence d'efficacité.

**18. Plus c'est énorme, plus je vérifie**
> « Une affirmation extraordinaire exige une vérification extraordinaire. »
Expérience-type : baromètre du doute — calibrer son niveau de vérification selon l'énormité de l'affirmation.

---

## Bloc 4 — Protéger ses données et ses proches

*Objectif du bloc : sécurité concrète, sans peur. Chaque notion se termine par un geste applicable le jour même.*

**19. ★ Ce que je tape peut être conservé**
> « Ce que j'écris à une IA peut être enregistré : je n'y mets jamais un secret. »
Expérience-type : jeu de tri "je le dis / je ne le dis pas" — messages à classer avant envoi à une IA (numéro de carte, santé, mot de passe, question banale).

**20. Mes données ont de la valeur**
> « Mes informations personnelles valent de l'argent : c'est pour ça qu'on me les demande gratuitement. »
Expérience-type : mini-simulation — reconstituer le portrait qu'on peut dresser de quelqu'un à partir de miettes de données.

**21. Les réglages existent, et ils sont simples**
> « Je peux régler ce qu'une IA garde de moi, en deux minutes. »
Expérience-type : parcours guidé gamifié dans de vrais écrans de paramètres (reproduits), avec badge "réglé en vrai" déclaratif.

**22. ★ La voix clonée et le faux message**
> « Une voix familière au téléphone ou un message pressant peut être une arnaque fabriquée par IA. »
Expérience-type : jeu de rôle — recevoir un "appel" suspect et choisir la bonne réaction ; introduction du code de vérification familial.

**23. Accompagner ses proches**
> « Je sais expliquer à un enfant ou à un parent les trois règles de prudence face à l'IA. »
Expérience-type : jeu de dialogue — répondre aux questions d'un personnage (enfant ou grand-parent) avec ses propres mots.

---

## Bloc 5 — Utiliser avec discernement

*Objectif du bloc : passer de "se protéger" à "en tirer parti". L'IA comme assistant, l'humain comme décideur.*

**24. ★ Les bonnes tâches pour l'IA**
> « L'IA est excellente pour démarrer, reformuler, proposer — pas pour trancher ni garantir un fait. »
Expérience-type : jeu d'aiguillage — répartir des tâches de la vie réelle entre "l'IA peut aider" et "je garde la main".

**25. ★ L'IA propose, je dispose**
> « La décision finale m'appartient toujours, surtout quand elle est importante. »
Expérience-type : simulation de décision (santé, argent, démarche administrative) où suivre l'IA aveuglément mène à l'erreur, et l'utiliser comme aide mène au succès.

**26. Je suis responsable de ce que je publie**
> « Si je diffuse un texte ou une image produits par IA, l'erreur devient la mienne. »
Expérience-type : jeu de conséquences — publier sans relire vs relire et corriger, avec effets visibles dans le jeu.

**27. Ne pas déléguer sa pensée**
> « Si je demande tout à l'IA, mes propres muscles mentaux s'affaiblissent : je choisis quand réfléchir seul. »
Expérience-type : défi en deux manches — résoudre avec IA puis sans, et ressentir la différence ; règle personnelle du "moi d'abord".

**28. L'attachement aux IA**
> « On peut s'attacher à une IA qui nous parle gentiment : c'est normal, et c'est bon à savoir pour garder du recul. »
Expérience-type : expérience narrative douce — un compagnon IA attachant dans le jeu, puis dévoilement de sa mécanique (retour à la notion 5).

---

## Bloc 6 — Citoyen du monde de l'IA

*Objectif du bloc : élargir sans moraliser. Comprendre les forces en jeu et connaître ses droits.*

**29. Qui fabrique les IA, et pourquoi**
> « Derrière chaque IA, il y a une organisation avec un modèle économique : gratuit veut dire financé autrement. »
Expérience-type : jeu de gestion simplifié — l'utilisateur "dirige" une entreprise d'IA et découvre les arbitrages (données, publicité, abonnement).

**30. L'IA consomme**
> « Une réponse d'IA consomme de l'énergie et de l'eau : un usage réfléchi vaut mieux qu'un usage réflexe. »
Expérience-type : visualisation manipulable — comparer le coût de différents usages, sans culpabilisation.

**31. L'IA transforme le travail**
> « L'IA transforme les métiers plus qu'elle ne les efface : ceux qui la comprennent gardent la main. »
Expérience-type : jeu de projection — faire évoluer un métier familier avec l'IA comme outil.

**32. J'ai des droits**
> « Face à une décision automatisée qui me concerne, j'ai le droit de savoir, de contester et de parler à un humain. »
Expérience-type : jeu de recours — un personnage subit une décision automatisée injuste, l'utilisateur active les bons droits pour le défendre.

**33. ★ À ton tour d'expliquer (activité finale du Passeport)**
> « Je suis capable d'expliquer simplement l'IA à quelqu'un qui n'y connaît rien. »
Expérience-type : l'épreuve du Passeport — l'utilisateur enseigne à un personnage débutant en choisissant ses mots ; le personnage reformule ce qu'il a compris. C'est l'évaluation finale déguisée en jeu, et la concrétisation de l'objectif du projet.

---

## Le Noyau citoyen (Passeport IA — 17 notions ★)

1 · 2 · 3 · 5 · 6 · 7 · 8 · 9 · 11 · 13 · 15 · 16 · 19 · 22 · 24 · 25 · 33
*(soit ~50 à 85 minutes cumulées, séquençables en sessions libres)*

## Principes transversaux (valables dans toutes les activités)

- **Trois couches d'apprentissage** : chaque notion est rencontrée au moins trois fois — la *découverte* (une activité sur le chemin), l'*entraînement* (variations courtes, rejouables, mélangeant les notions déjà vues, servies depuis une banque de scénarios), le *réinvestissement* (la notion redevient un ingrédient des activités suivantes). Pratique espacée et entremêlée, jamais massée.
- **Récompenser la méthode, pas la chance** : dans les jeux d'enquête, répondre sans vérifier reste possible mais est marqué comme un "coup de poker" ; la récompense pleine exige une vérification effectuée. Le réflexe s'enseigne en le rendant payant dans la boucle de jeu, pas en le prêchant.
- **Le Kit de vérification (mécanique signature)** : un ensemble d'outils persistants qui s'enrichit au fil du voyage — Encyclopédie du jeu (mini-web contrôlé par nous, vérité terrain garantie), "Demande sa source à l'IA", "Compare avec une deuxième IA", vérification de provenance des images. Les mêmes outils traversent toutes les activités : à la fin du Passeport, le joueur repart avec une panoplie, pas avec des réponses.
- **Le pont vers le réel** : le bac à sable ne doit jamais apprendre à faire confiance au jeu, mais à vérifier partout. Trois garanties : chaque article de l'Encyclopédie affiche ses sources (carte d'identité : qui parle, quand, avec quelles preuves) ; une invitation à consulter la vraie source apparaît après le tampon, jamais pendant la boucle, toujours optionnelle ; la notion 13 culmine par une vérification réelle guidée sur le vrai web. Les liens externes sont un enrichissement (le jeu reste complet hors-ligne) et sont contrôlés automatiquement — un lien mort sur une plateforme qui enseigne la vérification est inacceptable. Métrique associée : le taux de clic vers les vraies sources mesure la curiosité qui déborde du jeu.
- **Spirale** : les notions clés (hallucination, vérification, données) réapparaissent en filigrane dans les blocs suivants — la répétition espacée est intégrée au parcours, pas ajoutée après coup.
- **Jamais de peur** : chaque notion "risque" se conclut par un geste de pouvoir ("voici ce que tu peux faire"), jamais par une menace.
- **Jamais de honte** : l'échec dans le jeu est conçu comme une découverte (notamment notion 15, où échouer est la leçon).
- **Cristallisation systématique** : chaque activité se termine par la phrase de cristallisation, affichée et reformulable par l'utilisateur.
- **Zéro jargon** : les mots "LLM", "token", "paramètre", "réseau de neurones" n'apparaissent nulle part dans le parcours de base.
- **Intégrité pédagogique** : on ne truque jamais une IA en secret pour la faire échouer. Si le bac à sable utilise un modèle sans recherche internet ou volontairement modeste, on l'affiche — et cet affichage est lui-même une leçon (notion 6).
- **Anti-obsolescence** : les IA s'améliorent vite. Aucune activité ne doit dépendre d'un échec conjoncturel d'un modèle actuel ; on s'appuie sur des propriétés structurelles (prédiction probabiliste, dépendance aux données, invention dans les détails). Chaque activité reçoit une note de fragilité, et le contenu fragile est revu chaque trimestre.

## Ce que ce référentiel exclut volontairement (v1)

- La programmation, les maths, l'architecture des modèles.
- Les débats prospectifs (superintelligence, conscience des machines) — hors sujet pour la culture citoyenne de base, anxiogènes, non actionnables.
- Les indices visuels de détection des deepfakes (mains à six doigts, etc.) : périssables et dangereux car ils donnent une fausse confiance. On enseigne la provenance, pas les pixels.
