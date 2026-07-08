"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Blaze } from "./ui/Blaze";
import { cn } from "@/lib/cn";
import { useProgress } from "@/lib/progress-context";
import { nombreTampons } from "@/lib/progression";

const lienNav =
  "inline-flex min-h-[44px] items-center rounded-lg border-2 border-transparent px-3 py-2 text-base font-semibold text-encre hover:border-encre-douce";

export function AppHeader() {
  const { etat } = useProgress();
  const n = nombreTampons(etat);
  const chemin = usePathname() ?? "/";
  const surListe = chemin.startsWith("/liste");

  return (
    <header className="sticky top-0 z-30 border-b-2 border-papier-profond bg-papier/95 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-4 py-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg py-1 text-encre"
          aria-label="Passeport IA — retour à la carte"
        >
          <Blaze taille={24} />
          <span className="font-titre text-xl font-bold tracking-tight">Passeport IA</span>
        </Link>
        <nav aria-label="Navigation principale" className="flex items-center gap-1">
          <Link href={surListe ? "/" : "/liste"} className={lienNav}>
            {surListe ? "Voir la carte" : "Vue liste"}
          </Link>
          <Link href="/passeport" className={cn(lienNav, "border-encre bg-carte")}>
            Passeport&nbsp;·&nbsp;{n}
          </Link>
        </nav>
      </div>
    </header>
  );
}
