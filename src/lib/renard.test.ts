import { describe, expect, it } from "vitest";
import { getActivite } from "@/content";
import { besaceVerite, classer, nombreErreurs, trier } from "./renard";

const activite = getActivite("renard-fruits");
if (!activite || activite.type !== "renard") {
  throw new Error("Activité « renard-fruits » introuvable ou de mauvais type");
}
const donnees = activite.donnees;

describe("classifieur renard (déterministe)", () => {
  it("classe un item selon son plus proche voisin", () => {
    const besace = besaceVerite(donnees.exemplesPhase2);
    // Un fruit identique à un exemple mûr est classé mûr.
    const mur = donnees.exemplesPhase2.find((e) => e.categorieVraie === "mur")!;
    expect(classer(mur.attributs, besace)).toBe("mur");
  });

  it("est reproductible (même entrée → même sortie)", () => {
    const besace = besaceVerite(donnees.exemplesPhase1);
    const a = trier(donnees.test, besace);
    const b = trier(donnees.test, besace);
    expect(a.map((r) => r.predite)).toEqual(b.map((r) => r.predite));
  });
});

describe("co-conception contenu ⇄ classifieur (garantie pédagogique)", () => {
  it("PHASE 1 (2 exemples) : au moins une erreur sur le test", () => {
    const res = trier(donnees.test, besaceVerite(donnees.exemplesPhase1));
    expect(nombreErreurs(res)).toBeGreaterThanOrEqual(1);
  });

  it("PHASE 2 (8 exemples variés) : sans-faute sur le MÊME test", () => {
    const res = trier(donnees.test, besaceVerite(donnees.exemplesPhase2));
    expect(nombreErreurs(res)).toBe(0);
  });

  it("le test contient au moins un contre-exemple de la règle naïve « couleur »", () => {
    // Deux fruits de même couleur mais de catégories différentes : la couleur
    // seule ne peut donc pas trancher.
    const parCouleur = new Map<number, Set<string>>();
    for (const item of donnees.test) {
      const s = parCouleur.get(item.attributs.couleur) ?? new Set();
      s.add(item.categorieVraie);
      parCouleur.set(item.attributs.couleur, s);
    }
    expect([...parCouleur.values()].some((cats) => cats.size > 1)).toBe(true);
  });
});
