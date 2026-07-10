/**
 * Restrained Kashmiri-inspired corner flourish (chinar leaf + paisley vine),
 * drawn as a single thin gold stroke. Purely decorative.
 */
export function FloralCorner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
      className={className}
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* main vine sweeping from the corner */}
      <path d="M4 4 C 34 8, 58 22, 70 50" opacity="0.9" />
      {/* paisley teardrop */}
      <path
        d="M70 50 C 84 40, 96 46, 96 60 C 96 74, 82 80, 72 72 C 64 65, 66 55, 78 54"
        opacity="0.9"
      />
      {/* small chinar leaf */}
      <path
        d="M40 14 C 46 6, 58 6, 62 16 C 58 20, 48 22, 40 14 Z"
        opacity="0.7"
      />
      <path d="M51 10 L 51 20" opacity="0.5" />
      {/* buds along the vine */}
      <circle cx="22" cy="9" r="2.2" opacity="0.7" />
      <circle cx="60" cy="40" r="2.2" opacity="0.7" />
      <path d="M12 26 C 20 24, 26 30, 24 38" opacity="0.55" />
    </svg>
  );
}
