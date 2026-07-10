/**
 * A slim centered separator: two hairlines meeting a small paisley diamond.
 * Used between movements of the invitation.
 */
export function FloralDivider({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center gap-3 text-gold ${className ?? ""}`}
      aria-hidden="true"
    >
      <span className="h-px w-14 bg-gradient-to-r from-transparent to-gold/70 sm:w-20" />
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <path
          d="M13 2 C 17 8, 24 9, 24 13 C 24 17, 17 18, 13 24 C 9 18, 2 17, 2 13 C 2 9, 9 8, 13 2 Z"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <circle cx="13" cy="13" r="2" fill="currentColor" opacity="0.8" />
      </svg>
      <span className="h-px w-14 bg-gradient-to-l from-transparent to-gold/70 sm:w-20" />
    </div>
  );
}
