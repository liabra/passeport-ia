import type { RenardAttributs, RenardCategorie, RenardItem } from "@/content/schema";

/**
 * Classifieur jouet, 100 % déterministe (aucune vraie ML, aucun aléatoire).
 *
 * Règle : plus proche voisin (distance de Manhattan sur les attributs encodés
 * en petits entiers). Le renard « apprend » uniquement des exemples qu'on lui
 * montre : chaque exemple appris porte la catégorie que le joueur lui a
 * attribuée (`categorie`), pas forcément la vérité.
 *
 * Comportement recherché, garanti par la co-conception contenu ⇄ classifieur
 * (vérifié dans `renard.test.ts`) :
 *  - 2 exemples → le renard généralise à outrance sur l'attribut dominant
 *    (la couleur, la plus étalée) → il se trompe sur les contre-exemples ;
 *  - 8 exemples variés → le plus proche voisin devient correct → sans-faute.
 */

export interface RenardExempleAppris {
  attributs: RenardAttributs;
  categorie: RenardCategorie;
}

export function distance(a: RenardAttributs, b: RenardAttributs): number {
  return (
    Math.abs(a.couleur - b.couleur) +
    Math.abs(a.forme - b.forme) +
    Math.abs(a.texture - b.texture)
  );
}

/**
 * Classe un item selon son plus proche voisin dans la besace.
 * Départage déterministe : à distance égale, le premier exemple montré gagne.
 * Besace vide → « pas_mur » par défaut (ne devrait jamais arriver côté UI).
 */
export function classer(
  attributs: RenardAttributs,
  besace: RenardExempleAppris[],
): RenardCategorie {
  let meilleure: RenardCategorie = "pas_mur";
  let meilleureDistance = Number.POSITIVE_INFINITY;
  for (const ex of besace) {
    const d = distance(attributs, ex.attributs);
    if (d < meilleureDistance) {
      meilleureDistance = d;
      meilleure = ex.categorie;
    }
  }
  return meilleure;
}

export interface ResultatTest {
  item: RenardItem;
  predite: RenardCategorie;
  correcte: boolean;
}

/** Fait trier tout le test par le renard, à partir d'une besace donnée. */
export function trier(test: RenardItem[], besace: RenardExempleAppris[]): ResultatTest[] {
  return test.map((item) => {
    const predite = classer(item.attributs, besace);
    return { item, predite, correcte: predite === item.categorieVraie };
  });
}

/** Besace « idéale » : les exemples étiquetés selon leur catégorie vraie. */
export function besaceVerite(exemples: RenardItem[]): RenardExempleAppris[] {
  return exemples.map((e) => ({ attributs: e.attributs, categorie: e.categorieVraie }));
}

export function nombreErreurs(resultats: ResultatTest[]): number {
  return resultats.filter((r) => !r.correcte).length;
}
