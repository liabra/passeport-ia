import Link from "next/link";
import type { ReactNode } from "react";
import { Blaze } from "@/components/ui/Blaze";

interface ActivityShellProps {
  notion: string;
  dureeMin: number;
  /** Progression interne de l'activité, ex. « Manche 2 / 4 ». */
  etape?: string;
  children: ReactNode;
}

/** Cadre commun aux activités : en-tête léger + sortie vers la carte. */
export function ActivityShell({ notion, dureeMin, etape, children }: ActivityShellProps) {
  return (
    <div className="min-h-dvh">
      <header className="border-b-2 border-papier-profond bg-papier/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-3">
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg px-2 text-base font-semibold text-encre hover:underline"
          >
            <Blaze taille={20} />
            <span aria-hidden>Quitter</span>
            <span className="sr-only">Quitter et revenir à la carte</span>
          </Link>
          <p className="text-right text-sm font-semibold text-encre-douce">
            {etape ? <span className="mr-2">{etape}</span> : null}
            <span className="whitespace-nowrap">≈ {dureeMin} min</span>
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 pb-16 pt-6">
        <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-encre-douce">
          {notion}
        </p>
        {children}
      </main>
    </div>
  );
}
