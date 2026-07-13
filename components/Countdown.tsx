"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE } from "@/lib/animations";
import { invitation } from "@/data/invitation";
import { Fireworks } from "@/components/Fireworks";
import { FloralDivider } from "@/components/ornaments/FloralDivider";
import couple from "../public/couple.jpg";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const MS = { day: 86_400_000, hour: 3_600_000, minute: 60_000, second: 1_000 };

function computeTimeLeft(target: number): TimeLeft {
  const total = Math.max(0, target - Date.now());
  return {
    days: Math.floor(total / MS.day),
    hours: Math.floor((total % MS.day) / MS.hour),
    minutes: Math.floor((total % MS.hour) / MS.minute),
    seconds: Math.floor((total % MS.minute) / MS.second),
  };
}

/**
 * A quiet countdown to the moment the celebrations begin. Values resolve only
 * after mount so server and client markup never disagree.
 */
export function Countdown() {
  const root = useRef<HTMLElement>(null);
  const target = new Date(invitation.countdownTarget).getTime();
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTimeLeft(computeTimeLeft(target));
    const id = window.setInterval(
      () => setTimeLeft(computeTimeLeft(target)),
      1000
    );
    return () => window.clearInterval(id);
  }, [target]);

  useGSAP(
    () => {
      gsap.from(gsap.utils.selector(root)(".count-reveal"), {
        y: 26,
        autoAlpha: 0,
        duration: 1.1,
        ease: EASE.luxe,
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: "top 78%" },
      });
    },
    { scope: root }
  );

  const hasArrived =
    timeLeft !== null &&
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  const units: readonly { label: string; value: number | null; pad: boolean }[] =
    [
      { label: "Days", value: timeLeft?.days ?? null, pad: false },
      { label: "Hours", value: timeLeft?.hours ?? null, pad: true },
      { label: "Minutes", value: timeLeft?.minutes ?? null, pad: true },
      { label: "Seconds", value: timeLeft?.seconds ?? null, pad: true },
    ];

  return (
    <section
      ref={root}
      data-snap
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-start px-6 pb-16 pt-[13vh]"
      aria-label="Countdown to the celebration"
    >
      {/* The couple, as a soft backdrop the celebration counts down to. White
          ground drops away under multiply, leaving just the figures. */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-end justify-center overflow-hidden">
        <div className="relative h-[80%] w-full max-w-sm">
          <Image
            src={couple}
            alt=""
            fill
            sizes="(max-width: 640px) 90vw, 384px"
            className="object-contain object-bottom opacity-40 mix-blend-multiply"
          />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-[1] opacity-80">
        <Fireworks />
      </div>

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
        <p className="count-reveal eyebrow">Counting the Days</p>

        {hasArrived ? (
          <h2 className="count-reveal display mt-8 text-[clamp(2rem,6vw,3.6rem)] text-ink">
            Today, we celebrate.
          </h2>
        ) : (
          <ul className="count-reveal mt-10 flex items-start justify-center gap-4 sm:gap-10">
            {units.map((unit, i) => (
              <li key={unit.label} className="flex items-start">
                <div className="flex min-w-[3.4rem] flex-col items-center sm:min-w-[5rem]">
                  <span
                    suppressHydrationWarning
                    className="display text-[clamp(2.6rem,9vw,5rem)] leading-none text-ink tabular-nums"
                  >
                    {unit.value === null
                      ? "–"
                      : unit.pad
                        ? String(unit.value).padStart(2, "0")
                        : unit.value}
                  </span>
                  <span className="mt-4 text-[0.6rem] uppercase tracking-[0.3em] text-ink-soft/80 sm:text-xs">
                    {unit.label}
                  </span>
                </div>
                {i < units.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="display mt-[0.1em] text-[clamp(2rem,7vw,3.6rem)] leading-none text-gold/50"
                  >
                    :
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}

        <FloralDivider className="count-reveal mt-14" />
      </div>
    </section>
  );
}
