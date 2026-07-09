"use client";

import { useState } from "react";
import type { ActiviteDeuxCerveaux } from "@/content/schema";
import { cn } from "@/lib/cn";
import { BigButton } from "@/components/ui/BigButton";
import { CrystalCard } from "@/components/ui/CrystalCard";
import { CheckMark } from "@/components/ui/CheckMark";
import { ActivityShell } from "./ActivityShell";
import type { ActiviteProps } from "./types";

type Confiance = "memoire" | "recherche" | "les_deux";

const OPTIONS: { id: Confiance; label: string }[] = [
  { id: "memoire", label: "Le cerveau-mémoire" },
  { id: "recherche", label: "Le cerveau-recherche" },
  { id: "les_deux", label: "Les deux se valent ici" },
];

type Question = ActiviteDeuxCerveaux["donnees"]["questions"][number];

function BlocCerveau({
  titre,
  sousTitre,
  reponse,
  sources,
}: {
  titre: string;
  sousTitre: string;
  reponse: { texte: string; note: string; dateRecolte: string };
  sources?: string[];
}) {
  return (
    <section className="rounded-carte border-2 border-encre bg-carte p-4">
      <p className="text-sm font-bold uppercase tracking-wide text-encre-douce">{titre}</p>
      <p className="mb-2 text-sm text-encre-douce">{sousTitre}</p>
      <p className="text-lg">{reponse.texte}</p>
      {sources && sources.length > 0 ? (
        <p className="mt-2 text-sm">
          <span className="font-semibold">Sources : </span>
          {sources.map((url, i) => (
            <span key={url}>
              {i > 0 ? " · " : null}
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-eau decoration-2 underline-offset-2"
              >
                {url.replace(/^https?:\/\//, "")}
                <span className="sr-only"> (s'ouvre dans un nouvel onglet)</span>
              </a>
            </span>
          ))}
        </p>
      ) : null}
      <p className="mt-2 text-xs text-encre-douce">
        {reponse.note} · relevé en {reponse.dateRecolte}
      </p>
    </section>
  );
}

export function DeuxCerveauxActivity({ activite, onTermine }: ActiviteProps<ActiviteDeuxCerveaux>) {
  const donnees = activite.donnees;
  const [idx, setIdx] = useState(0);
  const [choix, setChoix] = useState<Confiance | null>(null);
  const [phase, setPhase] = useState<"questions" | "cristallisation">("questions");

  const question: Question | undefined = donnees.questions[idx];

  function suivante() {
    if (idx < donnees.questions.length - 1) {
      setIdx((i) => i + 1);
      setChoix(null);
    } else {
      setPhase("cristallisation");
    }
  }

  /* --------------------------- cristallisation -------------------------- */
  if (phase === "cristallisation" || !question) {
    return (
      <ActivityShell notion={activite.notion} dureeMin={activite.dureeMin} etape="Bilan">
        <h1 className="mb-4 font-titre text-2xl font-bold">Mémoire ou recherche ?</h1>
        <p className="mb-5 text-base text-encre-douce">
          Le bon réflexe dans la vraie vie : repérer si l'IA a cherché — sources citées, dates,
          mention « je recherche ».
        </p>
        <CrystalCard>{activite.phraseCristallisation}</CrystalCard>
        <div className="mt-6">
          <BigButton onClick={() => onTermine({})}>Recevoir mon tampon</BigButton>
        </div>
      </ActivityShell>
    );
  }

  /* ------------------------------ questions ----------------------------- */
  const aligne = choix !== null && choix === question.confiance;

  return (
    <ActivityShell
      notion={activite.notion}
      dureeMin={activite.dureeMin}
      etape={`Question ${idx + 1} / ${donnees.questions.length}`}
    >
      <p className="mb-4 rounded-carte border-2 border-papier-profond bg-papier px-4 py-3 text-sm">
        <span className="font-semibold">Réglage affiché : </span>
        {donnees.reglage}
      </p>

      <h1 className="mb-4 font-titre text-xl font-bold">{question.question}</h1>

      {/* Blocs empilés (jamais côte-à-côte serré) : mobile + lecteur d'écran. */}
      <div className="flex flex-col gap-3">
        <BlocCerveau
          titre="Cerveau-mémoire"
          sousTitre="recherche coupée"
          reponse={question.reponseMemoire}
        />
        <BlocCerveau
          titre="Cerveau-recherche"
          sousTitre="recherche activée"
          reponse={question.reponseRecherche}
          sources={question.reponseRecherche.sources}
        />
      </div>

      <p className="mb-3 mt-6 font-titre text-lg font-bold">À quel cerveau fais-tu confiance ici ?</p>
      <div className="flex flex-col gap-3">
        {OPTIONS.map((o) => (
          <BigButton
            key={o.id}
            variante="secondaire"
            className={cn(
              "w-full justify-start text-left",
              choix === o.id && (o.id === question.confiance ? "border-foret" : "border-ocre"),
            )}
            disabled={choix !== null && choix !== o.id}
            aria-pressed={choix === o.id}
            onClick={() => setChoix(o.id)}
          >
            {o.label}
          </BigButton>
        ))}
      </div>

      {choix ? (
        <div
          aria-live="polite"
          className={cn(
            "mt-5 rounded-carte border-2 bg-carte p-4 text-lg",
            aligne ? "border-foret" : "border-ocre",
          )}
        >
          <p className="mb-1 inline-flex items-center gap-2 font-titre font-bold">
            {aligne ? <CheckMark taille={16} /> : null}
            {aligne ? "Bon réflexe." : "Regardons ensemble."}
          </p>
          <p>{question.feedback}</p>
        </div>
      ) : null}

      {choix ? (
        <div className="mt-6">
          <BigButton onClick={suivante}>
            {idx < donnees.questions.length - 1 ? "Question suivante" : "Voir ce que j'ai compris"}
          </BigButton>
        </div>
      ) : null}
    </ActivityShell>
  );
}
