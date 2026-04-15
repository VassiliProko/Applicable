"use client";

import { useRef, useEffect, useCallback } from "react";

export default function StaticGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const cellSize = 32;
  const gap = 1;
  const step = cellSize + gap;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    const style = getComputedStyle(document.documentElement);
    const isLight = style.getPropertyValue("--background").trim() === "#ffffff";
    ctx.strokeStyle = isLight ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.07)";
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 1;

    const cols = Math.ceil(width / step) + 1;
    const rows = Math.ceil(height / step) + 1;

    for (let c = 0; c <= cols; c++) {
      const x = c * step - gap / 2;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let r = 0; r <= rows; r++) {
      const y = r * step - gap / 2;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }, [step, gap]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      draw();
    };

    resize();
    window.addEventListener("resize", resize);

    // Redraw when theme changes
    const observer = new MutationObserver(() => draw());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
