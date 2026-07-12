"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { createScrubTimeline } from "@/lib/animations";
import { smoothScrollTo } from "@/lib/smoothScroll";
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
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [first, second] = invitation.couple;

  // Tapping the seal advances the scroll to the point where the card is fully
  // out — same timeline, so click and scroll can't disagree.
  const openInvitation = () => {
    const st = tlRef.current?.scrollTrigger;
    if (!st) return;
    smoothScrollTo(st.start + (st.end - st.start) * 0.92);
  };

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);

      // The envelope rests fully visible so it's already on screen as the
      // section scrolls up behind the departing hero — no blank ivory gap.
      gsap.set(q(".envelope"), { y: 0, autoAlpha: 1, scale: 1 });
      gsap.set(q(".env-shadow"), { autoAlpha: 1, scale: 1 });
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
      tlRef.current = tl;

      // Scroll/tap hint — present from the moment the envelope pins, fading as
      // the flap lifts so it never lingers over the open card.
      tl.to(q(".env-hint"), { autoAlpha: 0, duration: 0.6 }, 0.8);

      // 1 — A subtle push toward camera as the sealed envelope settles in
      tl.to(q(".envelope"), { scale: 1.04, duration: 1 }, 0)
        // 2 — Seal cracks apart
        .to(
          q(".env-seal-half.left"),
          { xPercent: -32, rotate: -12, autoAlpha: 0.9, duration: 0.8 },
          1.2
        )
        .to(
          q(".env-seal-half.right"),
          { xPercent: 32, rotate: 12, autoAlpha: 0.9, duration: 0.8 },
          1.2
        )
        .to(q(".env-seal"), { autoAlpha: 0, duration: 0.5 }, 1.9)
        // 4 — Flap cracks open just enough to read as unsealed, catching a
        // specular sheen, then dissolves as the card rises. Rotating it any
        // further would throw a full triangle into the empty space above the
        // envelope (the perspective origin makes it loom, not recede), so we
        // keep the lift subtle and let the card be the reveal.
        .to(
          q(".env-flap"),
          { rotateX: -46, duration: 1, ease: "power2.out" },
          1.6
        )
        .to(q(".env-flap-sheen"), { opacity: 1, duration: 0.2 }, 1.7)
        .to(
          q(".env-flap-sheen"),
          { xPercent: 140, duration: 0.9, ease: "power1.inOut" },
          1.75
        )
        .to(q(".env-flap-sheen"), { opacity: 0, duration: 0.2 }, 2.4)
        // Flap tips a touch further and fades out as the card emerges past it.
        .to(
          q(".env-flap"),
          { autoAlpha: 0, rotateX: -64, duration: 1.1, ease: "power1.in" },
          2.4
        )
        // 5 — Letter is drawn up and fades into view
        .to(
          q(".env-letter"),
          { autoAlpha: 1, yPercent: -12, duration: 1.8, ease: "power2.inOut" },
          2.5
        )
        // Sheen sweeps across the card face as it clears the pocket.
        .to(q(".env-letter-sheen"), { opacity: 1, duration: 0.25 }, 2.9)
        .to(
          q(".env-letter-sheen"),
          { xPercent: 130, duration: 1.1, ease: "power1.inOut" },
          2.95
        )
        .to(q(".env-letter-sheen"), { opacity: 0, duration: 0.3 }, 3.85)
        .to(q(".env-letter-body"), { autoAlpha: 1, duration: 0.6 }, 3.3)
        // 6 — Camera draws closer; pocket + flap recede so the card is clean.
        // A touch of downward drift keeps the emerged card centered rather than
        // riding up against the top of the viewport.
        .to(q(".envelope"), { scale: 1.2, y: 70, duration: 1.6 }, 3.8)
        .to(
          q(".env-front, .env-flap, .env-shadow, .env-back"),
          { autoAlpha: 0, duration: 1 },
          4.0
        )
        // 7 — Hold the fully-open card centered so a little more scroll doesn't
        // whisk it out of view before it's been read.
        .to({}, { duration: 1.6 }, 5.4);
    },
    { scope: root }
  );

  return (
    <div ref={root} className="relative h-[255vh] w-full">
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

            {/* Wax seal — also a tap target that opens the invitation */}
            <div
              className="env-seal"
              role="button"
              tabIndex={0}
              aria-label="Open the invitation"
              onClick={openInvitation}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openInvitation();
                }
              }}
            >
              <div className="env-seal-half left" />
              <div className="env-seal-half right" />
              <span className="env-seal-mono">
                {first.charAt(0)}&amp;{second.charAt(0)}
              </span>
              <div className="env-seal-glint" />
            </div>
          </div>
        </div>

        {/* Scroll / tap hint, pinned to the stage so it holds if they pause */}
        <div className="env-hint pointer-events-none absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-3">
          <span className="sr-only">Tap the seal or scroll to open</span>
          <span className="relative flex h-12 w-[1px] overflow-hidden bg-gold/30">
            <span className="scroll-bead absolute left-0 top-0 h-3 w-full bg-gold" />
          </span>
          <svg
            className="scroll-cue h-4 w-4 text-gold/80"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M5 8.5l7 7 7-7"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
