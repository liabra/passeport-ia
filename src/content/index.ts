import parcoursRaw from "../../content/parcours.json";
import sentierRaw from "../../content/sentier-decouverte.json";
import { activitesRaw } from "./registry";
import {
  activiteSchema,
  parcoursSchema,
  sentierSchema,
  type Activite,
  type Etape,
  type Parcours,
  type Sentier,
  type Territoire,
} from "./schema";

/**
 * Point d'accès unique au contenu. Tout est validé par zod à l'import (build
 * fail-fast). Deux parcours coexistent :
 *  - `parcours.json` = source de vérité canonique (6 territoires, 17 étapes),
 *    intangible, avec ses étapes « aVenir » non encore développées ;
 *  - `sentier-decouverte.json` = projection jouable, à plat, qui ne référence
 *    (par id) que des étapes canoniques déjà dotées d'une activité.
 *
 * `NEXT_PUBLIC_PARCOURS_ACTIF` choisit lequel l'app affiche (`sentier` par
 * défaut, `complet` pour le voyage intégral). Le blocage linéaire strict est
 * identique dans les deux modes ; seule la liste des étapes change.
 */

export type ModeParcours = "sentier" | "complet";

export interface ParcoursActif {
  mode: ModeParcours;
  titre: string;
  sousTitre?: string;
  territoires: Territoire[];
  /** Étapes à plat, dans l'ordre de progression (ordre = 1..N contigu). */
  etapes: Etape[];
}

/* --------------------------- activités ------------------------------- */

const activitesById = new Map<string, Activite>();
for (const brut of activitesRaw) {
  const parsed = activiteSchema.safeParse(brut);
  if (!parsed.success) {
    throw new Error(
      `Activité invalide dans le registre :\n${parsed.error.issues
        .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
        .join("\n")}`,
    );
  }
  if (activitesById.has(parsed.data.id)) {
    throw new Error(`Activité en double : « ${parsed.data.id} »`);
  }
  activitesById.set(parsed.data.id, parsed.data);
}

/** Retourne l'activité ou `null` si elle n'est pas encore fabriquée. */
export function getActivite(id: string): Activite | null {
  return activitesById.get(id) ?? null;
}

/* --------------------------- parcours canonique ---------------------- */

/** Parcours de référence, toujours complet (6 territoires / 17 étapes). */
export const parcoursCanonique: Parcours = parcoursSchema.parse(parcoursRaw);

const etapesCanoniques: Etape[] = parcoursCanonique.territoires
  .flatMap((t) => t.etapes)
  .sort((a, b) => a.ordre - b.ordre);

function territoireDe(etapeId: string): Territoire | undefined {
  return parcoursCanonique.territoires.find((t) => t.etapes.some((e) => e.id === etapeId));
}

/* --------------------------- sentier de découverte ------------------- */

export const sentier: Sentier = sentierSchema.parse(sentierRaw);

/**
 * Vérifie qu'une étape du sentier existe dans le canonique et porte une vraie
 * activité (jamais « aVenir »). Exporté pour être réutilisé par les tests et
 * `validate:content`.
 */
export function erreursSentier(): string[] {
  const erreurs: string[] = [];
  for (const id of sentier.etapes) {
    const etape = etapesCanoniques.find((e) => e.id === id);
    if (!etape) {
      erreurs.push(`« ${id} » : id absent du parcours canonique`);
      continue;
    }
    if (etape.activiteType === "aVenir" || !etape.activiteId) {
      erreurs.push(`« ${id} » : étape « aVenir », sans activité jouable`);
    }
  }
  return erreurs;
}

function construireSentier(): ParcoursActif {
  const probs = erreursSentier();
  if (probs.length > 0) {
    throw new Error(`Sentier de découverte invalide :\n  - ${probs.join("\n  - ")}`);
  }

  // Étapes renumérotées 1..N dans l'ordre du sentier (ordre pédagogique relatif).
  const etapes: Etape[] = sentier.etapes.map((id, i) => {
    const canon = etapesCanoniques.find((e) => e.id === id)!;
    return { ...canon, ordre: i + 1 };
  });

  // Regroupement par territoire canonique, en préservant nom / couleur / ordre.
  const territoires: Territoire[] = [];
  for (const etape of etapes) {
    const canonT = territoireDe(etape.id)!;
    let cible = territoires.find((t) => t.id === canonT.id);
    if (!cible) {
      cible = { ...canonT, etapes: [] };
      territoires.push(cible);
    }
    cible.etapes.push(etape);
  }

  return {
    mode: "sentier",
    titre: sentier.titre,
    sousTitre: sentier.sousTitre,
    territoires,
    etapes,
  };
}

function construireComplet(): ParcoursActif {
  return {
    mode: "complet",
    titre: parcoursCanonique.titre,
    territoires: parcoursCanonique.territoires,
    etapes: etapesCanoniques,
  };
}

/* --------------------------- sélection du parcours actif ------------- */

export const modeParcours: ModeParcours =
  process.env.NEXT_PUBLIC_PARCOURS_ACTIF === "complet" ? "complet" : "sentier";

let cache: ParcoursActif | null = null;

/** Unique point d'entrée : le parcours que l'app affiche aujourd'hui. */
export function getParcoursActif(): ParcoursActif {
  if (!cache) cache = modeParcours === "complet" ? construireComplet() : construireSentier();
  return cache;
}

export const parcoursActif: ParcoursActif = getParcoursActif();
export const territoiresActifs: Territoire[] = parcoursActif.territoires;
export const etapes: Etape[] = parcoursActif.etapes;
export const nombreEtapes = etapes.length;

export function getEtape(id: string): Etape | undefined {
  return etapes.find((e) => e.id === id);
}

export function getTerritoireDeEtape(etapeId: string): Territoire | undefined {
  return territoiresActifs.find((t) => t.etapes.some((e) => e.id === etapeId));
}

export function etapeSuivante(id: string): Etape | undefined {
  const idx = etapes.findIndex((e) => e.id === id);
  if (idx < 0) return undefined;
  return etapes[idx + 1];
}
