"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { registerLenis } from "@/lib/smoothScroll";

/**
 * Owns scrolling for the whole page. Lenis provides the eased programmatic
 * scroll and drives GSAP's ScrollTrigger, but wheel/touch/keys are handled
 * here as discrete gestures: one gesture advances at most one section, so the
 * page always moves a whole scene at a time and never flies past several.
 *
 * The tall invitation (any section without `data-snap`) is the exception — it
 * steps through in viewport-sized chunks so its lower content stays reachable,
 * but a single gesture still never crosses out of it into the next section.
 */
export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      ScrollTrigger.refresh();
      return;
    }

    // Lenis animates programmatic scrolls and syncs ScrollTrigger; its own
    // wheel/touch smoothing is off because the controller below owns input.
    const lenis = new Lenis({
      smoothWheel: false,
      touchMultiplier: 0,
    });

    registerLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000); // Lenis expects milliseconds
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // --- One-gesture-per-section controller -------------------------------
    const DURATION = 0.8; // seconds per section transition
    const REARM = 90; // ms of settle after the glide before the next gesture
    const SWIPE = 40; // px of travel before a touch counts as a swipe

    // Locked only for the length of one glide. Crucially, incoming events do
    // NOT extend the lock — otherwise continuous scrolling would keep it held
    // forever and the page would appear stuck after a single step.
    let locked = false;
    let lockTimer = 0;

    const glideTo = (y: number) => {
      locked = true;
      window.clearTimeout(lockTimer);
      lockTimer = window.setTimeout(() => {
        locked = false;
      }, DURATION * 1000 + REARM);
      lenis.scrollTo(y, { duration: DURATION });
    };

    interface Stop {
      top: number;
      height: number;
      snap: boolean;
    }

    const stops = (): Stop[] =>
      Array.from(
        document.querySelectorAll<HTMLElement>("main > section")
      ).map((el) => ({
        top: Math.round(el.getBoundingClientRect().top + window.scrollY),
        height: el.offsetHeight,
        snap: el.hasAttribute("data-snap"),
      }));

    // Move one step in `dir` (+1 down, -1 up) from the current position.
    const step = (dir: number) => {
      const list = stops();
      const vh = window.innerHeight;
      const y = window.scrollY;

      let idx = 0;
      for (let i = 0; i < list.length; i++) {
        if (y >= list[i].top - 2) idx = i;
      }
      const cur = list[idx];
      const maxInternal = cur.top + cur.height - vh; // keeps `cur` filling

      // A tall, freely-read section steps within itself before handing off.
      if (!cur.snap) {
        if (dir > 0 && y < maxInternal - 2) {
          glideTo(Math.min(y + vh * 0.9, maxInternal));
          return;
        }
        if (dir < 0 && y > cur.top + 2) {
          glideTo(Math.max(y - vh * 0.9, cur.top));
          return;
        }
      }

      const nextIdx = Math.min(list.length - 1, Math.max(0, idx + dir));
      if (nextIdx === idx) return;
      const dest = list[nextIdx];
      // Enter a section top-first going down, bottom-first coming up, so tall
      // sections reveal from the edge you're arriving from.
      const target =
        dir > 0 ? dest.top : dest.top + Math.max(0, dest.height - vh);
      glideTo(target);
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return; // let pinch-zoom through
      e.preventDefault();
      if (locked || Math.abs(e.deltaY) < 1) return;
      step(e.deltaY > 0 ? 1 : -1);
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault(); // we own vertical movement
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (locked) return;
      const delta = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(delta) < SWIPE) return;
      step(delta > 0 ? 1 : -1);
    };

    const onKey = (e: KeyboardEvent) => {
      const down = ["ArrowDown", "PageDown"].includes(e.key);
      const up = ["ArrowUp", "PageUp"].includes(e.key);
      if (!down && !up) return;
      e.preventDefault();
      if (!locked) step(down ? 1 : -1);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);

    // Recalculate triggers once fonts/images settle layout
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      gsap.ticker.remove(raf);
      window.clearTimeout(lockTimer);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("load", refresh);
      registerLenis(null);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
