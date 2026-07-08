import Link from "next/link";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type VarianteBouton = "primaire" | "secondaire" | "fantome";

const parVariante: Record<VarianteBouton, string> = {
  primaire: "bg-rouge-gr text-carte border-encre",
  secondaire: "bg-carte text-encre border-encre",
  fantome: "bg-transparent text-encre border-transparent shadow-none hover:border-encre-douce",
};

/**
 * Classes communes aux boutons et aux liens d'action.
 * min-height 56px, cibles ≥ 44px, ombre portée dure, focus visible géré
 * globalement. Base ≥ 17px.
 */
export function classesBouton(variante: VarianteBouton = "primaire"): string {
  return cn(
    "inline-flex min-h-[56px] items-center justify-center gap-2 rounded-carte border-2 px-6 py-3",
    "text-lg font-semibold leading-tight",
    "shadow-dure transition-transform duration-150",
    "hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-dure-active",
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:translate-y-0",
    parVariante[variante],
  );
}

interface BigButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: VarianteBouton;
  children: ReactNode;
}

/** Bouton d'action (vrai <button>). */
export const BigButton = forwardRef<HTMLButtonElement, BigButtonProps>(function BigButton(
  { variante = "primaire", className, type = "button", children, ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} className={cn(classesBouton(variante), className)} {...rest}>
      {children}
    </button>
  );
});

interface BigLinkProps {
  href: string;
  variante?: VarianteBouton;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}

/** Lien de navigation présenté comme un gros bouton (rend un vrai <a>). */
export function BigLink({ href, variante = "primaire", className, children, ...rest }: BigLinkProps) {
  return (
    <Link href={href} className={cn(classesBouton(variante), className)} {...rest}>
      {children}
    </Link>
  );
}
