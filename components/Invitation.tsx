"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE } from "@/lib/animations";
import { invitation } from "@/data/invitation";
import { useInviteParams } from "@/lib/useInviteParams";
import { FloralCorner } from "@/components/ornaments/FloralCorner";
import { FloralDivider } from "@/components/ornaments/FloralDivider";

/**
 * Scene 5 — the invitation itself, presented as a single embossed card with
 * restrained Kashmiri corner motifs. Content settles in as the card enters.
 */
export function Invitation() {
  const root = useRef<HTMLElement>(null);
  const { blessing, groom, bride, functions } = invitation;
  const { showMehndi } = useInviteParams();

  // Not everyone invited to the Reception is invited to the Mehndi; `?m=f`
  // drops it so those guests never see an event they aren't part of.
  const visibleFunctions = functions.filter(
    (fn) => showMehndi || fn.name !== "Mehndi"
  );

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);

      // The card lifts and settles, with a whisper of paper bend.
      gsap.from(q(".invite-card"), {
        y: 90,
        autoAlpha: 0,
        rotateX: 8,
        transformPerspective: 1200,
        duration: 1.4,
        ease: EASE.luxe,
        scrollTrigger: { trigger: root.current, start: "top 78%" },
      });

      gsap.from(q(".invite-reveal"), {
        y: 26,
        autoAlpha: 0,
        duration: 1,
        ease: EASE.luxe,
        stagger: 0.14,
        scrollTrigger: { trigger: root.current, start: "top 62%" },
      });

      gsap.from(q(".invite-corner"), {
        autoAlpha: 0,
        scale: 0.85,
        duration: 1.4,
        ease: EASE.luxe,
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: "top 60%" },
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="relative flex min-h-[100svh] w-full items-center justify-center px-5 py-24 sm:px-8"
      aria-label="The invitation"
    >
      <article className="invite-card paper-grain relative w-full max-w-2xl overflow-hidden rounded-[3px] bg-paper px-6 py-16 text-center shadow-[var(--shadow-paper)] sm:px-16 sm:py-24">
        {/* Embossed inner frame */}
        <span className="pointer-events-none absolute inset-3 rounded-[2px] border border-gold/30 sm:inset-5" />
        <span className="pointer-events-none absolute inset-4 rounded-[2px] border border-gold/15 sm:inset-6" />

        {/* Corner motifs */}
        <FloralCorner className="invite-corner absolute left-2 top-2 h-16 w-16 text-gold/70 sm:h-20 sm:w-20" />
        <FloralCorner className="invite-corner absolute right-2 top-2 h-16 w-16 -scale-x-100 text-gold/70 sm:h-20 sm:w-20" />
        <FloralCorner className="invite-corner absolute bottom-2 left-2 h-16 w-16 -scale-y-100 text-gold/70 sm:h-20 sm:w-20" />
        <FloralCorner className="invite-corner absolute bottom-2 right-2 h-16 w-16 -scale-100 text-gold/70 sm:h-20 sm:w-20" />

        <div className="relative">
          <p className="invite-reveal eyebrow">Bismillah</p>

          <p className="invite-reveal lede mx-auto mt-8 max-w-md text-balance text-[0.95rem] sm:text-base">
            {blessing}
          </p>

          <FloralDivider className="invite-reveal my-10" />

          {/* Couple */}
          <div className="invite-reveal">
            <h2 className="display text-[clamp(2.4rem,7vw,4rem)] text-ink">
              {groom.name}
            </h2>
            <p className="lede mt-2 text-sm leading-relaxed">{groom.parents}</p>

            <p className="font-script my-5 text-2xl text-gold sm:text-3xl">
              with
            </p>

            <h2 className="display text-[clamp(2.4rem,7vw,4rem)] text-ink">
              {bride.name}
            </h2>
            <p className="lede mt-2 text-sm leading-relaxed">{bride.parents}</p>
          </div>

          <FloralDivider className="invite-reveal my-12" />

          {/* Functions */}
          <div
            className={`invite-reveal grid grid-cols-1 gap-10 ${
              visibleFunctions.length > 1
                ? "sm:grid-cols-2"
                : "mx-auto max-w-xs"
            }`}
          >
            {visibleFunctions.map((fn) => (
              <div key={fn.name} className="flex flex-col items-center">
                <p className="eyebrow text-gold-deep">{fn.day}</p>
                <h3 className="display mt-3 text-3xl text-ink sm:text-4xl">
                  {fn.name}
                </h3>
                <span className="rule-h mt-4 w-10" />
                <p className="mt-4 font-serif text-lg text-ink">{fn.date}</p>
                <p className="mt-1 text-sm text-ink-soft">{fn.time}</p>
              </div>
            ))}
          </div>
        </div>
      </article>
    </section>
  );
}
