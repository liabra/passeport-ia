"use client";

import { useMemo, useState } from "react";
import type { ActiviteIntrus } from "@/content/schema";
import { BigButton } from "@/components/ui/BigButton";
import { CrystalCard } from "@/components/ui/CrystalCard";
import { CheckMark } from "@/components/ui/CheckMark";
import { ActivityShell } from "./ActivityShell";
import type { ActiviteProps } from "./types";

type Part = ActiviteIntrus["donnees"]["reponse"]["parts"][number];
type Detail = Extract<Part, { kind: "detail" }>;

interface Resolution {
  rang: string;
  detailId: string;
  message: string;
}

function estDetail(p: Part): p is Detail {
  return p.kind === "detail";
}

/** Surligne le passage pertinent à l'intérieur de l'extrait. */
function ExtraitSurligne({ extrait, surligne }: { extrait: string; surligne: string }) {
  const i = extrait.indexOf(surligne);
  if (i < 0) return <>{extrait}</>;
  return (
    <>
      {extrait.slice(0, i)}
      <mark className="rounded bg-ocre/60 px-1 text-encre">{surligne}</mark>
      {extrait.slice(i + surligne.length)}
    </>
  );
}

export function IntrusActivity({ activite, onTermine }: ActiviteProps<ActiviteIntrus>) {
  const parts = activite.donnees.reponse.parts;
  const details = useMemo(() => parts.filter(estDetail), [parts]);
  const idsVrais = useMemo(() => details.filter((d) => !d.invente).map((d) => d.id), [details]);

  const [innocentes, setInnocentes] = useState<string[]>([]);
  const [verifications, setVerifications] = useState(0);
  const [ouvert, setOuvert] = useState<string | null>(null);
  const [vueEncyclo, setVueEncyclo] = useState(false);
  const [resolution, setResolution] = useState<Resolution | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const detailOuvert = details.find((d) => d.id === ouvert) ?? null;
  const tousVraisInnocentes = idsVrais.every((id) => innocentes.includes(id));

  function ouvrir(id: string) {
    setOuvert(id);
    setVueEncyclo(false);
    setNote(null);
  }

  function fermer() {
    setOuvert(null);
    setVueEncyclo(false);
  }

  function verifier() {
    setVerifications((n) => n + 1);
    setVueEncyclo(true);
  }

  function innocenter(d: Detail) {
    setInnocentes((prev) => (prev.includes(d.id) ? prev : [...prev, d.id]));
    fermer();
    setNote(`« ${d.texte} » : vérifié et confirmé. Détail innocenté.`);
  }

  function accuserPreuve(d: Detail) {
    setResolution({
      rang: "Enquêteur",
      detailId: d.id,
      message:
        "Accusation prouvée, l'Encyclopédie à l'appui. Vous avez démasqué le détail inventé par la méthode.",
    });
    fermer();
  }

  function accuserPoker(d: Detail) {
    if (d.invente) {
      if (tousVraisInnocentes) {
        setResolution({
          rang: "Enquêteur par élimination",
          detailId: d.id,
          message:
            "Tous les autres détails étaient vérifiés : il ne pouvait rester que celui-ci. Résolu par élimination.",
        });
      } else {
        setResolution({
          rang: "Coup de poker",
          detailId: d.id,
          message:
            "Vous avez visé juste sans vérifier — un vrai coup de poker. La prochaine fois, l'Encyclopédie transforme la chance en preuve.",
        });
      }
      fermer();
    } else {
      // Poker raté : le détail était vrai. Retour doux, on le révèle et on continue.
      setInnocentes((prev) => (prev.includes(d.id) ? prev : [...prev, d.id]));
      fermer();
      setNote(
        `« ${d.texte} » était en fait exact. Pas de mal : on le raye de la liste et l'enquête continue.`,
      );
    }
  }

  /* ----------------------------- résolution ----------------------------- */
  if (resolution) {
    const coupable = details.find((d) => d.id === resolution.detailId);
    return (
      <ActivityShell notion={activite.notion} dureeMin={activite.dureeMin} etape="Enquête résolue">
        <h1 className="mb-2 font-titre text-2xl font-bold">Enquête résolue</h1>
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-foret bg-carte px-4 py-1 text-base font-bold text-foret">
          Rang : {resolution.rang}
        </p>
        <p className="mb-4 text-lg">{resolution.message}</p>
        {coupable ? (
          <p className="mb-5 rounded-carte border-2 border-rouge-gr bg-carte p-4 text-lg">
            Le détail inventé était : «&nbsp;{coupable.texte}&nbsp;».
          </p>
        ) : null}
        <p className="mb-5 text-base text-encre-douce">
          Méthode : {verifications} vérification(s) effectuée(s).
        </p>
        <CrystalCard>{activite.phraseCristallisation}</CrystalCard>
        <div className="mt-6">
          <BigButton
            onClick={() =>
              onTermine({
                rang: resolution.rang,
                meta: { verifications, methode: `${verifications} vérification(s)` },
              })
            }
          >
            Recevoir mon tampon
          </BigButton>
        </div>
      </ActivityShell>
    );
  }

  /* ------------------------------ enquête ------------------------------- */
  return (
    <ActivityShell notion={activite.notion} dureeMin={activite.dureeMin} etape="Enquête">
      <h1 className="mb-3 font-titre text-xl font-bold">Un détail est inventé. Lequel ?</h1>

      <p className="mb-3 rounded-carte border-2 border-papier-profond bg-papier px-4 py-3 text-sm">
        <span className="font-semibold">Réglage affiché :</span> {activite.donnees.reglage}
      </p>

      {/* La réponse de l'IA, détails touchables. */}
      <div className="rounded-carte border-2 border-encre bg-carte p-5 text-xl leading-relaxed shadow-carte">
        {parts.map((p, i) => {
          if (p.kind === "texte") return <span key={i}>{p.texte}</span>;
          const clos = innocentes.includes(p.id);
          if (clos) {
            return (
              <span
                key={p.id}
                className="mx-0.5 inline-flex items-center gap-1 rounded bg-foret/15 px-1 font-semibold text-foret"
              >
                <CheckMark taille={16} />
                {p.texte}
              </span>
            );
          }
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => ouvrir(p.id)}
              className="mx-0.5 rounded border-b-2 border-dashed border-rouge-gr px-0.5 font-semibold text-rouge-gr hover:bg-rouge-gr/10"
            >
              {p.texte}
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-base text-encre-douce">
        Méthode : {verifications} vérification(s) effectuée(s).
      </p>

      {note ? (
        <p
          aria-live="polite"
          className="mt-3 rounded-carte border-2 border-foret bg-carte p-4 text-base"
        >
          {note}
        </p>
      ) : null}

      {tousVraisInnocentes ? (
        <p className="mt-4 rounded-carte border-2 border-ocre bg-carte p-4 text-base font-semibold">
          Il ne reste qu'un détail non vérifié. À vous de conclure.
        </p>
      ) : null}

      {/* Panneau « bottom-sheet » de vérification. */}
      {detailOuvert ? (
        <div className="fixed inset-0 z-40 flex items-end justify-center">
          <button
            type="button"
            aria-label="Fermer le panneau"
            className="absolute inset-0 bg-encre/40"
            onClick={fermer}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Vérifier le détail"
            className="relative z-10 max-h-[85dvh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border-2 border-encre bg-papier p-5 shadow-dure"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <p className="text-lg font-bold">«&nbsp;{detailOuvert.texte}&nbsp;»</p>
              <button
                type="button"
                onClick={fermer}
                className="min-h-[44px] shrink-0 rounded-lg px-3 font-semibold text-encre-douce hover:underline"
              >
                Fermer
              </button>
            </div>

            {!vueEncyclo ? (
              <div className="flex flex-col gap-3">
                <BigButton onClick={verifier}>Vérifier dans l'Encyclopédie</BigButton>
                <BigButton variante="secondaire" onClick={() => accuserPoker(detailOuvert)}>
                  Accuser sans vérifier — coup de poker
                </BigButton>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <article className="rounded-carte border-2 border-eau bg-carte p-4">
                  <h2 className="mb-2 font-titre text-lg font-bold">
                    Encyclopédie — {detailOuvert.encyclopedie.article}
                  </h2>
                  <p className="text-lg leading-relaxed">
                    <ExtraitSurligne
                      extrait={detailOuvert.encyclopedie.extrait}
                      surligne={detailOuvert.encyclopedie.surligne}
                    />
                  </p>
                  <footer className="mt-3 border-t border-papier-profond pt-2 text-sm text-encre-douce">
                    Sources : {detailOuvert.encyclopedie.sources.join(" · ")}
                  </footer>
                </article>

                {detailOuvert.invente ? (
                  <>
                    <p className="text-base font-semibold text-rouge-gr">
                      L'Encyclopédie contredit ce détail.
                    </p>
                    <BigButton onClick={() => accuserPreuve(detailOuvert)}>
                      Accuser, preuve à l'appui
                    </BigButton>
                  </>
                ) : (
                  <>
                    <p className="text-base font-semibold text-foret">
                      L'Encyclopédie confirme ce détail.
                    </p>
                    <BigButton variante="secondaire" onClick={() => innocenter(detailOuvert)}>
                      Innocenter — c'est vérifié
                    </BigButton>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </ActivityShell>
  );
}
