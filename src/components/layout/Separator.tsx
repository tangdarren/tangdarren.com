/** Subtle separators modeled on Filyys' Separator (not a full-height rule). */

export function HorizontalSeparator() {
  return (
    <div
      aria-hidden
      className="h-px w-full bg-gradient-to-r from-transparent via-mist-300/35 to-transparent"
    />
  );
}

/** Short vertical rule, vertically centered in a full-viewport flex sibling. */
export function VerticalSeparator() {
  return (
    <div
      aria-hidden
      className="hidden h-dvh shrink-0 items-center lg:flex"
    >
      <div className="h-1/3 w-px bg-gradient-to-b from-transparent via-mist-300/35 to-transparent" />
    </div>
  );
}
