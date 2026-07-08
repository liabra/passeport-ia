import { BigLink } from "@/components/ui/BigButton";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-3 font-titre text-3xl font-bold">Hors du chemin</h1>
      <p className="mb-8 text-lg text-encre-douce">
        Cette page ne fait pas partie du voyage. Revenons au sentier.
      </p>
      <BigLink href="/">Revenir à la carte</BigLink>
    </main>
  );
}
