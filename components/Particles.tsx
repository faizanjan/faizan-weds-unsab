"use client";

import { useEffect, useRef } from "react";

type MoteKind = "dust" | "spark" | "heart";

interface Mote {
  kind: MoteKind;
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  baseAlpha: number;
  twinkle: number;
  phase: number;
  sway: number;
}

interface ParticlesProps {
  /** Density multiplier; dust count scales with viewport area. */
  density?: number;
  /** Number of brighter twinkling sparkles layered over the dust. */
  sparkles?: number;
  /** Number of slowly drifting hearts. */
  hearts?: number;
  className?: string;
}

const GOLD = "200, 169, 106";
const BLUSH = "222, 168, 158";

/**
 * Canvas atmosphere for the hero: warm dust motes drifting in light, a few
 * brighter twinkling sparkles, and a handful of slow-rising hearts — a quiet
 * suggestion of celebration. Pauses when hidden and respects reduced-motion.
 */
export function Particles({
  density = 1,
  sparkles = 0,
  hearts = 0,
  className,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let motes: Mote[] = [];
    let raf = 0;
    let running = true;

    const seed = () => {
      const dustCount = Math.round(
        Math.min(90, (width * height) / 16000) * density
      );

      const dust: Mote[] = Array.from({ length: dustCount }, () => ({
        kind: "dust",
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.6 + 0.4,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -(Math.random() * 0.14 + 0.03),
        baseAlpha: Math.random() * 0.4 + 0.1,
        twinkle: Math.random() * 0.02 + 0.004,
        phase: Math.random() * Math.PI * 2,
        sway: 0,
      }));

      const spark: Mote[] = Array.from({ length: sparkles }, () => ({
        kind: "spark",
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.4 + 1.1,
        vx: (Math.random() - 0.5) * 0.08,
        vy: -(Math.random() * 0.1 + 0.02),
        baseAlpha: Math.random() * 0.35 + 0.5,
        twinkle: Math.random() * 0.05 + 0.03,
        phase: Math.random() * Math.PI * 2,
        sway: 0,
      }));

      const heart: Mote[] = Array.from({ length: hearts }, () => ({
        kind: "heart",
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 7 + 7,
        vx: 0,
        vy: -(Math.random() * 0.12 + 0.08),
        baseAlpha: Math.random() * 0.16 + 0.1,
        twinkle: Math.random() * 0.01 + 0.004,
        phase: Math.random() * Math.PI * 2,
        sway: Math.random() * 0.5 + 0.25,
      }));

      motes = [...dust, ...spark, ...heart];
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const traceHeart = (x: number, y: number, s: number) => {
      const t = s / 2;
      ctx.beginPath();
      ctx.moveTo(x, y + t * 0.6);
      ctx.bezierCurveTo(x, y, x - t, y, x - t, y + t * 0.6);
      ctx.bezierCurveTo(x - t, y + t * 1.2, x, y + t * 1.6, x, y + s);
      ctx.bezierCurveTo(x, y + t * 1.6, x + t, y + t * 1.2, x + t, y + t * 0.6);
      ctx.bezierCurveTo(x + t, y, x, y, x, y + t * 0.6);
      ctx.closePath();
    };

    const drawSpark = (m: Mote, glow: number) => {
      const a = m.baseAlpha * glow;
      // soft halo
      const grad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 4);
      grad.addColorStop(0, `rgba(${GOLD}, ${a})`);
      grad.addColorStop(1, `rgba(${GOLD}, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r * 4, 0, Math.PI * 2);
      ctx.fill();

      // core
      ctx.fillStyle = `rgba(255, 248, 232, ${Math.min(1, a + 0.15)})`;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r * 0.6, 0, Math.PI * 2);
      ctx.fill();

      // 4-ray glint when the twinkle peaks
      if (glow > 0.82) {
        const ray = m.r * 6 * (glow - 0.82) * 5;
        ctx.strokeStyle = `rgba(${GOLD}, ${a * 0.9})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(m.x - ray, m.y);
        ctx.lineTo(m.x + ray, m.y);
        ctx.moveTo(m.x, m.y - ray);
        ctx.lineTo(m.x, m.y + ray);
        ctx.stroke();
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const m of motes) {
        m.phase += m.twinkle;

        if (m.kind === "heart") {
          m.y += m.vy;
          m.x += Math.sin(m.phase) * m.sway;
          if (m.y < -m.r * 2) {
            m.y = height + m.r * 2;
            m.x = Math.random() * width;
          }
          const a = m.baseAlpha * (0.7 + 0.3 * Math.sin(m.phase));
          traceHeart(m.x, m.y, m.r);
          ctx.fillStyle = `rgba(${BLUSH}, ${a * 0.5})`;
          ctx.fill();
          ctx.strokeStyle = `rgba(${GOLD}, ${a})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
          continue;
        }

        m.x += m.vx;
        m.y += m.vy;
        if (m.y < -4) {
          m.y = height + 4;
          m.x = Math.random() * width;
        }
        if (m.x < -4) m.x = width + 4;
        if (m.x > width + 4) m.x = -4;

        const glow = 0.55 + 0.45 * Math.sin(m.phase);
        if (m.kind === "spark") {
          drawSpark(m, glow);
          continue;
        }

        const alpha = m.baseAlpha * (0.6 + 0.4 * Math.sin(m.phase));
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${GOLD}, ${alpha})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      running = !document.hidden;
      if (running && !reduced) {
        raf = requestAnimationFrame(draw);
      } else {
        cancelAnimationFrame(raf);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    if (reduced) {
      // Draw a single static frame so the scene isn't empty.
      draw();
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [density, sparkles, hearts]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
