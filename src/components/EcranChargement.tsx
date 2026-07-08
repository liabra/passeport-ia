/** État transitoire pendant la lecture de la progression locale. */
export function EcranChargement() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <p role="status" className="text-lg font-semibold text-encre-douce">
        Chargement du voyage…
      </p>
    </div>
  );
}
