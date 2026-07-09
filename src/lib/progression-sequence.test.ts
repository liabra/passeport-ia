import { beforeEach, describe, expect, it } from "vitest";
import { etapes, modeParcours } from "@/content";
import { etatVide, LocalProgressStore, type ProgressState } from "./progress-store";
import { estAccessible, etapeCouranteId, nombreTampons, statutEtape } from "./progression";

/**
 * Non-régression : terminer une étape ne doit JAMAIS en valider une autre.
 *
 * On passe par le vrai chemin d'écriture de l'app (LocalProgressStore →
 * localStorage), exactement comme EtapeRunner : un enregistrement = un id
 * d'étape. La progression (statuts, compteur, courante) est ensuite lue sur la
 * liste du parcours ACTIF, indexée par id — jamais par position/ordre.
 */

// Stub localStorage pour l'environnement node.
const mem = new Map<string, string>();
(globalThis as unknown as { window: unknown }).window = {
  localStorage: {
    getItem: (k: string) => mem.get(k) ?? null,
    setItem: (k: string, v: string) => void mem.set(k, v),
    removeItem: (k: string) => void mem.delete(k),
  },
};

const store = new LocalProgressStore();

async function terminer(etapeId: string): Promise<ProgressState> {
  // Même forme d'écriture que EtapeRunner.terminer.
  return store.enregistrer({ etapeId, termineeLe: new Date().toISOString() });
}

function statuts(etat: ProgressState): string[] {
  return etapes.map((e) => statutEtape(etat, e.id));
}

describe(`progression séquentielle (mode ${modeParcours})`, () => {
  beforeEach(() => mem.clear());

  it("après avoir terminé UNIQUEMENT l'étape 1 : un seul tampon, la 2 courante, le reste à venir", async () => {
    const etat = await terminer(etapes[0]!.id);

    expect(nombreTampons(etat)).toBe(1);
    expect(statutEtape(etat, etapes[0]!.id)).toBe("termine");
    expect(statutEtape(etat, etapes[1]!.id)).toBe("courante");
    for (const e of etapes.slice(2)) {
      expect(statutEtape(etat, e.id), `étape ${e.ordre} (${e.id})`).toBe("avenir");
    }
    // Une seule étape « termine » au total.
    expect(statuts(etat).filter((s) => s === "termine")).toHaveLength(1);
  });

  it("après avoir terminé la 1 puis la 2 : seules 1 et 2 sont terminées, la 3 courante, la 4 PAS terminée", async () => {
    await terminer(etapes[0]!.id);
    const etat = await terminer(etapes[1]!.id);

    expect(nombreTampons(etat)).toBe(2);
    expect(statutEtape(etat, etapes[0]!.id)).toBe("termine");
    expect(statutEtape(etat, etapes[1]!.id)).toBe("termine");
    expect(statutEtape(etat, etapes[2]!.id)).toBe("courante");
    if (etapes[3]) expect(statutEtape(etat, etapes[3].id)).not.toBe("termine");
    expect(statuts(etat).filter((s) => s === "termine")).toHaveLength(2);
  });

  it("progression complète : chaque étape terminée n'ajoute qu'un tampon et avance la courante d'une étape", async () => {
    let etat: ProgressState | null = null;
    for (const [i, e] of etapes.entries()) {
      expect(etapeCouranteId(etat ?? etatVide())).toBe(e.id);
      etat = await terminer(e.id);
      expect(nombreTampons(etat)).toBe(i + 1);
    }
  });

  it("le blocage tient : une étape non débloquée reste inaccessible", async () => {
    const etat = await terminer(etapes[0]!.id);
    expect(estAccessible(etat, etapes[1]!.id)).toBe(true); // courante
    if (etapes[2]) expect(estAccessible(etat, etapes[2].id)).toBe(false);
  });

  it("des résultats orphelins (ids d'anciennes versions du contenu) ne polluent ni compteur ni statuts", async () => {
    // Reproduit l'incident : progression persistée avant une évolution du
    // contenu (ids disparus / renommés). Ces clés restent en stockage mais ne
    // doivent compter pour rien dans le parcours actif.
    await terminer("mots-perroquet"); // id de l'ancien parcours, n'existe plus
    await terminer("etape-fantome");
    const etat = await terminer(etapes[0]!.id);

    expect(nombreTampons(etat)).toBe(1);
    expect(statutEtape(etat, etapes[1]!.id)).toBe("courante");
    expect(statuts(etat).filter((s) => s === "termine")).toHaveLength(1);
  });
});
