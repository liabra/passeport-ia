import type { Etape, Territoire } from "@/content/schema";
import { BigLink } from "@/components/ui/BigButton";
import { Stamp, type CouleurTampon } from "@/components/ui/Stamp";
import type { ResultatActivite } from "./types";

interface TamponScreenProps {
  etape: Etape;
  territoire?: Territoire;
  phraseCristallisation: string;
  resultat: ResultatActivite;
}

/** Écran de récompense : page de passeport, tampon animé, rang, cristallisation. */
export function TamponScreen({
  etape,
  territoire,
  phraseCristallisation,
  resultat,
}: TamponScreenProps) {
  const couleur: CouleurTampon = territoire?.couleur ?? "rouge-gr";
  const pont = etape.pontVersLeReel;

  return (
    <div className="min-h-dvh">
      <main className="mx-auto max-w-2xl px-4 py-10">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-encre-douce">
          Tampon obtenu
        </p>
        <h1 className="mb-8 text-center font-titre text-3xl font-bold">{etape.titre}</h1>

        {/* « Page de passeport » sur laquelle le tampon claque. */}
        <div className="mx-auto flex max-w-sm justify-center rounded-carte border-2 border-papier-profond bg-carte p-10 shadow-carte">
          <Stamp
            titre={territoire?.nom ?? "Passeport IA"}
            sousTitre={`Étape ${etape.ordre}`}
            couleur={couleur}
            animer
          />
        </div>

        {resultat.rang ? (
          <p className="mt-6 text-center text-lg">
            Rang obtenu :{" "}
            <span className="font-bold text-rouge-gr">{resultat.rang}</span>
          </p>
        ) : null}

        <p className="mx-auto mt-6 max-w-md text-center text-xl leading-relaxed">
          {phraseCristallisation}
        </p>

        {/* Pont vers le réel : présenté après la récompense, comme une sortie du jeu. */}
        {pont ? (
          <aside className="mx-auto mt-10 max-w-md rounded-carte border-2 border-eau bg-carte p-5">
            <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-eau">
              Pour aller plus loin — hors du jeu
            </p>
            <a
              href={pont.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold text-encre underline decoration-eau decoration-2 underline-offset-4"
            >
              {pont.libelle}
              <span className="sr-only"> (s'ouvre dans un nouvel onglet)</span>
            </a>
          </aside>
        ) : null}

        <div className="mx-auto mt-10 flex max-w-md flex-col gap-3">
          <BigLink href="/">Revenir à la carte</BigLink>
          <BigLink href="/passeport" variante="secondaire">
            Voir mon passeport
          </BigLink>
        </div>
      </main>
    </div>
  );
}
