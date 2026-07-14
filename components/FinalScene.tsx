"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE } from "@/lib/animations";
import { invitation } from "@/data/invitation";
import { useHost } from "@/lib/useHost";
import { FloatingPetals } from "@/components/FloatingPetals";

/**
 * Final scene — the world opens onto Dal Lake. A watercolour landscape drawn
 * in SVG, with slow water shimmer and drifting chinar leaves, closes the
 * story on a warm note.
 */
export function FinalScene() {
  const root = useRef<HTMLElement>(null);
  const { closing } = invitation;
  const { rsvp } = useHost();
  const tel = rsvp.phone.replace(/\s+/g, "");

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);

      // Parallax the mountain layers as the scene scrolls into frame.
      gsap.to(q(".layer-far"), {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(q(".layer-near"), {
        yPercent: 6,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.from(q(".final-reveal"), {
        y: 34,
        autoAlpha: 0,
        duration: 1.4,
        ease: EASE.luxe,
        stagger: 0.18,
        scrollTrigger: { trigger: root.current, start: "top 55%" },
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      data-snap
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-end overflow-hidden"
      aria-label="Closing"
    >
      {/* Watercolour landscape */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f7f3ed" />
            <stop offset="55%" stopColor="#f3ece1" />
            <stop offset="100%" stopColor="#ece3d8" />
          </linearGradient>
          <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#cdd6ce" />
            <stop offset="45%" stopColor="#aebcb0" />
            <stop offset="100%" stopColor="#8fa193" />
          </linearGradient>
          <linearGradient id="mistFar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c3cebd" />
            <stop offset="100%" stopColor="#aebfb0" />
          </linearGradient>
          <linearGradient id="mistNear" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9fae9d" />
            <stop offset="100%" stopColor="#83957f" />
          </linearGradient>
          <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <filter id="softer" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
          <linearGradient id="mist" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f4ede2" stopOpacity="0" />
            <stop offset="100%" stopColor="#eee6da" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        <rect width="1440" height="900" fill="url(#sky)" />

        {/* soft sun glow */}
        <circle cx="1080" cy="215" r="150" fill="#fff6e2" opacity="0.7" filter="url(#soft)" />

        {/* Distant Zabarwan range — soft watercolour washes */}
        <g className="layer-far" filter="url(#softer)">
          <path
            d="M0 468 C 140 404, 250 452, 386 402 C 520 356, 640 456, 780 396 C 920 340, 1040 452, 1200 398 C 1320 360, 1400 440, 1440 452 L 1440 580 L 0 580 Z"
            fill="url(#mistFar)"
            opacity="0.7"
          />
        </g>

        {/* Nearer range */}
        <g className="layer-near" filter="url(#soft)">
          <path
            d="M0 522 C 160 452, 300 508, 460 458 C 620 410, 760 512, 940 466 C 1100 426, 1240 500, 1440 470 L 1440 630 L 0 630 Z"
            fill="url(#mistNear)"
            opacity="0.82"
          />
        </g>

        {/* Mist settling at the mountains' feet */}
        <rect x="0" y="470" width="1440" height="120" fill="url(#mist)" opacity="0.7" />

        {/* Dal Lake */}
        <rect x="0" y="560" width="1440" height="340" fill="url(#water)" />

        {/* reflections of the ranges — a soft wash just under the shoreline */}
        <rect
          x="0"
          y="560"
          width="1440"
          height="70"
          fill="#7d8f79"
          opacity="0.18"
          filter="url(#soft)"
        />

        {/* ripples */}
        <g stroke="#f4efe6" strokeWidth="2" fill="none" opacity="0.4">
          <path className="ripple ripple-1" d="M-200 640 q 80 -10 160 0 t 160 0 t 160 0 t 160 0 t 160 0 t 160 0 t 160 0 t 160 0 t 160 0 t 160 0" />
          <path className="ripple ripple-2" d="M-200 700 q 90 -12 180 0 t 180 0 t 180 0 t 180 0 t 180 0 t 180 0 t 180 0 t 180 0 t 180 0" />
          <path className="ripple ripple-3" d="M-200 770 q 100 -14 200 0 t 200 0 t 200 0 t 200 0 t 200 0 t 200 0 t 200 0 t 200 0" />
        </g>

        {/* a lone shikara gliding across the lake */}
        <g className="shikara" opacity="0.5" fill="#5d6b58" stroke="#5d6b58">
          {/* slender hull with upturned bow and stern */}
          <path
            d="M556 662
               q -14 -6 -22 -20 q 12 8 26 12
               q 54 12 108 0 q 14 -4 26 -12 q -8 14 -22 20
               q -60 16 -116 0 Z"
            stroke="none"
          />
          {/* arched canopy */}
          <path
            d="M582 660 q 0 -26 30 -26 q 30 0 30 26"
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* canopy supports */}
          <path d="M582 660 l 0 -6 M642 660 l 0 -6" strokeWidth="2" />
          {/* boatman */}
          <circle cx="546" cy="648" r="5" stroke="none" />
          <path
            d="M546 653 l 0 12"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          {/* heart-tipped paddle dipping into the water */}
          <path
            d="M546 656 l -22 16"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </svg>

      {/* Drifting leaves over the sky */}
      <FloatingPetals count={12} className="text-sage/85" />

      {/* Closing message lifted into the sky, among the drifting petals. */}
      <h2 className="final-reveal display absolute left-1/2 top-[16vh] z-10 max-w-[16ch] -translate-x-1/2 text-balance px-6 text-center text-[clamp(1.9rem,5vw,3.4rem)] leading-tight text-ink">
        {closing}
      </h2>

      {/* RSVP resting low, over the water. */}
      <div className="relative z-10 mb-[12vh] flex flex-col items-center px-6 text-center">
        <span className="final-reveal rule-h w-24" />
        <p
          className="final-reveal eyebrow mt-8"
          style={{ color: "#8a6a2e", fontSize: "0.85rem" }}
        >
          RSVP
        </p>
        <p className="final-reveal mt-3 text-sm text-ink-soft">{rsvp.name}</p>
        <a
          href={`tel:${tel}`}
          className="final-reveal mt-1 font-serif text-lg text-ink transition-colors hover:text-gold-deep"
        >
          {rsvp.phone}
        </a>
      </div>
    </section>
  );
}
