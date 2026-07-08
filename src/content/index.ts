import parcoursRaw from "../../content/parcours.json";
import { activitesRaw } from "./registry";
import {
  activiteSchema,
  parcoursSchema,
  type Activite,
  type Etape,
  type Parcours,
  type Territoire,
} from "./schema";

/**
 * Point d'accès unique au contenu. Tout est validé par zod à l'import : un
 * fichier JSON invalide fait échouer le build (fail-fast), jamais l'exécution
 * côté client.
 */

export const parcours: Parcours = parcoursSchema.parse(parcoursRaw);

/** Toutes les étapes, aplaties et triées par ordre de progression. */
export const etapes: Etape[] = parcours.territoires
  .flatMap((t) => t.etapes)
  .sort((a, b) => a.ordre - b.ordre);

export const nombreEtapes = etapes.length;

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

export function getEtape(id: string): Etape | undefined {
  return etapes.find((e) => e.id === id);
}

export function getTerritoireDeEtape(etapeId: string): Territoire | undefined {
  return parcours.territoires.find((t) => t.etapes.some((e) => e.id === etapeId));
}

export function etapeSuivante(id: string): Etape | undefined {
  const courante = getEtape(id);
  if (!courante) return undefined;
  return etapes.find((e) => e.ordre === courante.ordre + 1);
}
