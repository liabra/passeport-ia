import { cn } from "@/lib/cn";

interface BlazeProps {
  /** Côté du carré en pixels. */
  taille?: number;
  className?: string;
  /** Texte alternatif ; si absent, la balise est décorative. */
  label?: string;
}

/**
 * La balise GR : rectangle blanc au-dessus d'un rectangle rouge, comme sur les
 * sentiers de grande randonnée. Marqueur d'une étape terminée / du bon chemin.
 */
export function Blaze({ taille = 22, className, label }: BlazeProps) {
  const largeur = Math.round(taille * 1.15);
  return (
    <span
      className={cn("inline-flex flex-col overflow-hidden rounded-[3px]", className)}
      style={{ width: largeur, height: taille }}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <span className="block flex-1 bg-carte" />
      <span className="block flex-1 bg-rouge-gr" />
    </span>
  );
}
