"use client";

import { gsap, ScrollTrigger } from "@/lib/gsap";

/** Shared easing vocabulary so motion feels consistent across scenes. */
export const EASE = {
  luxe: "power3.out",
  luxeInOut: "power2.inOut",
  soft: "sine.inOut",
  spring: "elastic.out(1, 0.6)",
} as const;

export interface ScrubSceneOptions {
  trigger: Element;
  start?: string;
  end?: string;
  pin?: boolean | Element;
  scrub?: number | boolean;
  anticipatePin?: number;
  defaults?: gsap.TweenVars;
}

/**
 * Creates a timeline bound to a scrubbed ScrollTrigger. Scroll position — not
 * time — drives progress, which is the backbone of the invitation's cinematics.
 */
export function createScrubTimeline({
  trigger,
  start = "top top",
  end = "bottom bottom",
  pin = false,
  scrub = 1,
  anticipatePin = 1,
  defaults,
}: ScrubSceneOptions): gsap.core.Timeline {
  return gsap.timeline({
    defaults,
    scrollTrigger: {
      trigger,
      start,
      end,
      pin,
      scrub,
      anticipatePin,
    },
  });
}

export { ScrollTrigger };
