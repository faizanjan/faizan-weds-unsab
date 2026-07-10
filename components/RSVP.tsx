"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE } from "@/lib/animations";
import { useHost } from "@/lib/useHost";

/**
 * RSVP — intentionally quiet. A single line of contact, not a call to action.
 * The contact follows the active host (groom by default, bride with `?B=T`).
 */
export function RSVP() {
  const root = useRef<HTMLElement>(null);
  const { rsvp } = useHost();
  const tel = rsvp.phone.replace(/\s+/g, "");

  useGSAP(
    () => {
      gsap.from(gsap.utils.selector(root)(".rsvp-reveal"), {
        y: 18,
        autoAlpha: 0,
        duration: 1,
        ease: EASE.luxe,
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: "top 82%" },
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="relative w-full px-6 pb-24"
      aria-label="RSVP"
    >
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <p className="rsvp-reveal eyebrow text-ink-soft/70">RSVP</p>
        <p className="rsvp-reveal mt-4 text-sm text-ink-soft">
          {rsvp.name}
        </p>
        <a
          href={`tel:${tel}`}
          className="rsvp-reveal mt-1 font-serif text-lg text-ink transition-colors hover:text-gold-deep"
        >
          {rsvp.phone}
        </a>
      </div>
    </section>
  );
}
