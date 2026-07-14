"use client";

import { useEffect, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE } from "@/lib/animations";
import { smoothScrollTo } from "@/lib/smoothScroll";
import { Particles } from "@/components/Particles";
import { HangingLights } from "@/components/HangingLights";
import { Seal } from "@/components/Seal";
import { invitation } from "@/data/invitation";
import { useInviteParams } from "@/lib/useInviteParams";

/**
 * Scene 1 — the opening. A near-empty ivory field lit from the top-left,
 * the couple's names, one quiet line, and an invitation to scroll.
 * Content settles in on load; the whole scene drifts away as you leave.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const [first, second] = invitation.couple;
  const { guestName } = useInviteParams();

  // The seal is a shortcut, not a gate — it simply carries the reader on to
  // the invitation. Plain scrolling gets there too. We resolve an absolute
  // document offset rather than passing the element, so the landing point is
  // deterministic regardless of the reader's current scroll position.
  const openInvitation = () => {
    const target = document.getElementById("invitation");
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY;
    smoothScrollTo(top);
  };

  // If the reader lingers on the hero without touching anything, carry them
  // into the invitation after a beat — but never yank someone who's already
  // begun exploring, so any wheel/touch/key/pointer input cancels it.
  useEffect(() => {
    let cancelled = false;

    const timer = window.setTimeout(() => {
      if (cancelled) return;
      const target = document.getElementById("invitation");
      if (target) {
        smoothScrollTo(target.getBoundingClientRect().top + window.scrollY);
      }
    }, 12000);

    const cancel = () => {
      cancelled = true;
      window.clearTimeout(timer);
    };

    const opts: AddEventListenerOptions = { passive: true, once: true };
    window.addEventListener("wheel", cancel, opts);
    window.addEventListener("touchstart", cancel, opts);
    window.addEventListener("pointerdown", cancel, opts);
    window.addEventListener("keydown", cancel, { once: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchstart", cancel);
      window.removeEventListener("pointerdown", cancel);
      window.removeEventListener("keydown", cancel);
    };
  }, []);

  useGSAP(
    () => {
      // Intro — a composed, unhurried reveal.
      const intro = gsap.timeline({
        defaults: { ease: EASE.luxe },
        delay: 0.25,
      });

      intro
        .from(".hero-eyebrow", { autoAlpha: 0, y: 16, duration: 1 })
        .from(
          ".hero-name",
          { autoAlpha: 0, y: 40, duration: 1.4, stagger: 0.18 },
          "-=0.6"
        )
        .from(
          ".hero-amp",
          { autoAlpha: 0, scale: 0.8, duration: 1.4, ease: EASE.spring },
          "-=1.2"
        )
        .from(".hero-tagline", { autoAlpha: 0, y: 18, duration: 1 }, "-=0.8")
        .from(
          ".hero-cue",
          { autoAlpha: 0, y: 12, duration: 1 },
          "-=0.5"
        );

      // Departure — parallax fade as the envelope scene takes over.
      gsap.to(".hero-content", {
        autoAlpha: 0,
        y: -60,
        filter: "blur(6px)",
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      data-snap
      className="relative h-[100svh] w-full overflow-hidden"
      aria-label="Wedding invitation — Faizan and Unsab"
    >
      {/* Warm sunlight from the top-left */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 12% 4%, rgba(255,247,228,0.9) 0%, rgba(247,243,237,0.4) 42%, rgba(247,243,237,0) 70%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <Particles density={0.9} sparkles={14} hearts={6} />
      </div>

      <HangingLights />

      <div className="hero-content relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        {guestName ? (
          <div className="hero-eyebrow mb-10 flex flex-col items-center">
            <p className="font-script text-3xl text-gold-deep sm:text-4xl">
              Dear {guestName},
            </p>
            <p className="eyebrow mt-4">you are invited to the wedding of</p>
          </div>
        ) : (
          <p className="hero-eyebrow eyebrow mb-10">The Wedding Of</p>
        )}

        <h1 className="display flex flex-col items-center leading-none text-ink">
          <span className="hero-name text-[clamp(3rem,11vw,8.5rem)]">
            {first}
          </span>
          <span
            className="hero-amp font-script mt-[0.3em] mb-[0.12em] text-[clamp(2.2rem,6.5vw,4.6rem)] leading-none text-gold"
            aria-hidden="true"
          >
            {invitation.conjunction}
          </span>
          <span className="hero-name text-[clamp(3rem,11vw,8.5rem)]">
            {second}
          </span>
        </h1>

        <p className="hero-tagline lede mt-10 max-w-sm text-sm tracking-wide">
          {invitation.tagline}
        </p>

        <div className="hero-cue mt-16 flex flex-col items-center">
          <Seal onOpen={openInvitation} />
        </div>
      </div>
    </section>
  );
}
