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
 * Chinar leaves drifting slowly on an imagined breeze. Each leaf gets its own
 * organic path via GSAP so the motion never looks looped. Respects
 * reduced-motion by rendering nothing.
 */
export function FloatingPetals({ count = 10, className }: FloatingPetalsProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const leaves = gsap.utils.toArray<HTMLElement>(".petal", root.current);

      leaves.forEach((leaf, i) => {
        const startX = gsap.utils.random(0, 100);
        gsap.set(leaf, {
          left: `${startX}%`,
          top: `${gsap.utils.random(-10, 100)}%`,
          scale: gsap.utils.random(0.5, 1.1),
          rotation: gsap.utils.random(0, 360),
          opacity: gsap.utils.random(0.25, 0.6),
        });

        // Vertical drift down and off-screen, then recycle to the top.
        gsap.to(leaf, {
          yPercent: 900,
          duration: gsap.utils.random(18, 34),
          ease: "none",
          repeat: -1,
          delay: i * 0.6,
          modifiers: {
            yPercent: gsap.utils.unitize((v) => parseFloat(v) % 1000),
          },
        });

        // Gentle sideways sway.
        gsap.to(leaf, {
          xPercent: gsap.utils.random(-160, 160),
          duration: gsap.utils.random(6, 11),
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });

        // Slow tumble.
        gsap.to(leaf, {
          rotation: `+=${gsap.utils.random(180, 420)}`,
          duration: gsap.utils.random(10, 20),
          ease: "none",
          repeat: -1,
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
