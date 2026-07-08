import { describe, expect, it } from "vitest";
import { etapes } from "@/content";
import { etatVide, type ProgressState } from "./progress-store";
import {
  estAccessible,
  estTerminee,
  etapeCouranteId,
  nombreTampons,
  statutEtape,
} from "./progression";

const premiere = etapes[0]!;
const deuxieme = etapes[1]!;

function avecTerminees(...ids: string[]): ProgressState {
  const etat = etatVide();
  for (const id of ids) {
    etat.resultats[id] = { etapeId: id, termineeLe: new Date().toISOString() };
  }
  return etat;
}

describe("progression", () => {
  it("l'étape courante d'un état vide est la première du parcours", () => {
    expect(etapeCouranteId(etatVide())).toBe(premiere.id);
  });

  it("avance à l'étape suivante une fois la première terminée", () => {
    expect(etapeCouranteId(avecTerminees(premiere.id))).toBe(deuxieme.id);
  });

  it("bloque le chemin : la 2e étape n'est pas accessible tant que la 1re n'est pas faite", () => {
    const vide = etatVide();
    expect(estAccessible(vide, premiere.id)).toBe(true);
    expect(estAccessible(vide, deuxieme.id)).toBe(false);
  });

  it("garde accessibles les étapes terminées (rejouables)", () => {
    const etat = avecTerminees(premiere.id);
    expect(estAccessible(etat, premiere.id)).toBe(true);
    expect(estTerminee(etat, premiere.id)).toBe(true);
  });

  it("calcule le statut de chaque étape", () => {
    const etat = avecTerminees(premiere.id);
    expect(statutEtape(etat, premiere.id)).toBe("termine");
    expect(statutEtape(etat, deuxieme.id)).toBe("courante");
    expect(statutEtape(etat, etapes[2]!.id)).toBe("avenir");
  });

  it("compte les tampons", () => {
    expect(nombreTampons(avecTerminees(premiere.id, deuxieme.id))).toBe(2);
  });
});
