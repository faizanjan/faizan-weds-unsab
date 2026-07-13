"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import Snap from "lenis/snap";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { registerLenis } from "@/lib/smoothScroll";

/**
 * Wraps the app in Lenis smooth scrolling and drives GSAP's ScrollTrigger
 * from Lenis' RAF loop, so scrubbed timelines stay perfectly in sync with
 * the eased scroll position.
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

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
      wheelMultiplier: 1,
    });

    registerLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      // Lenis expects milliseconds
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Snap each full-height section to the top of the viewport, so the reader
    // always lands on a whole scene rather than the seam between two. Proximity
    // (not mandatory) keeps the taller, freely-read invitation scrollable — it
    // only pulls in when a section top is genuinely near.
    const snap = new Snap(lenis, {
      type: "proximity",
      distanceThreshold: "55%",
      duration: 0.9,
    });
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("main > section[data-snap]")
    );
    const removeSnaps = sections.map((section) =>
      snap.addElement(section, { align: "start" })
    );

    // Recalculate triggers once fonts/images settle layout
    const refresh = () => {
      ScrollTrigger.refresh();
      snap.resize();
    };
    window.addEventListener("load", refresh);

    return () => {
      gsap.ticker.remove(raf);
      removeSnaps.forEach((remove) => remove());
      snap.destroy();
      registerLenis(null);
      lenis.destroy();
      window.removeEventListener("load", refresh);
    };
  }, []);

  return <>{children}</>;
}
