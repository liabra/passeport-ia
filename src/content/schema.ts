import { z } from "zod";

/**
 * Schémas zod = source de vérité du contenu.
 *
 * Ils servent à la fois au chargement dans l'app (validation à l'import) et au
 * script `npm run validate:content` (exécuté en CI). Le contenu est ainsi
 * découplé du code : un fichier JSON invalide fait échouer le build.
 */

export const FRAGILITE = ["faible", "moyenne", "haute"] as const;
export const fragiliteSchema = z.enum(FRAGILITE);

export const TYPES_ACTIVITE = ["perroquet", "intrus", "renard"] as const;

/* ------------------------------------------------------------------ */
/* Activité « perroquet »                                              */
/* ------------------------------------------------------------------ */

const perroquetOptionSchema = z.object({
  id: z.string().min(1),
  mot: z.string().min(1),
  pourcentage: z.number().int().min(0).max(100),
});

const perroquetMancheSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(["echauffement", "ambiguite", "piege", "invente"]),
  phrase: z.string().includes("___", {
    message: "La phrase doit contenir le trou « ___ »",
  }),
  options: z.array(perroquetOptionSchema).length(4),
  /** Texte affiché à la révélation de la répartition de la foule. */
  reveleTexte: z.string().min(1),
  /**
   * Uniquement pour la manche « piège » : la vérité qui contredit la foule,
   * révélée dans un second temps, avec des messages différenciés.
   */
  verite: z
    .object({
      /** Optionnelle : parfois la vérité contredit *toutes* les options. */
      optionVraieId: z.string().min(1).optional(),
      texte: z.string().min(1),
      messageSuiviFoule: z.string().min(1),
      messageContreFoule: z.string().min(1),
    })
    .optional(),
});

const perroquetVerificationSchema = z.object({
  question: z.string().min(1),
  choix: z
    .array(
      z.object({
        id: z.string().min(1),
        label: z.string().min(1),
        correct: z.boolean(),
        retour: z.string().min(1),
      }),
    )
    .length(2),
});

export const perroquetDonneesSchema = z
  .object({
    manches: z.array(perroquetMancheSchema).length(4),
    verification: perroquetVerificationSchema,
  })
  .superRefine((donnees, ctx) => {
    donnees.manches.forEach((manche, i) => {
      const total = manche.options.reduce((s, o) => s + o.pourcentage, 0);
      if (total !== 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Manche ${i + 1} (« ${manche.id} ») : les pourcentages font ${total} au lieu de 100`,
          path: ["manches", i, "options"],
        });
      }
      if (manche.kind === "piege" && !manche.verite) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Manche « ${manche.id} » de type piège : champ « verite » manquant`,
          path: ["manches", i, "verite"],
        });
      }
      if (manche.verite?.optionVraieId) {
        const ok = manche.options.some((o) => o.id === manche.verite!.optionVraieId);
        if (!ok) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Manche « ${manche.id} » : optionVraieId « ${manche.verite.optionVraieId} » inconnue`,
            path: ["manches", i, "verite", "optionVraieId"],
          });
        }
      }
    });
    const nbCorrect = donnees.verification.choix.filter((c) => c.correct).length;
    if (nbCorrect !== 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `La question de vérification doit avoir exactement 1 bonne réponse (trouvé ${nbCorrect})`,
        path: ["verification", "choix"],
      });
    }
  });

/* ------------------------------------------------------------------ */
/* Activité « intrus »                                                 */
/* ------------------------------------------------------------------ */

const encyclopedieSchema = z.object({
  article: z.string().min(1),
  extrait: z.string().min(1),
  /** Sous-chaîne de `extrait` à surligner (extrait pertinent). */
  surligne: z.string().min(1),
  sources: z.array(z.string().min(1)).min(1),
});

const intrusPartSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("texte"), texte: z.string().min(1) }),
  z.object({
    kind: z.literal("detail"),
    id: z.string().min(1),
    texte: z.string().min(1),
    invente: z.boolean(),
    encyclopedie: encyclopedieSchema,
  }),
]);

export const intrusDonneesSchema = z
  .object({
    reglage: z.string().min(1),
    reponse: z.object({
      parts: z.array(intrusPartSchema).min(1),
    }),
  })
  .superRefine((donnees, ctx) => {
    const details = donnees.reponse.parts.filter(
      (p): p is Extract<typeof p, { kind: "detail" }> => p.kind === "detail",
    );
    const inventes = details.filter((d) => d.invente);
    if (inventes.length !== 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Un scénario « intrus » doit contenir exactement 1 détail inventé (trouvé ${inventes.length})`,
        path: ["reponse", "parts"],
      });
    }
    details.forEach((d, i) => {
      if (!d.encyclopedie.extrait.includes(d.encyclopedie.surligne)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Détail « ${d.id} » : le passage surligné n'apparaît pas dans l'extrait`,
          path: ["reponse", "parts", i, "encyclopedie", "surligne"],
        });
      }
    });
  });

/* ------------------------------------------------------------------ */
/* Activité « renard » (manipulation directe : apprendre par l'exemple)*/
/* ------------------------------------------------------------------ */

export const renardCategorieSchema = z.enum(["mur", "pas_mur"]);

/** Attributs encodés en petits entiers : ils alimentent le classifieur jouet. */
const renardAttributsSchema = z.object({
  couleur: z.number().int().min(0),
  forme: z.number().int().min(0),
  texture: z.number().int().min(0),
});

const renardItemSchema = z.object({
  id: z.string().min(1),
  libelle: z.string().min(1),
  categorieVraie: renardCategorieSchema,
  attributs: renardAttributsSchema,
});

const renardVerificationSchema = z.object({
  question: z.string().min(1),
  choix: z
    .array(
      z.object({
        id: z.string().min(1),
        label: z.string().min(1),
        correct: z.boolean(),
        retour: z.string().min(1),
      }),
    )
    .length(2),
});

export const renardDonneesSchema = z
  .object({
    exemplesPhase1: z.array(renardItemSchema).length(2),
    exemplesPhase2: z.array(renardItemSchema).length(8),
    test: z.array(renardItemSchema).length(4),
    revelationPhase1: z.string().min(1),
    revelationPhase2: z.string().min(1),
    verification: renardVerificationSchema,
  })
  .superRefine((donnees, ctx) => {
    // Le test doit contenir les deux catégories (sinon aucune leçon).
    const cats = new Set(donnees.test.map((i) => i.categorieVraie));
    if (cats.size < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Le test doit contenir des fruits mûrs ET pas mûrs",
        path: ["test"],
      });
    }
    const nbCorrect = donnees.verification.choix.filter((c) => c.correct).length;
    if (nbCorrect !== 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `La question de vérification doit avoir exactement 1 bonne réponse (trouvé ${nbCorrect})`,
        path: ["verification", "choix"],
      });
    }
    // La garantie « phase 1 échoue / phase 2 réussit » est vérifiée par un test
    // unitaire dédié (contenu et classifieur sont co-conçus).
  });

/* ------------------------------------------------------------------ */
/* Activité (union discriminée par `type`)                             */
/* ------------------------------------------------------------------ */

const baseActiviteSchema = z.object({
  id: z.string().min(1),
  notion: z.string().min(1),
  phraseCristallisation: z.string().min(1),
  dureeMin: z.number().int().min(1).max(10),
  fragilite: fragiliteSchema,
});

export const activiteSchema = z.discriminatedUnion("type", [
  baseActiviteSchema.extend({
    type: z.literal("perroquet"),
    donnees: perroquetDonneesSchema,
  }),
  baseActiviteSchema.extend({
    type: z.literal("intrus"),
    donnees: intrusDonneesSchema,
  }),
  baseActiviteSchema.extend({
    type: z.literal("renard"),
    donnees: renardDonneesSchema,
  }),
]);

/* ------------------------------------------------------------------ */
/* Parcours (territoires et étapes)                                    */
/* ------------------------------------------------------------------ */

export const etapeSchema = z.object({
  id: z.string().min(1),
  ordre: z.number().int().min(1),
  titre: z.string().min(1),
  /**
   * Type de l'étape : un type d'activité existant, ou « aVenir » pour une étape
   * du parcours canonique dont l'activité n'est pas encore développée (écran
   * placeholder). Le chemin reste bloquant : on ne saute pas d'étape.
   */
  activiteType: z.enum([...TYPES_ACTIVITE, "aVenir"]),
  /** Id de l'activité rendue à cette étape ; absent pour les étapes « aVenir ». */
  activiteId: z.string().min(1).optional(),
  /** Court « pont vers le réel » optionnel, présenté après la récompense. */
  pontVersLeReel: z
    .object({
      libelle: z.string().min(1),
      url: z.string().url(),
    })
    .optional(),
})
  .superRefine((etape, ctx) => {
    if (etape.activiteType === "aVenir") {
      if (etape.activiteId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Étape « ${etape.id} » de type aVenir : elle ne doit pas porter d'activiteId`,
          path: ["activiteId"],
        });
      }
    } else if (!etape.activiteId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Étape « ${etape.id} » de type « ${etape.activiteType} » : activiteId manquant`,
        path: ["activiteId"],
      });
    }
  });

export const territoireSchema = z.object({
  id: z.string().min(1),
  nom: z.string().min(1),
  couleur: z.enum(["rouge-gr", "foret", "eau", "ocre", "encre-douce"]),
  sousTitre: z.string().min(1),
  etapes: z.array(etapeSchema).min(1),
});

export const parcoursSchema = z
  .object({
    titre: z.string().min(1),
    territoires: z.array(territoireSchema).min(1),
  })
  .superRefine((parcours, ctx) => {
    const ordres: number[] = [];
    const ids = new Set<string>();
    parcours.territoires.forEach((t) => {
      t.etapes.forEach((e) => {
        ordres.push(e.ordre);
        if (ids.has(e.id)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Étape « ${e.id} » en double`,
          });
        }
        ids.add(e.id);
      });
    });
    const tries = [...ordres].sort((a, b) => a - b);
    tries.forEach((o, i) => {
      if (o !== i + 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Les « ordre » des étapes doivent être 1..N sans trou ni doublon (attendu ${i + 1}, trouvé ${o})`,
        });
      }
    });
  });

/* ------------------------------------------------------------------ */
/* Sentier de découverte (projection jouable du parcours canonique)    */
/* ------------------------------------------------------------------ */

/**
 * Sous-ensemble jouable, à plat (pas de territoires). Chaque entrée référence
 * une étape du parcours canonique **par son id** — aucun contenu n'est dupliqué.
 * La cohérence (id existant, activité réelle, jamais « aVenir ») est vérifiée
 * dans le loader, `validate:content` et les tests, car elle dépend du parcours.
 */
export const sentierSchema = z.object({
  titre: z.string().min(1),
  sousTitre: z.string().min(1),
  etapes: z.array(z.string().min(1)).min(1),
});

export type Fragilite = z.infer<typeof fragiliteSchema>;
export type Activite = z.infer<typeof activiteSchema>;
export type ActivitePerroquet = Extract<Activite, { type: "perroquet" }>;
export type ActiviteIntrus = Extract<Activite, { type: "intrus" }>;
export type ActiviteRenard = Extract<Activite, { type: "renard" }>;
export type RenardCategorie = z.infer<typeof renardCategorieSchema>;
export type RenardItem = z.infer<typeof renardItemSchema>;
export type RenardAttributs = RenardItem["attributs"];
export type Etape = z.infer<typeof etapeSchema>;
export type Territoire = z.infer<typeof territoireSchema>;
export type Parcours = z.infer<typeof parcoursSchema>;
export type Sentier = z.infer<typeof sentierSchema>;
