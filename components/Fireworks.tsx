"use client";

import { useEffect, useRef } from "react";

interface Spark {
  x: number;
  y: number;
  px: number;
  py: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

interface FireworksProps {
  className?: string;
}

/** Warm palette that holds up against the ivory background. */
const COLORS = ["#c8a96a", "#b7924e", "#a8843f", "#d99f86", "#c98b73"];

/**
 * Sparse gold fireworks for the countdown. Aerial bursts fade with gravity and
 * trailing streaks — celebratory but restrained. Pauses when the tab is hidden
 * and stays still for reduced-motion users.
 */
export function Fireworks({ className }: FireworksProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let sparks: Spark[] = [];
    let raf = 0;
    let last = performance.now();
    let nextBurst = 250;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const burst = () => {
      const cx = width * (0.18 + Math.random() * 0.64);
      const cy = height * (0.12 + Math.random() * 0.38);
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const count = 34 + Math.floor(Math.random() * 22);
      const speed = 1.7 + Math.random() * 1.3;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.2;
        const v = speed * (0.55 + Math.random() * 0.6);
        sparks.push({
          x: cx,
          y: cy,
          px: cx,
          py: cy,
          vx: Math.cos(angle) * v,
          vy: Math.sin(angle) * v,
          life: 1,
          maxLife: 0.8 + Math.random() * 0.6,
          color,
        });
      }
    };

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      nextBurst -= dt * 1000;
      if (nextBurst <= 0) {
        burst();
        // occasionally a quick double for a livelier sky
        if (Math.random() < 0.4) burst();
        nextBurst = 550 + Math.random() * 700;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.lineCap = "round";

      sparks = sparks.filter((s) => s.life > 0);
      for (const s of sparks) {
        s.px = s.x;
        s.py = s.y;
        s.vy += 1.4 * dt; // gravity
        s.vx *= 0.985;
        s.vy *= 0.985;
        s.x += s.vx;
        s.y += s.vy;
        s.life -= dt / s.maxLife;

        const alpha = Math.max(0, s.life);
        ctx.strokeStyle = s.color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 1.6 * alpha + 0.4;
        ctx.beginPath();
        ctx.moveTo(s.px, s.py);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();

        // bright head
        ctx.globalAlpha = alpha * 0.9;
        ctx.beginPath();
        ctx.arc(s.x, s.y, ctx.lineWidth * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        last = performance.now();
        raf = requestAnimationFrame(draw);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
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
