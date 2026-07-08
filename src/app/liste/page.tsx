"use client";

import Link from "next/link";
import { parcours } from "@/content";
import { cn } from "@/lib/cn";
import { useProgress } from "@/lib/progress-context";
import { statutEtape, type StatutEtape } from "@/lib/progression";
import { AppHeader } from "@/components/AppHeader";
import { CheckMark } from "@/components/ui/CheckMark";

const libelleStatut: Record<StatutEtape, string> = {
  termine: "Terminé",
  courante: "À toi de jouer",
  avenir: "À venir",
};

const styleStatut: Record<StatutEtape, string> = {
  termine: "border-foret text-foret",
  courante: "border-rouge-gr text-rouge-gr",
  avenir: "border-encre-douce text-encre-douce",
};

export default function ListePage() {
  const { etat } = useProgress();

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-2xl px-4 pb-16 pt-6">
        <h1 className="mb-1 font-titre text-3xl font-bold">Le parcours, en liste</h1>
        <p className="mb-8 text-base text-encre-douce">
          Même contenu que la carte, présenté simplement. Le voyage suit l'ordre des étapes.
        </p>

        {parcours.territoires.map((territoire) => (
          <section key={territoire.id} className="mb-8">
            <h2 className="font-titre text-xl font-bold">{territoire.nom}</h2>
            <p className="mb-3 text-sm text-encre-douce">{territoire.sousTitre}</p>
            <ol className="flex flex-col gap-2">
              {territoire.etapes.map((etape) => {
                const statut = statutEtape(etat, etape.id);
                const accessible = statut !== "avenir";
                const contenu = (
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2">
                      <span className="text-sm font-bold text-encre-douce tabular-nums">
                        {etape.ordre}.
                      </span>
                      <span className="text-lg font-semibold">{etape.titre}</span>
                    </span>
                    <span
                      className={cn(
                        "inline-flex shrink-0 items-center gap-1 rounded-full border-2 px-3 py-1 text-sm font-bold",
                        styleStatut[statut],
                      )}
                    >
                      {statut === "termine" ? <CheckMark taille={14} /> : null}
                      {libelleStatut[statut]}
                    </span>
                  </div>
                );

                return (
                  <li key={etape.id}>
                    {accessible ? (
                      <Link
                        href={`/etape/${etape.id}`}
                        className="block rounded-carte border-2 border-encre bg-carte px-4 py-3 shadow-carte hover:-translate-y-0.5"
                      >
                        {contenu}
                      </Link>
                    ) : (
                      <div className="rounded-carte border-2 border-dashed border-papier-profond bg-carte/60 px-4 py-3 opacity-80">
                        {contenu}
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </main>
    </>
  );
}
