import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

interface CrystalCardProps {
  titre?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Carte sombre « À retenir » : contraste fort, sert à cristalliser la notion.
 * Le contraste texte clair / fond encre respecte AA.
 */
export function CrystalCard({ titre = "À retenir", children, className }: CrystalCardProps) {
  return (
    <section
      className={cn(
        "rounded-carte border-2 border-encre bg-encre p-5 text-carte shadow-dure",
        className,
      )}
    >
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ocre">{titre}</p>
      <div className="text-lg leading-relaxed">{children}</div>
    </section>
  );
}
