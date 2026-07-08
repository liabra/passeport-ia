import type { Activite } from "@/content/schema";

/** Ce qu'une activité renvoie au runner à la fin (le tampon est ensuite posé). */
export interface ResultatActivite {
  rang?: string;
  meta?: Record<string, string | number>;
}

export interface ActiviteProps<A extends Activite> {
  activite: A;
  onTermine: (resultat: ResultatActivite) => void;
}
