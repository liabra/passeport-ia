import type { RenardAttributs } from "@/content/schema";

const couleurs = ["#6E8B3D", "#E3B505", "#C6392C", "#6B4E7A"]; // vert, jaune, rouge, violet

function fill(couleur: number): string {
  return couleurs[couleur] ?? couleurs[0]!;
}

/**
 * Représentation stylisée d'un fruit (jamais une photo réaliste : on n'enseigne
 * pas la cueillette). La forme et le motif de texture distinguent les fruits ;
 * la couleur n'est jamais le seul canal d'information (le libellé texte porte le
 * sens). Purement décoratif : le nom accessible vient du libellé voisin.
 */
export function FruitVisuel({ attributs, taille = 56 }: { attributs: RenardAttributs; taille?: number }) {
  const c = fill(attributs.couleur);
  const forme = attributs.forme;
  const ferme = attributs.texture === 0;

  return (
    <svg
      width={taille}
      height={taille}
      viewBox="0 0 48 48"
      aria-hidden="true"
      focusable="false"
      role="presentation"
    >
      {/* Forme du fruit. */}
      {forme === 0 && <circle cx="24" cy="26" r="15" fill={c} />}
      {forme === 1 && (
        <path d="M14 10 C 30 8, 42 20, 36 36 C 34 40, 28 40, 26 36 C 30 26, 22 16, 12 16 C 10 13, 12 10, 14 10 Z" fill={c} />
      )}
      {forme === 2 && <ellipse cx="24" cy="26" rx="12" ry="16" fill={c} />}
      {forme === 3 && (
        <g fill={c}>
          <circle cx="18" cy="20" r="7" />
          <circle cx="30" cy="20" r="7" />
          <circle cx="24" cy="30" r="7" />
        </g>
      )}

      {/* Motif de texture : ferme = petits points ; tendre = reflet lisse. */}
      {ferme ? (
        <g fill="rgba(53,50,42,0.35)">
          <circle cx="20" cy="24" r="1.3" />
          <circle cx="27" cy="22" r="1.3" />
          <circle cx="24" cy="30" r="1.3" />
          <circle cx="30" cy="29" r="1.3" />
        </g>
      ) : (
        <ellipse cx="19" cy="20" rx="4" ry="6" fill="rgba(255,255,255,0.45)" />
      )}

      {/* Petite tige commune. */}
      <path d="M24 11 q 3 -5 7 -6" stroke="#57724E" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
