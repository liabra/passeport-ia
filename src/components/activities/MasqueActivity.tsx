"use client";

import { useState } from "react";
import type { ActiviteMasque } from "@/content/schema";
import { cn } from "@/lib/cn";
import { BigButton } from "@/components/ui/BigButton";
import { CrystalCard } from "@/components/ui/CrystalCard";
import { ActivityShell } from "./ActivityShell";
import type { ActiviteProps } from "./types";

type Attribution = "coeur" | "ia";

export function MasqueActivity({ activite, onTermine }: ActiviteProps<ActiviteMasque>) {
  const donnees = activite.donnees;
  const [phase, setPhase] = useState<"tri" | "revelation" | "verification">("tri");
  const [attributions, setAttributions] = useState<Record<string, Attribution>>({});
  const [verifId, setVerifId] = useState<string | null>(null);
  const [annonce, setAnnonce] = useState("");

  const nbAssignes = Object.keys(attributions).length;
  const tousAssignes = nbAssignes === donnees.messages.length;
  const nbCoeur = Object.values(attributions).filter((a) => a === "coeur").length;

  function attribuer(id: string, valeur: Attribution) {
    setAttributions((prev) => ({ ...prev, [id]: valeur }));
    setAnnonce(valeur === "coeur" ? "Message attribué à un cœur." : "Message attribué à une IA.");
  }

  /* -------------------------------- tri --------------------------------- */
  if (phase === "tri") {
    return (
      <ActivityShell notion={activite.notion} dureeMin={activite.dureeMin} etape="À toi de trier">
        <p aria-live="polite" className="sr-only">
          {annonce}
        </p>
        <h1 className="mb-2 font-titre text-xl font-bold">
          Lesquels ont été écrits par un cœur qui ressent ? Lesquels par une IA ?
        </h1>
        <p className="mb-5 text-base text-encre-douce">
          Lis chaque message et range-le. Triés :{" "}
          <strong>
            {nbAssignes} / {donnees.messages.length}
          </strong>
        </p>

        <ul className="flex flex-col gap-4">
          {donnees.messages.map((m) => {
            const choix = attributions[m.id];
            return (
              <li key={m.id} className="rounded-carte border-2 border-encre bg-carte p-4 shadow-carte">
                <p className="mb-3 text-lg italic">«&nbsp;{m.texte}&nbsp;»</p>
                <div className="flex flex-wrap gap-2">
                  <BigButton
                    variante="secondaire"
                    className={cn("min-h-[44px] px-4 py-2 text-base", choix === "coeur" && "border-rouge-gr")}
                    aria-pressed={choix === "coeur"}
                    onClick={() => attribuer(m.id, "coeur")}
                  >
                    Écrit par un cœur
                  </BigButton>
                  <BigButton
                    variante="secondaire"
                    className={cn("min-h-[44px] px-4 py-2 text-base", choix === "ia" && "border-eau")}
                    aria-pressed={choix === "ia"}
                    onClick={() => attribuer(m.id, "ia")}
                  >
                    Écrit par une IA
                  </BigButton>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-6">
          <BigButton disabled={!tousAssignes} onClick={() => setPhase("revelation")}>
            {tousAssignes ? "Voir la réponse" : "Range les 4 messages"}
          </BigButton>
        </div>
      </ActivityShell>
    );
  }

  /* ----------------------------- révélation ----------------------------- */
  if (phase === "revelation") {
    return (
      <ActivityShell notion={activite.notion} dureeMin={activite.dureeMin} etape="Révélation">
        <div aria-live="polite">
          <h1 className="mb-4 font-titre text-2xl font-bold">
            Les 4 messages ont été écrits par une IA.
          </h1>
          {nbCoeur > 0 ? (
            <p className="mb-4 text-lg">
              Tu en avais attribué <strong>{nbCoeur}</strong> à un cœur qui ressent.
            </p>
          ) : null}
        </div>

        <p className="mb-4 rounded-carte border-2 border-papier-profond bg-papier p-4 text-lg">
          {donnees.revelationTousIA}
        </p>
        <p className="mb-4 rounded-carte border-2 border-papier-profond bg-papier p-4 text-lg">
          {donnees.mecaniqueDevoilee}
        </p>
        <CrystalCard titre="La nuance">{donnees.nuance}</CrystalCard>

        <div className="mt-6">
          <BigButton onClick={() => setPhase("verification")}>Vérifier ce que j'ai compris</BigButton>
        </div>
      </ActivityShell>
    );
  }

  /* ---------------------------- vérification ---------------------------- */
  const choixVerif = donnees.verification.choix.find((c) => c.id === verifId) ?? null;
  return (
    <ActivityShell notion={activite.notion} dureeMin={activite.dureeMin} etape="Vérification">
      <h1 className="mb-4 font-titre text-xl font-bold">{donnees.verification.question}</h1>
      <div className="flex flex-col gap-3">
        {donnees.verification.choix.map((c) => (
          <BigButton
            key={c.id}
            variante="secondaire"
            className={cn(
              "w-full justify-start text-left",
              verifId === c.id && (c.correct ? "border-foret" : "border-rouge-gr"),
            )}
            disabled={verifId !== null && verifId !== c.id}
            onClick={() => setVerifId(c.id)}
          >
            {c.label}
          </BigButton>
        ))}
      </div>

      {choixVerif ? (
        <div
          aria-live="polite"
          className={cn(
            "mt-5 rounded-carte border-2 bg-carte p-4 text-lg",
            choixVerif.correct ? "border-foret" : "border-ocre",
          )}
        >
          <p className="mb-1 font-titre font-bold">
            {choixVerif.correct ? "C'est bien ça." : "Pas tout à fait."}
          </p>
          <p>{choixVerif.retour}</p>
        </div>
      ) : null}

      {choixVerif ? (
        <div className="mt-6">
          <BigButton
            onClick={() => onTermine({ meta: { comprehension: choixVerif.correct ? "ok" : "rate" } })}
          >
            Recevoir mon tampon
          </BigButton>
        </div>
      ) : null}
    </ActivityShell>
  );
}
