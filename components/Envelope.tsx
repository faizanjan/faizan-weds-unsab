"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { createScrubTimeline } from "@/lib/animations";
import { invitation } from "@/data/invitation";
import { FloralCorner } from "@/components/ornaments/FloralCorner";
import { FloralDivider } from "@/components/ornaments/FloralDivider";

/**
 * Scenes 2–4 — the envelope.
 *
 * A tall section pins an inner stage and a single scrubbed timeline maps the
 * scroll range onto: the envelope rising in, the wax seal cracking, the flap
 * opening, and the letter sliding up and drawing toward the camera. Nothing is
 * time-based — scroll position is the only clock.
 */
export function Envelope() {
  const root = useRef<HTMLDivElement>(null);
  const [first, second] = invitation.couple;

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);

      // Resting/initial state before the scene is scrolled into.
      gsap.set(q(".envelope"), { y: 80, autoAlpha: 0, scale: 0.94 });
      gsap.set(q(".env-shadow"), { autoAlpha: 0, scale: 0.6 });
      // Letter sits low and invisible; it fades in as it's drawn upward,
      // reading as the card being lifted clear of the envelope.
      gsap.set(q(".env-letter"), { yPercent: 52, autoAlpha: 0, zIndex: 9 });
      gsap.set(q(".env-letter-body"), { autoAlpha: 0 });
      // Sheen bars park off to one side of their surface.
      gsap.set(q(".env-flap-sheen"), { xPercent: -140, opacity: 0 });
      gsap.set(q(".env-letter-sheen"), { xPercent: -130, opacity: 0 });

      const tl = createScrubTimeline({
        trigger: root.current!,
        pin: q(".env-pin")[0],
        scrub: 0.6,
        defaults: { ease: "none" },
      });

      // 1 — Rise into view, quickly, so the scene never reads as empty
      tl.to(q(".envelope"), { y: 0, autoAlpha: 1, scale: 1, duration: 0.7 }, 0)
        .to(q(".env-shadow"), { autoAlpha: 1, scale: 1, duration: 0.7 }, 0)
        // 2 — Hold + subtle push toward camera as the seal is admired
        .to(q(".envelope"), { scale: 1.04, duration: 1 }, 1.6)
        // 3 — Seal cracks apart
        .to(
          q(".env-seal-half.left"),
          { xPercent: -32, rotate: -12, autoAlpha: 0.9, duration: 0.8 },
          2.8
        )
        .to(
          q(".env-seal-half.right"),
          { xPercent: 32, rotate: 12, autoAlpha: 0.9, duration: 0.8 },
          2.8
        )
        .to(q(".env-seal"), { autoAlpha: 0, duration: 0.5 }, 3.5)
        // 4 — Flap cracks open just enough to read as unsealed, catching a
        // specular sheen, then dissolves as the card rises. Rotating it any
        // further would throw a full triangle into the empty space above the
        // envelope (the perspective origin makes it loom, not recede), so we
        // keep the lift subtle and let the card be the reveal.
        .to(
          q(".env-flap"),
          { rotateX: -46, duration: 1, ease: "power2.out" },
          3.2
        )
        .to(q(".env-flap-sheen"), { opacity: 1, duration: 0.2 }, 3.3)
        .to(
          q(".env-flap-sheen"),
          { xPercent: 140, duration: 0.9, ease: "power1.inOut" },
          3.35
        )
        .to(q(".env-flap-sheen"), { opacity: 0, duration: 0.2 }, 4.0)
        // Flap tips a touch further and fades out as the card emerges past it.
        .to(
          q(".env-flap"),
          { autoAlpha: 0, rotateX: -64, duration: 1.1, ease: "power1.in" },
          4.0
        )
        // 5 — Letter is drawn up and fades into view
        .to(
          q(".env-letter"),
          { autoAlpha: 1, yPercent: -12, duration: 1.8, ease: "power2.inOut" },
          4.1
        )
        // Sheen sweeps across the card face as it clears the pocket.
        .to(q(".env-letter-sheen"), { opacity: 1, duration: 0.25 }, 4.5)
        .to(
          q(".env-letter-sheen"),
          { xPercent: 130, duration: 1.1, ease: "power1.inOut" },
          4.55
        )
        .to(q(".env-letter-sheen"), { opacity: 0, duration: 0.3 }, 5.45)
        .to(q(".env-letter-body"), { autoAlpha: 1, duration: 0.6 }, 4.9)
        // 6 — Camera draws closer; pocket + flap recede so the card is clean
        .to(q(".envelope"), { scale: 1.42, y: 0, duration: 1.6 }, 5.4)
        .to(
          q(".env-front, .env-flap, .env-shadow, .env-back"),
          { autoAlpha: 0, duration: 1 },
          5.6
        );
    },
    { scope: root }
  );

  return (
    <div ref={root} className="relative h-[420vh] w-full">
      <div className="env-pin relative flex h-[100svh] w-full items-center justify-center overflow-hidden">
        <div className="env-stage flex h-full w-full items-center justify-center">
          <div className="envelope">
            <div className="env-shadow" aria-hidden="true" />
            <div className="env-back" aria-hidden="true" />

            {/* The letter that rises out */}
            <div className="env-letter">
              {/* Corner flourishes */}
              <FloralCorner className="env-letter-floral absolute left-1.5 top-1.5 h-10 w-10 text-gold/60" />
              <FloralCorner className="env-letter-floral absolute right-1.5 top-1.5 h-10 w-10 -scale-x-100 text-gold/60" />
              <FloralCorner className="env-letter-floral absolute bottom-1.5 left-1.5 h-10 w-10 -scale-y-100 text-gold/60" />
              <FloralCorner className="env-letter-floral absolute bottom-1.5 right-1.5 h-10 w-10 -scale-100 text-gold/60" />

              <div className="env-letter-sheen" aria-hidden="true" />

              <div className="env-letter-body flex h-full flex-col items-center justify-center px-7 text-center">
                <p className="eyebrow text-[0.55rem]">You Are Cordially Invited</p>
                <p className="font-script mt-5 text-4xl leading-none text-gold">
                  {first}
                  <span className="mx-2 align-middle text-[0.85em]">&amp;</span>
                  {second}
                </p>
                <FloralDivider className="mt-5 scale-75" />
                <p className="lede mt-5 max-w-[26ch] text-[0.8rem] leading-relaxed">
                  to share in the joy of our
                  <br />
                  wedding celebrations.
                </p>
              </div>
            </div>

            {/* Front pocket */}
            <div className="env-front" aria-hidden="true" />

            {/* Top flap */}
            <div className="env-flap" aria-hidden="true">
              <div className="env-flap-face">
                <div className="env-flap-sheen" />
              </div>
              <div className="env-flap-back" />
            </div>

            {/* Wax seal */}
            <div className="env-seal" aria-hidden="true">
              <div className="env-seal-half left" />
              <div className="env-seal-half right" />
              <span className="env-seal-mono">
                {first.charAt(0)}&amp;{second.charAt(0)}
              </span>
              <div className="env-seal-glint" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
