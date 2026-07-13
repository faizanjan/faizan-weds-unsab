"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE } from "@/lib/animations";
import { useHost } from "@/lib/useHost";
import { FloralDivider } from "@/components/ornaments/FloralDivider";

/**
 * The venue — the host residence, an elegant map card, and a discreet
 * directions link. The residence and map follow the active host (groom by
 * default, bride when opened with `?B=T`).
 */
export function Venue() {
  const root = useRef<HTMLElement>(null);
  const host = useHost();

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.from(q(".venue-reveal"), {
        y: 30,
        autoAlpha: 0,
        duration: 1.1,
        ease: EASE.luxe,
        stagger: 0.12,
        scrollTrigger: { trigger: root.current, start: "top 72%" },
      });
      gsap.from(q(".venue-map"), {
        y: 40,
        autoAlpha: 0,
        duration: 1.3,
        ease: EASE.luxe,
        scrollTrigger: { trigger: q(".venue-map"), start: "top 85%" },
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="relative flex min-h-[100svh] w-full items-center px-5 py-24 sm:px-8"
      aria-label="Venue"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="venue-reveal eyebrow">The Celebration</p>
        <h2 className="venue-reveal display mt-6 text-[clamp(2.6rem,7vw,4.5rem)] text-ink">
          At Their Residence
        </h2>
        <p className="venue-reveal lede mt-6">
          The celebration will be at their residence
        </p>
        <div className="venue-reveal mt-4 space-y-1 text-ink-soft">
          {host.addressLines.map((line) => (
            <p key={line} className="font-serif text-lg tracking-wide">
              {line}
            </p>
          ))}
        </div>

        <FloralDivider className="venue-reveal my-12" />

        <div className="venue-map group relative mx-auto max-w-2xl overflow-hidden rounded-[3px] bg-paper p-2 shadow-[var(--shadow-paper)]">
          <span className="pointer-events-none absolute inset-2 z-10 rounded-[2px] border border-gold/25" />
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2px] sm:aspect-[16/9]">
            <iframe
              src={host.mapsEmbedUrl}
              title="Map to the residence"
              className="h-full w-full grayscale-[35%] transition-[filter] duration-700 group-hover:grayscale-0"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>

        <a
          href={host.mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="venue-reveal group mt-10 inline-flex items-center gap-2.5 border-b border-gold/40 pb-1 text-sm tracking-[0.16em] text-ink transition-colors hover:border-gold hover:text-gold-deep"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="transition-transform duration-500 group-hover:-translate-y-0.5"
          >
            <path
              d="M12 21s7-5.686 7-11a7 7 0 10-14 0c0 5.314 7 11 7 11z"
              stroke="currentColor"
              strokeWidth="1.4"
            />
            <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.4" />
          </svg>
          VIEW ON GOOGLE MAPS
        </a>
      </div>
    </section>
  );
}
