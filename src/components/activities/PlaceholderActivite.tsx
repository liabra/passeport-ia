import type { Etape } from "@/content/schema";
import { BigLink } from "@/components/ui/BigButton";
import { ActivityShell } from "./ActivityShell";

/** Écran affiché quand l'activité d'une étape n'est pas encore fabriquée. */
export function PlaceholderActivite({ etape }: { etape: Etape }) {
  return (
    <ActivityShell notion={`Étape ${etape.ordre}`} dureeMin={3} etape="En chantier">
      <h1 className="mb-4 font-titre text-2xl font-bold">{etape.titre}</h1>
      <div className="rounded-carte border-2 border-dashed border-encre-douce bg-carte p-6">
        <p className="mb-2 text-lg font-semibold">Cette étape est en cours de fabrication.</p>
        <p className="text-base text-encre-douce">
          Le chemin est un vrai sentier : on ne saute pas d'étape. Cette halte vous attend — elle
          arrivera dans une prochaine version du voyage.
        </p>
      </div>
      <div className="mt-6">
        <BigLink href="/" variante="secondaire">
          Revenir à la carte
        </BigLink>
      </div>
    </ActivityShell>
  );
}
