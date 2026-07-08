interface CheckMarkProps {
  taille?: number;
  className?: string;
}

/** Coche vectorielle (jamais d'emoji dans l'interface). */
export function CheckMark({ taille = 18, className }: CheckMarkProps) {
  return (
    <svg
      width={taille}
      height={taille}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
