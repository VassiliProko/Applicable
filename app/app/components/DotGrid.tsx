"use client";

import { useRef, useEffect, useCallback } from "react";

interface Dot {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  radius: number;
  opacity: number;
  vx: number;
  vy: number;
}

interface TrailDot {
  x: number;
  y: number;
  radius: number;
  born: number;
  lifetime: number;
}

export default function DotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const trailRef = useRef<TrailDot[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const lastTrailRef = useRef(0);
  const animRef = useRef<number>(0);

  const initDots = useCallback((width: number, height: number) => {
    const dots: Dot[] = [];
    const spacing = 12;
    const cols = Math.ceil(width / spacing) + 1;
    const rows = Math.ceil(height / spacing) + 1;

    // Create random patch centers
    const patchCount = 12 + Math.floor(Math.random() * 4);
    const patches: { cx: number; cy: number; r: number }[] = [];
    for (let p = 0; p < patchCount; p++) {
      patches.push({
        cx: Math.random() * width,
        cy: Math.random() * height,
        r: 60 + Math.random() * 140,
      });
    }

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const baseX = col * spacing;
        const baseY = row * spacing;

        // Find influence from nearest patch
        let maxInfluence = 0;
        for (const patch of patches) {
          const dx = baseX - patch.cx;
          const dy = baseY - patch.cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < patch.r) {
            const influence = 1 - dist / patch.r;
            if (influence > maxInfluence) maxInfluence = influence;
          }
        }

        if (maxInfluence < 0.05) continue;

        const sizeFactor = maxInfluence * maxInfluence;
        const maxRadius = spacing * 0.45;
        const radius = maxRadius * sizeFactor;

        if (radius < 0.6) continue;

        dots.push({
          baseX,
          baseY,
          x: baseX,
          y: baseY,
          radius,
          opacity: 0.1 + sizeFactor * 0.4,
          vx: 0,
          vy: 0,
        });
      }
    }
    dotsRef.current = dots;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    const style = getComputedStyle(document.documentElement);
    const primaryColor = style.getPropertyValue("--primary-500").trim() || "#E8432A";
    const now = Date.now();

    // Draw static dots
    const dots = dotsRef.current;
    ctx.fillStyle = primaryColor;
    for (let i = 0; i < dots.length; i++) {
      const dot = dots[i];
      ctx.globalAlpha = dot.opacity;
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Spawn trail dots near mouse
    const mouse = mouseRef.current;
    if (mouse.x > 0 && mouse.y > 0 && mouse.x < width && mouse.y < height) {
      if (now - lastTrailRef.current > 30) {
        lastTrailRef.current = now;
        // Spawn a small halftone cluster around cursor
        const clusterRadius = 35;
        const gridStep = 10;
        const steps = Math.ceil(clusterRadius / gridStep);

        for (let gx = -steps; gx <= steps; gx++) {
          for (let gy = -steps; gy <= steps; gy++) {
            const dx = gx * gridStep;
            const dy = gy * gridStep;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > clusterRadius) continue;

            const influence = 1 - dist / clusterRadius;
            const r = gridStep * 0.4 * influence * influence;
            if (r < 0.5) continue;

            trailRef.current.push({
              x: mouse.x + dx,
              y: mouse.y + dy,
              radius: r,
              born: now,
              lifetime: 600 + Math.random() * 300,
            });
          }
        }
      }
    }

    // Draw and age trail dots
    const alive: TrailDot[] = [];
    for (const t of trailRef.current) {
      const age = now - t.born;
      if (age >= t.lifetime) continue;
      alive.push(t);

      const fadeOut = 1 - age / t.lifetime;
      ctx.globalAlpha = fadeOut * 0.45;
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.radius * fadeOut, 0, Math.PI * 2);
      ctx.fill();
    }
    trailRef.current = alive;

    ctx.globalAlpha = 1;
    animRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      initDots(rect.width, rect.height);
    };

    resize();
    animRef.current = requestAnimationFrame(draw);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [initDots, draw]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-auto"
      style={{ zIndex: 0 }}
    />
  );
}
