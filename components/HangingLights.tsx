"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/** Fairy-light bulbs spaced along the top wire. */
const BULBS = Array.from({ length: 18 }, (_, i) => i);

/** Lanterns hang at these horizontal positions (percent of width). */
const LANTERNS = [
  { left: "16%", drop: 46, swing: 3.6, dur: 2.6, delay: 0 },
  { left: "40%", drop: 74, swing: 2.8, dur: 3.1, delay: 0.6 },
  { left: "62%", drop: 40, swing: 3.2, dur: 2.9, delay: 0.3 },
  { left: "85%", drop: 66, swing: 3.8, dur: 3.4, delay: 0.9 },
];

function Lantern() {
  return (
    <svg
      width="30"
      viewBox="0 0 40 66"
      fill="none"
      className="drop-shadow-[0_2px_6px_rgba(200,169,106,0.35)]"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="lanternGlow" cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="#ffe9b8" />
          <stop offset="60%" stopColor="#e9c67d" />
          <stop offset="100%" stopColor="#c8a96a" />
        </radialGradient>
      </defs>
      {/* crown + hanging ring */}
      <path d="M20 4 L15 12 L25 12 Z" fill="#b7924e" />
      <rect x="16" y="11" width="8" height="4" rx="1" fill="#b7924e" />
      {/* body */}
      <path
        d="M13 16 Q20 12 27 16 Q33 26 30 40 Q27 50 20 52 Q13 50 10 40 Q7 26 13 16 Z"
        fill="url(#lanternGlow)"
        stroke="#a8843f"
        strokeWidth="1"
      />
      {/* fret lines */}
      <path
        d="M20 15 L20 51 M12 22 Q20 26 28 22 M11 38 Q20 43 29 38"
        stroke="#a8843f"
        strokeWidth="0.8"
        opacity="0.6"
        fill="none"
      />
      {/* finial + tassel */}
      <path d="M20 52 L20 58" stroke="#b7924e" strokeWidth="1.4" />
      <circle cx="20" cy="60" r="2" fill="#b7924e" />
      <path
        d="M20 62 L18 66 M20 62 L20 66 M20 62 L22 66"
        stroke="#b7924e"
        strokeWidth="0.8"
      />
    </svg>
  );
}

/**
 * A garland strung across the top of the hero: a gently arced wire of twinkling
 * fairy lights with a few paper lanterns swaying beneath it. Purely decorative,
 * pointer-transparent, and stilled for reduced-motion users.
 */
export function HangingLights() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduced) return;

      const q = gsap.utils.selector(root);
      q(".lantern").forEach((el, i) => {
        const cfg = LANTERNS[i];
        gsap.fromTo(
          el,
          { rotation: -cfg.swing },
          {
            rotation: cfg.swing,
            transformOrigin: "top center",
            duration: cfg.dur,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: cfg.delay,
          }
        );
      });
    },
    { scope: root }
  );

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-56 overflow-hidden"
    >
      {/* the wire — a shallow sag across the width */}
      <svg
        className="absolute inset-x-0 top-0 h-16 w-full"
        viewBox="0 0 100 20"
        preserveAspectRatio="none"
      >
        <path
          d="M0 3 Q50 16 100 3"
          fill="none"
          stroke="rgba(200,169,106,0.4)"
          strokeWidth="0.4"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* fairy bulbs following the sag */}
      <div className="absolute inset-x-4 top-0 flex justify-between">
        {BULBS.map((i) => {
          // approximate the wire's parabola so bulbs sit on the string
          const t = i / (BULBS.length - 1);
          const sag = Math.sin(t * Math.PI) * 34;
          return (
            <span
              key={i}
              className="fairy-bulb"
              style={{ marginTop: `${sag}px`, animationDelay: `${(i % 6) * 0.4}s` }}
            />
          );
        })}
      </div>

      {/* swinging lanterns */}
      {LANTERNS.map((l, i) => (
        <div
          key={i}
          className="absolute top-0"
          style={{ left: l.left, transform: "translateX(-50%)" }}
        >
          <div className="lantern flex flex-col items-center">
            <span
              className="w-px bg-gold/40"
              style={{ height: `${l.drop}px` }}
            />
            <Lantern />
          </div>
        </div>
      ))}
    </div>
  );
}
