"use client";

import { useMemo, useState } from "react";
import type { ActivitePerroquet } from "@/content/schema";
import { cn } from "@/lib/cn";
import { BigButton } from "@/components/ui/BigButton";
import { CrystalCard } from "@/components/ui/CrystalCard";
import { ActivityShell } from "./ActivityShell";
import type { ActiviteProps } from "./types";

type Manche = ActivitePerroquet["donnees"]["manches"][number];
type Option = Manche["options"][number];

const CAPTION_ILLUSTRATIF = "Répartitions illustratives — corpus réel documenté à venir";

function optionFavorite(manche: Manche): Option {
  return manche.options.reduce((a, b) => (b.pourcentage > a.pourcentage ? b : a));
}

/** Rend la phrase à trou, en remplissant le trou une fois le mot choisi. */
function PhraseATrou({ phrase, mot }: { phrase: string; mot: string | null }) {
  const [avant = "", apres = ""] = phrase.split("___");
  return (
    <p className="text-2xl leading-relaxed">
      {avant}
      <span
        className={cn(
          "mx-1 inline-block min-w-[4ch] rounded-md border-b-4 px-2 text-center font-bold",
          mot ? "border-rouge-gr text-rouge-gr" : "border-encre-douce text-transparent",
        )}
      >
        {mot ?? "____"}
      </span>
      {apres}
    </p>
  );
}

function Repartition({
  manche,
  choixId,
}: {
  manche: Manche;
  choixId: string;
}) {
  const favori = optionFavorite(manche);
  return (
    <div aria-live="polite">
      <ul className="flex flex-col gap-2">
        {manche.options.map((opt) => {
          const estChoix = opt.id === choixId;
          const estFavori = opt.id === favori.id;
          return (
            <li key={opt.id}>
              <div className="mb-1 flex items-baseline justify-between text-base">
                <span className={cn("font-semibold", estChoix && "text-rouge-gr")}>
                  {opt.mot}
                  {estChoix ? " — votre pari" : null}
                </span>
                <span className="font-bold tabular-nums">{opt.pourcentage}%</span>
              </div>
              <div className="h-4 w-full overflow-hidden rounded-full bg-papier-profond">
                <div
                  className={cn(
                    "h-full rounded-full animate-barre-remplir",
                    estFavori ? "bg-foret" : "bg-eau",
                  )}
                  style={{ ["--barre-target" as string]: `${opt.pourcentage}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-sm italic text-encre-douce">{CAPTION_ILLUSTRATIF}</p>
    </div>
  );
}

export function PerroquetActivity({ activite, onTermine }: ActiviteProps<ActivitePerroquet>) {
  const manches = activite.donnees.manches;
  const [idx, setIdx] = useState(0);
  const [choix, setChoix] = useState<string | null>(null);
  const [veriteVue, setVeriteVue] = useState(false);
  const [accord, setAccord] = useState(0);
  const [phase, setPhase] = useState<"manches" | "bilan" | "verification">("manches");
  const [verifId, setVerifId] = useState<string | null>(null);

  const manche = manches[idx]!;
  const favori = useMemo(() => optionFavorite(manche), [manche]);
  const suitLaFoule = choix === favori.id;

  function choisir(optId: string) {
    if (choix) return;
    setChoix(optId);
    if (optId === favori.id) setAccord((a) => a + 1);
  }

  function continuerManche() {
    if (idx < manches.length - 1) {
      setIdx((i) => i + 1);
      setChoix(null);
      setVeriteVue(false);
    } else {
      setPhase("bilan");
    }
  }

  const kindLabel: Record<Manche["kind"], string> = {
    echauffement: "Échauffement",
    ambiguite: "Quand plusieurs mots sont possibles",
    piege: "Le piège : le plus fréquent n'est pas le vrai",
    invente: "Un mot qui n'existe pas",
  };

  /* --------------------------- phase : manches --------------------------- */
  if (phase === "manches") {
    const estPiege = manche.kind === "piege" && manche.verite;
    const attendVerite = estPiege && !veriteVue;
    return (
      <ActivityShell
        notion={activite.notion}
        dureeMin={activite.dureeMin}
        etape={`Manche ${idx + 1} / ${manches.length}`}
      >
        <h1 className="mb-4 font-titre text-xl font-bold">{kindLabel[manche.kind]}</h1>
        <p className="mb-2 text-base text-encre-douce">
          Vous êtes l'IA. Pariez sur le mot qui vient ensuite.
        </p>
        <div className="rounded-carte border-2 border-encre bg-carte p-5 shadow-carte">
          <PhraseATrou phrase={manche.phrase} mot={choix ? mancheMot(manche, choix) : null} />
        </div>

        {!choix ? (
          <div className="mt-5 flex flex-col gap-3">
            {manche.options.map((opt) => (
              <BigButton
                key={opt.id}
                variante="secondaire"
                className="w-full justify-start text-left"
                onClick={() => choisir(opt.id)}
              >
                {opt.mot}
              </BigButton>
            ))}
          </div>
        ) : (
          <div className="mt-5 flex flex-col gap-4">
            <Repartition manche={manche} choixId={choix} />

            <p className="rounded-carte border-2 border-papier-profond bg-papier p-4 text-lg">
              {manche.reveleTexte}
            </p>

            {estPiege && veriteVue && manche.verite ? (
              <div className="rounded-carte border-2 border-rouge-gr bg-carte p-4">
                <p className="mb-2 font-titre text-lg font-bold text-rouge-gr">
                  La vérité, elle, dit autre chose
                </p>
                <p className="mb-3 text-lg">{manche.verite.texte}</p>
                <p className="text-base font-semibold">
                  {suitLaFoule
                    ? manche.verite.messageSuiviFoule
                    : manche.verite.messageContreFoule}
                </p>
              </div>
            ) : null}

            {attendVerite ? (
              <BigButton onClick={() => setVeriteVue(true)}>Et la vérité ?</BigButton>
            ) : (
              <BigButton onClick={continuerManche}>
                {idx < manches.length - 1 ? "Manche suivante" : "Voir mon bilan"}
              </BigButton>
            )}
          </div>
        )}
      </ActivityShell>
    );
  }

  /* ---------------------------- phase : bilan ---------------------------- */
  if (phase === "bilan") {
    return (
      <ActivityShell notion={activite.notion} dureeMin={activite.dureeMin} etape="Bilan">
        <h1 className="mb-4 font-titre text-2xl font-bold">Bilan du perroquet</h1>
        <p className="mb-5 text-xl">
          Accord avec la foule :{" "}
          <span className="font-bold text-rouge-gr">
            {accord}/{manches.length}
          </span>
        </p>
        <p className="mb-5 text-base text-encre-douce">
          Ce score compte des points de <em>probabilité</em>, jamais de vérité : il mesure à quel
          point vos paris ont suivi le mot le plus fréquent.
        </p>
        <CrystalCard>{activite.phraseCristallisation}</CrystalCard>
        <div className="mt-6">
          <BigButton onClick={() => setPhase("verification")}>
            Vérifier ce que j'ai compris
          </BigButton>
        </div>
      </ActivityShell>
    );
  }

  /* ------------------------- phase : vérification ------------------------ */
  const verification = activite.donnees.verification;
  const choixVerif = verification.choix.find((c) => c.id === verifId) ?? null;
  return (
    <ActivityShell notion={activite.notion} dureeMin={activite.dureeMin} etape="Vérification">
      <h1 className="mb-4 font-titre text-xl font-bold">{verification.question}</h1>
      <div className="flex flex-col gap-3">
        {verification.choix.map((c) => (
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
            "mt-5 rounded-carte border-2 p-4 text-lg",
            choixVerif.correct ? "border-foret bg-carte" : "border-ocre bg-carte",
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
          <BigButton onClick={() => onTermine({ meta: { accordFoule: `${accord}/${manches.length}` } })}>
            Recevoir mon tampon
          </BigButton>
        </div>
      ) : null}
    </ActivityShell>
  );
}

function mancheMot(manche: Manche, optId: string): string {
  return manche.options.find((o) => o.id === optId)?.mot ?? "";
}
