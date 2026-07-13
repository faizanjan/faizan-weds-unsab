"use client";

import type Lenis from "lenis";

/**
 * Lenis owns the scroll position, so any programmatic scroll (e.g. tapping the
 * wax seal to jump to the invitation) must go through the live instance rather
 * than `window.scrollTo`, which Lenis would immediately fight. The provider
 * registers the instance here; callers use {@link smoothScrollTo}. Falls back to
 * native smooth scroll when Lenis is absent (reduced-motion).
 */
let lenis: Lenis | null = null;

export function registerLenis(instance: Lenis | null): void {
  lenis = instance;
}

export type ScrollTarget = number | string | HTMLElement;

export function smoothScrollTo(target: ScrollTarget, duration = 1.6): void {
  if (lenis) {
    lenis.scrollTo(target, { duration });
    return;
  }

  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "smooth" });
    return;
  }

  const el =
    typeof target === "string" ? document.querySelector(target) : target;
  if (el instanceof HTMLElement) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}
