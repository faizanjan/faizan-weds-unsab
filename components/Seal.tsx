"use client";

import { invitation } from "@/data/invitation";

/**
 * The wax seal — a layered-CSS disc bearing the couple's monogram. It lives in
 * the hero as the invitation's one call to action: a breathing halo and a
 * travelling glint invite a tap, which smooth-scrolls on to the invitation.
 * Scrolling works just the same; the seal is only a shortcut.
 */
export function Seal({
  onOpen,
  className,
}: {
  onOpen: () => void;
  className?: string;
}) {
  const [first, second] = invitation.couple;

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Open the invitation"
      className={`hero-seal ${className ?? ""}`}
    >
      <span className="seal-face" aria-hidden="true" />
      <span className="seal-mono">
        {first.charAt(0)}&amp;{second.charAt(0)}
      </span>
      <span className="seal-glint" aria-hidden="true" />
    </button>
  );
}
