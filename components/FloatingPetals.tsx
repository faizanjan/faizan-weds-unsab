"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

interface FloatingPetalsProps {
  count?: number;
  className?: string;
}

// A soft, pointed leaf/petal silhouette (reads far better than a diamond).
const LEAF_PATH =
  "M12 0 C 4 6, 2 16, 8 23 C 10 25, 14 25, 16 23 C 22 16, 20 6, 12 0 Z";

/**
 * Chinar leaves floating on an imagined breeze in the open sky above the
 * closing message. Each leaf wanders its own way — independent horizontal and
 * vertical bobbing at different speeds so the drift never looks looped — while
 * staying in the upper region. Respects reduced-motion by rendering nothing.
 */
export function FloatingPetals({ count = 12, className }: FloatingPetalsProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const leaves = gsap.utils.toArray<HTMLElement>(".petal", root.current);
      const rand = gsap.utils.random;

      leaves.forEach((leaf) => {
        // Scatter across the sky, kept above where the closing text sits, with
        // enough margin that the vertical bob never clips at the top edge.
        gsap.set(leaf, {
          left: `${rand(5, 95)}%`,
          top: `${rand(12, 42)}%`,
          scale: rand(0.6, 1.15),
          rotation: rand(0, 360),
          opacity: rand(0.4, 0.75),
        });

        // Wander horizontally and vertically on separate clocks so each leaf
        // traces a slow, organic float rather than a straight line.
        gsap.to(leaf, {
          x: rand(-140, 140),
          duration: rand(7, 12),
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: rand(0, 2.5),
        });
        gsap.to(leaf, {
          y: rand(-55, 55),
          duration: rand(6, 10),
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: rand(0, 2.5),
        });

        // Lazy back-and-forth tilt.
        gsap.to(leaf, {
          rotation: `+=${rand(-70, 70)}`,
          duration: rand(9, 16),
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });
    },
    { scope: root }
  );

  return (
    <div
      ref={root}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          className="petal absolute h-4 w-4 will-change-transform"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d={LEAF_PATH} />
        </svg>
      ))}
    </div>
  );
}
