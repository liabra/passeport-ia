/** Concatène des classes conditionnelles, en ignorant les valeurs vides. */
export function cn(...valeurs: Array<string | false | null | undefined>): string {
  return valeurs.filter(Boolean).join(" ");
}
