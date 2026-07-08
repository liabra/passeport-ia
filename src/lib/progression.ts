import { etapes } from "@/content";
import type { ProgressState } from "./progress-store";

export type StatutEtape = "termine" | "courante" | "avenir";

export function estTerminee(etat: ProgressState, etapeId: string): boolean {
  return Boolean(etat.resultats[etapeId]);
}

export function nombreTampons(etat: ProgressState): number {
  return Object.keys(etat.resultats).length;
}

/**
 * Id de l'étape courante : la première (dans l'ordre) qui n'est pas terminée.
 * Si tout est terminé, on reste sur la dernière étape.
 */
export function etapeCouranteId(etat: ProgressState): string {
  const premiereNonFaite = etapes.find((e) => !estTerminee(etat, e.id));
  if (premiereNonFaite) return premiereNonFaite.id;
  const derniere = etapes[etapes.length - 1];
  return derniere ? derniere.id : "";
}

/**
 * Une étape est accessible si elle est terminée (rejouable) ou si c'est
 * l'étape courante. On ne peut jamais sauter une étape : le chemin est bloquant.
 */
export function estAccessible(etat: ProgressState, etapeId: string): boolean {
  if (estTerminee(etat, etapeId)) return true;
  return etapeId === etapeCouranteId(etat);
}

export function statutEtape(etat: ProgressState, etapeId: string): StatutEtape {
  if (estTerminee(etat, etapeId)) return "termine";
  if (etapeId === etapeCouranteId(etat)) return "courante";
  return "avenir";
}
