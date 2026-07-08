"use client";

import { useState, type DragEvent } from "react";
import type { ActiviteRenard, RenardCategorie, RenardItem } from "@/content/schema";
import { nombreErreurs, trier, type ResultatTest } from "@/lib/renard";
import { cn } from "@/lib/cn";
import { BigButton } from "@/components/ui/BigButton";
import { CrystalCard } from "@/components/ui/CrystalCard";
import { CheckMark } from "@/components/ui/CheckMark";
import { ActivityShell } from "./ActivityShell";
import { FruitVisuel } from "./FruitVisuel";
import type { ActiviteProps } from "./types";

const LIBELLE_CAT: Record<RenardCategorie, string> = {
  mur: "mûr",
  pas_mur: "pas mûr",
};

function Croix({ taille = 18, className }: { taille?: number; className?: string }) {
  return (
    <svg
      width={taille}
      height={taille}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

type Phase = "mission" | "jeu" | "cristallisation" | "verification";

export function RenardActivity({ activite, onTermine }: ActiviteProps<ActiviteRenard>) {
  const donnees = activite.donnees;
  const [phase, setPhase] = useState<Phase>("mission");
  const [numeroPhase, setNumeroPhase] = useState<1 | 2>(1);
  const [sousEtape, setSousEtape] = useState<"pose" | "resultats">("pose");
  const [assignations, setAssignations] = useState<Record<string, RenardCategorie>>({});
  const [resultats, setResultats] = useState<ResultatTest[] | null>(null);
  const [annonce, setAnnonce] = useState("");
  const [verifId, setVerifId] = useState<string | null>(null);

  const exemples = numeroPhase === 1 ? donnees.exemplesPhase1 : donnees.exemplesPhase2;
  const nbAssignes = Object.keys(assignations).length;
  const tousAssignes = nbAssignes === exemples.length;

  const nonAssignes = exemples.filter((e) => !(e.id in assignations));
  const parCategorie = (cat: RenardCategorie) =>
    exemples.filter((e) => assignations[e.id] === cat);

  function montrer(item: RenardItem, cat: RenardCategorie) {
    setAssignations((prev) => ({ ...prev, [item.id]: cat }));
    setAnnonce(`${item.libelle} montré comme ${LIBELLE_CAT[cat]}.`);
  }

  function retirer(item: RenardItem) {
    setAssignations((prev) => {
      const suivant = { ...prev };
      delete suivant[item.id];
      return suivant;
    });
    setAnnonce(`${item.libelle} retiré de la besace.`);
  }

  function lancerTest() {
    const besace = exemples.map((e) => ({
      attributs: e.attributs,
      categorie: assignations[e.id]!,
    }));
    const res = trier(donnees.test, besace);
    setResultats(res);
    setSousEtape("resultats");
    const erreurs = nombreErreurs(res);
    setAnnonce(
      erreurs === 0
        ? "Le renard a tout rangé correctement."
        : `Le renard a fait ${erreurs} erreur${erreurs > 1 ? "s" : ""} sur ${res.length}.`,
    );
  }

  function phaseSuivante() {
    setNumeroPhase(2);
    setAssignations({});
    setResultats(null);
    setSousEtape("pose");
    setAnnonce("");
  }

  function onDrop(e: DragEvent<HTMLDivElement>, cat: RenardCategorie) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    const item = exemples.find((x) => x.id === id);
    if (item) montrer(item, cat);
  }

  /* ------------------------------- mission ------------------------------ */
  if (phase === "mission") {
    return (
      <ActivityShell notion={activite.notion} dureeMin={activite.dureeMin} etape="Mission">
        <h1 className="mb-4 font-titre text-2xl font-bold">Voici Renard</h1>
        <p className="mb-3 text-lg">
          Renard est une petite IA curieuse. Il ne connaît rien aux fruits. Pour qu'il apprenne à
          reconnaître un fruit mûr, tu ne vas pas le régler : tu vas lui{" "}
          <strong>montrer des exemples</strong>.
        </p>
        <p className="mb-6 text-base text-encre-douce">
          Deux essais : d'abord avec très peu d'exemples, puis avec beaucoup plus. Observe ce qui
          change.
        </p>
        <BigButton onClick={() => setPhase("jeu")}>Commencer</BigButton>
      </ActivityShell>
    );
  }

  /* -------------------------------- jeu --------------------------------- */
  if (phase === "jeu") {
    return (
      <ActivityShell
        notion={activite.notion}
        dureeMin={activite.dureeMin}
        etape={`Phase ${numeroPhase} / 2`}
      >
        {/* Région live commune. */}
        <p aria-live="polite" className="sr-only">
          {annonce}
        </p>

        {sousEtape === "pose" ? (
          <>
            <h1 className="mb-2 font-titre text-xl font-bold">
              {numeroPhase === 1
                ? "Montre 2 exemples à Renard"
                : "Cette fois, montre-lui 8 exemples variés"}
            </h1>
            <p className="mb-4 text-base text-encre-douce">
              Range chaque fruit du bon côté (bouton ou glisser-déposer). Montrés :{" "}
              <strong>
                {nbAssignes} / {exemples.length}
              </strong>
            </p>

            {nonAssignes.length > 0 ? (
              <ul className="mb-6 flex flex-col gap-3">
                {nonAssignes.map((item) => (
                  <li
                    key={item.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("text/plain", item.id)}
                    className="flex flex-wrap items-center gap-3 rounded-carte border-2 border-encre bg-carte p-3 shadow-carte"
                  >
                    <FruitVisuel attributs={item.attributs} />
                    <span className="min-w-[8rem] flex-1 text-base font-semibold">
                      {item.libelle}
                    </span>
                    <div className="flex gap-2">
                      <BigButton
                        variante="secondaire"
                        className="min-h-[44px] px-4 py-2 text-base"
                        onClick={() => montrer(item, "mur")}
                      >
                        Montrer comme mûr
                      </BigButton>
                      <BigButton
                        variante="secondaire"
                        className="min-h-[44px] px-4 py-2 text-base"
                        onClick={() => montrer(item, "pas_mur")}
                      >
                        Montrer comme pas mûr
                      </BigButton>
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}

            {/* Besace du renard : deux zones (aussi cibles de dépôt). */}
            <div className="grid grid-cols-2 gap-3">
              {(["mur", "pas_mur"] as const).map((cat) => (
                <div
                  key={cat}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => onDrop(e, cat)}
                  className="rounded-carte border-2 border-dashed border-encre-douce bg-papier p-3"
                >
                  <p className="mb-2 text-sm font-bold uppercase tracking-wide text-encre-douce">
                    Besace « {LIBELLE_CAT[cat]} »
                  </p>
                  <ul className="flex flex-col gap-2">
                    {parCategorie(cat).map((item) => (
                      <li key={item.id} className="flex items-center gap-2">
                        <FruitVisuel attributs={item.attributs} taille={36} />
                        <span className="flex-1 text-sm font-semibold">{item.libelle}</span>
                        <button
                          type="button"
                          onClick={() => retirer(item)}
                          className="min-h-[44px] rounded-lg px-2 text-sm font-semibold text-rouge-gr hover:underline"
                        >
                          Retirer
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <BigButton disabled={!tousAssignes} onClick={lancerTest}>
                {tousAssignes ? "Lancer le test" : `Montre les ${exemples.length} exemples`}
              </BigButton>
            </div>
          </>
        ) : (
          <>
            <h1 className="mb-4 font-titre text-xl font-bold">
              Le renard trie {donnees.test.length} nouveaux fruits
            </h1>
            <ul className="flex flex-col gap-2" aria-live="polite">
              {resultats?.map(({ item, predite, correcte }) => (
                <li
                  key={item.id}
                  className={cn(
                    "flex items-center gap-3 rounded-carte border-2 bg-carte p-3",
                    correcte ? "border-foret" : "border-rouge-gr",
                  )}
                >
                  <FruitVisuel attributs={item.attributs} taille={44} />
                  <span className="flex-1 text-base font-semibold">{item.libelle}</span>
                  <span className="text-right text-sm">
                    <span className="block text-encre-douce">Renard : {LIBELLE_CAT[predite]}</span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 font-bold",
                        correcte ? "text-foret" : "text-rouge-gr",
                      )}
                    >
                      {correcte ? <CheckMark taille={14} /> : <Croix taille={14} />}
                      {correcte ? "correct" : "erreur"}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-5 rounded-carte border-2 border-papier-profond bg-papier p-4 text-lg">
              {numeroPhase === 1 ? donnees.revelationPhase1 : donnees.revelationPhase2}
            </p>

            <div className="mt-6">
              {numeroPhase === 1 ? (
                <BigButton onClick={phaseSuivante}>Donner plus d'exemples au renard</BigButton>
              ) : (
                <BigButton onClick={() => setPhase("cristallisation")}>
                  Voir ce que j'ai compris
                </BigButton>
              )}
            </div>
          </>
        )}
      </ActivityShell>
    );
  }

  /* --------------------------- cristallisation -------------------------- */
  if (phase === "cristallisation") {
    return (
      <ActivityShell notion={activite.notion} dureeMin={activite.dureeMin} etape="Bilan">
        <h1 className="mb-4 font-titre text-2xl font-bold">La même IA, deux résultats</h1>
        <p className="mb-5 text-base text-encre-douce">
          Tu n'as touché à aucun réglage. Seuls les exemples ont changé — et le renard est passé de
          raté à réussi.
        </p>
        <CrystalCard>{activite.phraseCristallisation}</CrystalCard>
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
