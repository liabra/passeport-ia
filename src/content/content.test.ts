import { describe, expect, it } from "vitest";
import { etapes, getActivite, nombreEtapes, parcours } from "./index";

describe("contenu du parcours", () => {
  it("compte 6 territoires et 17 étapes (Noyau citoyen)", () => {
    expect(parcours.territoires).toHaveLength(6);
    expect(nombreEtapes).toBe(17);
  });

  it("numérote les étapes de 1 à N sans trou", () => {
    const ordres = etapes.map((e) => e.ordre);
    expect(ordres).toEqual(Array.from({ length: etapes.length }, (_, i) => i + 1));
  });

  it("place les deux activités jouables en tête de parcours", () => {
    expect(etapes[0]!.activiteType).toBe("perroquet");
    expect(etapes[1]!.activiteType).toBe("intrus");
    expect(getActivite(etapes[0]!.activiteId)).not.toBeNull();
    expect(getActivite(etapes[1]!.activiteId)).not.toBeNull();
  });

  it("renvoie null pour une activité pas encore fabriquée", () => {
    expect(getActivite("activite-inexistante")).toBeNull();
  });
});

describe("intégrité des activités", () => {
  it("l'activité perroquet a 4 manches dont un piège", () => {
    const a = getActivite("perroquet-echos");
    expect(a?.type).toBe("perroquet");
    if (a?.type === "perroquet") {
      expect(a.donnees.manches).toHaveLength(4);
      expect(a.donnees.manches.some((m) => m.kind === "piege")).toBe(true);
    }
  });

  it("le scénario intrus contient exactement un détail inventé", () => {
    const a = getActivite("intrus-tour-eiffel");
    expect(a?.type).toBe("intrus");
    if (a?.type === "intrus") {
      const details = a.donnees.reponse.parts.filter((p) => p.kind === "detail");
      const inventes = details.filter((p) => p.kind === "detail" && p.invente);
      expect(inventes).toHaveLength(1);
    }
  });
});
