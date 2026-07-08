"use client";

import Link from "next/link";
import { etapes, getTerritoireDeEtape } from "@/content";
import { genererChemin } from "@/lib/chemin";
import { cn } from "@/lib/cn";
import { useProgress } from "@/lib/progress-context";
import { etapeCouranteId, nombreTampons, statutEtape } from "@/lib/progression";
import { BigLink } from "@/components/ui/BigButton";
import { Blaze } from "@/components/ui/Blaze";

const chemin = genererChemin(etapes.length);

export function MapView() {
  const { etat } = useProgress();
  const couranteId = etapeCouranteId(etat);
  const territoireCourant = getTerritoireDeEtape(couranteId);
  const etapeCourante = etapes.find((e) => e.id === couranteId);
  const tousTermines = nombreTampons(etat) >= etapes.length;

  return (
    <main className="mx-auto max-w-3xl px-4 pb-40 pt-6">
      <h1 className="sr-only">Carte du voyage</h1>

      <p className="text-center text-sm font-semibold uppercase tracking-widest text-encre-douce">
        Territoire en cours
      </p>
      <p className="mb-6 text-center font-titre text-2xl font-bold text-encre">
        {territoireCourant ? territoireCourant.nom : "Le Noyau citoyen"}
      </p>

      <div
        className="relative mx-auto w-full max-w-sm"
        style={{ aspectRatio: `${chemin.largeur} / ${chemin.hauteur}` }}
      >
        <svg
          viewBox={`0 0 ${chemin.largeur} ${chemin.hauteur}`}
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d={chemin.d}
            fill="none"
            stroke="#C9AE79"
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray="2 14"
            opacity={0.9}
          />
        </svg>

        {etapes.map((etape, i) => {
          const point = chemin.points[i]!;
          const statut = statutEtape(etat, etape.id);
          const style = {
            left: `${(point.x / chemin.largeur) * 100}%`,
            top: `${(point.y / chemin.hauteur) * 100}%`,
          };
          const libelle = `Étape ${etape.ordre} : ${etape.titre}`;

          if (statut === "avenir") {
            return (
              <span
                key={etape.id}
                style={style}
                aria-label={`${libelle} — à venir`}
                className="absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-dashed border-encre-douce/70 bg-carte/60 text-sm font-bold text-encre-douce"
              >
                {etape.ordre}
              </span>
            );
          }

          const estCourante = statut === "courante";
          return (
            <Link
              key={etape.id}
              href={`/etape/${etape.id}`}
              style={style}
              aria-current={estCourante ? "step" : undefined}
              aria-label={estCourante ? `${libelle} — à toi de jouer` : `${libelle} — terminée, rejouer`}
              className={cn(
                "absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full",
                estCourante
                  ? "h-12 w-12 border-[3px] border-encre bg-rouge-gr text-carte shadow-dure animate-pulse-doux"
                  : "h-10 w-10 border-2 border-foret bg-carte shadow-carte",
              )}
            >
              {estCourante ? (
                <span aria-hidden className="font-titre text-lg font-bold">
                  {etape.ordre}
                </span>
              ) : (
                <Blaze taille={16} />
              )}
            </Link>
          );
        })}
      </div>

      {/* Carte du bas « Prochaine étape » : un seul chemin, un seul bouton. */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-papier-profond bg-carte/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-4">
          {tousTermines ? (
            <>
              <p className="font-titre text-lg font-bold">Voyage terminé — bravo.</p>
              <BigLink href="/passeport">Voir mon passeport</BigLink>
            </>
          ) : (
            <>
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-encre-douce">
                  Prochaine étape
                </p>
                <p className="font-titre text-lg font-bold text-encre">
                  {etapeCourante ? etapeCourante.titre : "—"}
                </p>
              </div>
              <BigLink href={couranteId ? `/etape/${couranteId}` : "/"}>Continuer</BigLink>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
