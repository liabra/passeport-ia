"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getActivite, getEtape, getTerritoireDeEtape } from "@/content";
import { useProgress } from "@/lib/progress-context";
import { estAccessible } from "@/lib/progression";
import { EcranChargement } from "@/components/EcranChargement";
import { PerroquetActivity } from "./PerroquetActivity";
import { IntrusActivity } from "./IntrusActivity";
import { PlaceholderActivite } from "./PlaceholderActivite";
import { TamponScreen } from "./TamponScreen";
import type { ResultatActivite } from "./types";

/** Orchestration côté client d'une étape : garde, activité, puis tampon. */
export function EtapeRunner({ id }: { id: string }) {
  const router = useRouter();
  const { etat, charge, enregistrer } = useProgress();
  const [phase, setPhase] = useState<"activite" | "tampon">("activite");
  const [resultat, setResultat] = useState<ResultatActivite | null>(null);

  const etape = getEtape(id);

  useEffect(() => {
    if (!charge) return;
    if (!etape) {
      router.replace("/");
      return;
    }
    // Le chemin est bloquant : on ne peut pas atteindre une étape non débloquée.
    if (phase === "activite" && !estAccessible(etat, id)) {
      router.replace("/");
    }
  }, [charge, etape, etat, id, phase, router]);

  if (!charge || !etape) return <EcranChargement />;

  const territoire = getTerritoireDeEtape(id);
  const activite = getActivite(etape.activiteId);

  async function terminer(r: ResultatActivite) {
    await enregistrer({
      etapeId: id,
      termineeLe: new Date().toISOString(),
      rang: r.rang,
      meta: r.meta,
    });
    setResultat(r);
    setPhase("tampon");
  }

  if (phase === "tampon" && resultat) {
    return (
      <TamponScreen
        etape={etape}
        territoire={territoire}
        phraseCristallisation={activite?.phraseCristallisation ?? ""}
        resultat={resultat}
      />
    );
  }

  if (!activite) return <PlaceholderActivite etape={etape} />;

  if (activite.type === "perroquet") {
    return <PerroquetActivity activite={activite} onTermine={terminer} />;
  }
  return <IntrusActivity activite={activite} onTermine={terminer} />;
}
