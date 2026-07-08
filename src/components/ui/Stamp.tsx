import { cn } from "@/lib/cn";

export type CouleurTampon = "rouge-gr" | "foret" | "eau" | "ocre" | "encre-douce";

const bordureParCouleur: Record<CouleurTampon, string> = {
  "rouge-gr": "border-rouge-gr text-rouge-gr",
  foret: "border-foret text-foret",
  eau: "border-eau text-eau",
  ocre: "border-ocre text-ocre",
  "encre-douce": "border-encre-douce text-encre-douce",
};

interface StampProps {
  titre: string;
  sousTitre?: string;
  couleur?: CouleurTampon;
  /** Rotation en degrés (aspect « tamponné à la main »). */
  rotation?: number;
  taille?: number;
  /** Joue l'animation « claque » à l'apparition. */
  animer?: boolean;
  className?: string;
}

/**
 * Tampon circulaire rotaté. L'animation « claque » est stoppée
 * automatiquement par `prefers-reduced-motion` (voir globals.css).
 */
export function Stamp({
  titre,
  sousTitre,
  couleur = "rouge-gr",
  rotation = -8,
  taille = 132,
  animer = false,
  className,
}: StampProps) {
  return (
    <span
      role="img"
      aria-label={sousTitre ? `Tampon : ${titre}, ${sousTitre}` : `Tampon : ${titre}`}
      className={cn(
        "relative inline-flex select-none items-center justify-center rounded-full border-[3px] bg-carte/40",
        "shadow-[inset_0_0_0_2px_rgba(255,255,255,0.35)]",
        bordureParCouleur[couleur],
        animer && "animate-stamp-claque",
        className,
      )}
      style={
        {
          width: taille,
          height: taille,
          transform: `rotate(${rotation}deg)`,
          "--stamp-rot": `${rotation}deg`,
        } as React.CSSProperties
      }
    >
      <span className="absolute inset-2 rounded-full border border-dashed border-current opacity-60" />
      <span className="flex flex-col items-center px-3 text-center">
        <span className="font-titre text-lg font-bold uppercase leading-tight tracking-wide">
          {titre}
        </span>
        {sousTitre ? (
          <span className="mt-1 text-xs font-semibold uppercase tracking-widest opacity-80">
            {sousTitre}
          </span>
        ) : null}
      </span>
    </span>
  );
}
