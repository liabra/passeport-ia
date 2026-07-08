import { describe, expect, it } from "vitest";
import { genererChemin } from "./chemin";

describe("genererChemin", () => {
  it("génère autant de points que d'étapes", () => {
    expect(genererChemin(17).points).toHaveLength(17);
    expect(genererChemin(1).points).toHaveLength(1);
  });

  it("descend : les y sont strictement croissants", () => {
    const { points } = genererChemin(6);
    for (let i = 1; i < points.length; i++) {
      expect(points[i]!.y).toBeGreaterThan(points[i - 1]!.y);
    }
  });

  it("zigzague : les x alternent entre deux couloirs", () => {
    const { points } = genererChemin(4);
    expect(points[0]!.x).toBe(points[2]!.x);
    expect(points[1]!.x).toBe(points[3]!.x);
    expect(points[0]!.x).not.toBe(points[1]!.x);
  });

  it("produit un attribut de path commençant par un moveto", () => {
    expect(genererChemin(3).d.startsWith("M ")).toBe(true);
  });

  it("dimensionne la hauteur en fonction du nombre d'étapes", () => {
    expect(genererChemin(10).hauteur).toBeGreaterThan(genererChemin(3).hauteur);
  });
});
