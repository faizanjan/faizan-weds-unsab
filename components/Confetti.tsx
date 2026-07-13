"use client";

import { useEffect, useRef } from "react";

interface Piece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  w: number;
  h: number;
  color: string;
  life: number;
}

/** Warm confetti that reads against the ivory ground. */
const COLORS = ["#c8a96a", "#d99f86", "#b7924e", "#9fae9d", "#e8d8a8"];

interface ConfettiProps {
  className?: string;
}

/**
 * A single, restrained confetti fall that fires the first time the section
 * scrolls into view — a small flourish to open the countdown, then it settles
 * and stops. Still for reduced-motion users.
 */
export function Confetti({ className }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let last = performance.now();
    let started = false;
    let pieces: Piece[] = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const burst = (count: number) => {
      for (let i = 0; i < count; i++) {
        pieces.push({
          x: width * (0.18 + Math.random() * 0.64),
          y: -20 - Math.random() * height * 0.15,
          vx: (Math.random() - 0.5) * 2.4,
          vy: 1.4 + Math.random() * 2.4,
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.32,
          w: 5 + Math.random() * 5,
          h: 8 + Math.random() * 6,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          life: 1,
        });
      }
    };

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      ctx.clearRect(0, 0, width, height);
      pieces = pieces.filter((p) => p.life > 0 && p.y < height + 40);

      for (const p of pieces) {
        p.vy += 7 * dt; // gravity
        p.vx *= 0.99;
        p.x += p.vx + Math.sin(now / 320 + p.rot) * 0.5;
        p.y += p.vy;
        p.rot += p.vr;
        // fade out as pieces reach the lower third
        if (p.y > height * 0.68) p.life -= dt * 0.9;

        ctx.globalAlpha = Math.max(0, Math.min(1, p.life));
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        // a touch of foreshortening as the piece flutters
        const fh = p.h * (0.55 + 0.45 * Math.abs(Math.sin(p.rot)));
        ctx.fillRect(-p.w / 2, -fh / 2, p.w, fh);
        ctx.restore();
      }
      ctx.globalAlpha = 1;

      if (pieces.length) raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !started) {
            started = true;
            last = performance.now();
            burst(46);
            // a small trailing wave for a livelier opening
            window.setTimeout(() => burst(22), 360);
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(draw);
          }
        }
      },
      { threshold: 0.35 }
    );
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
