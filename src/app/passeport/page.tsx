"use client";

import { etapes, territoiresActifs } from "@/content";
import { useProgress } from "@/lib/progress-context";
import { estTerminee, nombreTampons } from "@/lib/progression";
import { AppHeader } from "@/components/AppHeader";
import { BigButton } from "@/components/ui/BigButton";
import { Stamp } from "@/components/ui/Stamp";

// Petites rotations variées pour l'aspect « tamponné à la main ».
const rotations = [-8, 6, -4, 9, -6, 5];

export default function PasseportPage() {
  const { etat, reinitialiser } = useProgress();
  const total = etapes.length;
  const obtenus = nombreTampons(etat);

  function recommencer() {
    if (window.confirm("Effacer toute la progression et recommencer le voyage ?")) {
      void reinitialiser();
    }
  }

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-2xl px-4 pb-16 pt-6">
        <h1 className="mb-1 font-titre text-3xl font-bold">Mon passeport</h1>
        <p className="mb-8 text-lg text-encre-douce">
          <span className="font-bold text-encre">{obtenus}</span> tampon(s) sur {total}.
        </p>

        {territoiresActifs.map((territoire) => (
          <section key={territoire.id} className="mb-8">
            <h2 className="mb-3 font-titre text-xl font-bold">{territoire.nom}</h2>
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {territoire.etapes.map((etape, i) => {
                const fait = estTerminee(etat, etape.id);
                return (
                  <li
                    key={etape.id}
                    className="flex aspect-square flex-col items-center justify-center rounded-carte border-2 border-papier-profond bg-carte p-2 text-center"
                  >
                    {fait ? (
                      <Stamp
                        titre={territoire.nom}
                        sousTitre={`Étape ${etape.ordre}`}
                        couleur={territoire.couleur}
                        rotation={rotations[i % rotations.length]}
                        taille={104}
                      />
                    ) : (
                      <span className="flex h-[104px] w-[104px] items-center justify-center rounded-full border-2 border-dashed border-encre-douce/60 text-lg font-bold text-encre-douce/70">
                        {etape.ordre}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}

        <div className="mt-10 border-t-2 border-papier-profond pt-6">
          <BigButton variante="fantome" onClick={recommencer}>
            Recommencer le voyage
          </BigButton>
          <p className="mt-2 text-sm text-encre-douce">
            Efface la progression enregistrée sur cet appareil. Aucune donnée n'est envoyée ni
            conservée ailleurs.
          </p>
        </div>
      </main>
    </>
  );
}
