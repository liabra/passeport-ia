export interface PointCarte {
  x: number;
  y: number;
}

export interface CheminCarte {
  points: PointCarte[];
  largeur: number;
  hauteur: number;
  /** Attribut `d` d'un <path> SVG reliant les points en serpentin doux. */
  d: string;
}

/**
 * Génère les positions du chemin serpentin à partir du nombre d'étapes.
 * Algorithme simple de zigzag vertical : on descend en alternant deux
 * couloirs (gauche / droite), reliés par des courbes en S. Les positions sont
 * *calculées*, jamais codées à la main — ajouter une étape déplace tout le
 * tracé automatiquement.
 */
export function genererChemin(nombreEtapes: number): CheminCarte {
  const largeur = 320;
  const margeX = 64;
  const couloirGauche = margeX;
  const couloirDroit = largeur - margeX;
  const margeHaut = 60;
  const ecartVertical = 96;

  const hauteur = margeHaut * 2 + Math.max(0, nombreEtapes - 1) * ecartVertical;

  const points: PointCarte[] = [];
  for (let i = 0; i < nombreEtapes; i++) {
    points.push({
      x: i % 2 === 0 ? couloirGauche : couloirDroit,
      y: margeHaut + i * ecartVertical,
    });
  }

  let d = "";
  points.forEach((p, i) => {
    if (i === 0) {
      d += `M ${p.x} ${p.y}`;
      return;
    }
    const prec = points[i - 1]!;
    const milieuY = (prec.y + p.y) / 2;
    // Cubique dont les points de contrôle tirent verticalement : effet « S ».
    d += ` C ${prec.x} ${milieuY}, ${p.x} ${milieuY}, ${p.x} ${p.y}`;
  });

  return { points, largeur, hauteur, d };
}
