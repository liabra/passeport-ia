import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  erreursSentier,
  etapes,
  getActivite,
  modeParcours,
  nombreEtapes,
  parcoursCanonique,
  sentier,
} from "./index";

const etapesCanoniques = parcoursCanonique.territoires.flatMap((t) => t.etapes);

describe("parcours canonique (source de vérité, toujours complet)", () => {
  it("compte 6 territoires et 17 étapes (Noyau citoyen)", () => {
    expect(parcoursCanonique.territoires).toHaveLength(6);
    expect(etapesCanoniques).toHaveLength(17);
  });

  it("numérote les étapes de 1 à 17 sans trou", () => {
    const ordres = etapesCanoniques.map((e) => e.ordre).sort((a, b) => a - b);
    expect(ordres).toEqual(Array.from({ length: 17 }, (_, i) => i + 1));
  });

  it("rattache les deux activités développées aux étapes canoniques 2 et 6", () => {
    const perroquet = etapesCanoniques.find((e) => e.ordre === 2)!;
    const intrus = etapesCanoniques.find((e) => e.ordre === 6)!;
    expect(perroquet.activiteType).toBe("perroquet");
    expect(perroquet.activiteId).toBe("perroquet-echos");
    expect(intrus.activiteType).toBe("intrus");
    expect(intrus.activiteId).toBe("intrus-tour-eiffel");
    expect(getActivite(perroquet.activiteId!)).not.toBeNull();
    expect(getActivite(intrus.activiteId!)).not.toBeNull();
  });

  it("rattache les activités du territoire 1 aux étapes 3, 4 et 5", () => {
    const attendu: Record<number, { type: string; id: string }> = {
      3: { type: "renard", id: "renard-fruits" },
      4: { type: "masque", id: "masque-emotions" },
      5: { type: "deuxCerveaux", id: "deux-cerveaux" },
    };
    for (const [ordre, { type, id }] of Object.entries(attendu)) {
      const etape = etapesCanoniques.find((e) => e.ordre === Number(ordre))!;
      expect(etape.activiteType).toBe(type);
      expect(etape.activiteId).toBe(id);
      expect(getActivite(etape.activiteId!)).not.toBeNull();
    }
  });

  it("marque les autres étapes comme « aVenir » sans activiteId", () => {
    const aVenir = etapesCanoniques.filter((e) => e.activiteType === "aVenir");
    expect(aVenir).toHaveLength(12);
    for (const e of aVenir) expect(e.activiteId).toBeUndefined();
  });
});

describe("sentier de découverte (projection jouable)", () => {
  it("ne référence que des étapes canoniques réellement jouables", () => {
    expect(erreursSentier()).toEqual([]);
  });

  it("chaque id du sentier existe dans le canonique avec une activité (jamais aVenir)", () => {
    for (const id of sentier.etapes) {
      const etape = etapesCanoniques.find((e) => e.id === id);
      expect(etape, `étape « ${id} » absente du canonique`).toBeDefined();
      expect(etape!.activiteType).not.toBe("aVenir");
      expect(etape!.activiteId).toBeDefined();
    }
  });

  it("suit l'ordre pédagogique canonique du Territoire 1", () => {
    expect(sentier.etapes).toEqual([
      "perroquet-devin",
      "apprend-par-exemple",
      "ni-intention-ni-emotion",
      "memoire-ou-recherche",
      "cherche-intrus",
    ]);
  });
});

describe("parcours actif (dépend de NEXT_PUBLIC_PARCOURS_ACTIF)", () => {
  it("expose des étapes numérotées 1..N sans trou", () => {
    const ordres = etapes.map((e) => e.ordre);
    expect(ordres).toEqual(Array.from({ length: etapes.length }, (_, i) => i + 1));
  });

  if (modeParcours === "sentier") {
    it("mode sentier : 5 étapes, toutes jouables de bout en bout", () => {
      expect(nombreEtapes).toBe(5);
      for (const e of etapes) {
        expect(e.activiteType).not.toBe("aVenir");
        expect(getActivite(e.activiteId!)).not.toBeNull();
      }
    });
  } else {
    it("mode complet : 17 étapes fidèles au référentiel", () => {
      expect(nombreEtapes).toBe(17);
    });
  }
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

  it("le masque ne présente jamais un message comme humain (v1 : tous « ia »)", () => {
    const a = getActivite("masque-emotions");
    expect(a?.type).toBe("masque");
    if (a?.type === "masque") {
      expect(a.donnees.messages).toHaveLength(4);
      for (const m of a.donnees.messages) expect(m.origine).toBe("ia");
    }
  });

  it("deux-cerveaux cite une source réelle et affiche une date de récolte", () => {
    const a = getActivite("deux-cerveaux");
    expect(a?.type).toBe("deuxCerveaux");
    if (a?.type === "deuxCerveaux") {
      const tour = a.donnees.questions.find((q) => q.famille === "actualite")!;
      expect(tour.reponseRecherche.sources).toContain(
        "https://fr.wikipedia.org/wiki/Tour_de_France_2025",
      );
      expect(tour.reponseRecherche.texte).toContain("Pogačar");
      for (const q of a.donnees.questions) {
        expect(q.reponseMemoire.dateRecolte).not.toBe("");
        expect(q.reponseRecherche.dateRecolte).not.toBe("");
      }
    }
  });
});

describe("intégrité §7 : cristallisations identiques au référentiel", () => {
  const referentiel = readFileSync(
    fileURLToPath(new URL("../../docs/referentiel.md", import.meta.url)),
    "utf8",
  );

  const idsDeveloppes = [
    "perroquet-echos",
    "renard-fruits",
    "masque-emotions",
    "deux-cerveaux",
    "intrus-tour-eiffel",
  ];

  for (const id of idsDeveloppes) {
    it(`« ${id} » : phrase de cristallisation présente mot pour mot dans le référentiel`, () => {
      const a = getActivite(id);
      expect(a, `activité ${id} introuvable`).not.toBeNull();
      expect(referentiel).toContain(a!.phraseCristallisation);
    });
  }
});
