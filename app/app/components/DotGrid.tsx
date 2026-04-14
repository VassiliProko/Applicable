"use client";

import { useRef, useEffect, useCallback } from "react";

interface Cell {
  col: number;
  row: number;
  x: number;
  y: number;
  inPatch: boolean;
  baseOpacity: number;
  currentOpacity: number;
  targetOpacity: number;
}

export default function DotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cellsRef = useRef<Cell[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animRef = useRef<number>(0);
  const cellSize = 32;
  const gap = 1;
  const step = cellSize + gap;

  const initCells = useCallback((width: number, height: number) => {
    const cells: Cell[] = [];
    const cols = Math.ceil(width / step) + 1;
    const rows = Math.ceil(height / step) + 1;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * step;
        const y = row * step;

        const baseOpacity = 0;

        cells.push({
          col,
          row,
          x,
          y,
          inPatch: true,
          baseOpacity,
          currentOpacity: baseOpacity,
          targetOpacity: baseOpacity,
        });
      }
    }
    // Light up ~50 random cells
    const indices = Array.from({ length: cells.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    for (let i = 0; i < Math.min(50, cells.length); i++) {
      cells[indices[i]].baseOpacity = 0.08 + Math.random() * 0.15;
      cells[indices[i]].currentOpacity = cells[indices[i]].baseOpacity;
      cells[indices[i]].targetOpacity = cells[indices[i]].baseOpacity;
    }

    cellsRef.current = cells;
  }, [step]);

  // Deterministic random set for cursor — which cells around cursor light up
  // Map from cell key to assigned opacity (stable per cell to avoid flicker)
  const cursorCellsRef = useRef<Map<string, number>>(new Map());
  const lastCursorCell = useRef("");
  const lastShuffleRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    const style = getComputedStyle(document.documentElement);
    const primaryColor = style.getPropertyValue("--primary-500").trim() || "#E8432A";

    // Shuffle cells every 2 seconds — maintain ~50 lit cells total
    const now = Date.now();
    if (now - lastShuffleRef.current > 2000) {
      lastShuffleRef.current = now;
      const cells = cellsRef.current;
      const maxLit = 50;

      // Turn off some random lit cells
      const litCells = cells.filter((c) => c.baseOpacity > 0);
      const turnOffCount = Math.min(litCells.length, 5 + Math.floor(Math.random() * 5));
      for (let j = 0; j < turnOffCount; j++) {
        const idx = Math.floor(Math.random() * litCells.length);
        litCells[idx].baseOpacity = 0;
      }

      // Turn on some random dark cells (only if under max)
      const currentLit = cells.filter((c) => c.baseOpacity > 0).length;
      if (currentLit < maxLit) {
        const darkCells = cells.filter((c) => c.baseOpacity === 0);
        const turnOnCount = Math.min(darkCells.length, turnOffCount);
        for (let j = 0; j < turnOnCount; j++) {
          const idx = Math.floor(Math.random() * darkCells.length);
          darkCells[idx].baseOpacity = 0.08 + Math.random() * 0.15;
        }
      }
    }

    const mouse = mouseRef.current;
    const cursorRadius = 3; // in cells
    const mouseCol = Math.round(mouse.x / step);
    const mouseRow = Math.round(mouse.y / step);
    const cursorKey = `${mouseCol},${mouseRow}`;

    // When cursor moves to a new cell, pick random cells around it
    if (cursorKey !== lastCursorCell.current && mouse.x > 0) {
      lastCursorCell.current = cursorKey;
      for (let dr = -cursorRadius; dr <= cursorRadius; dr++) {
        for (let dc = -cursorRadius; dc <= cursorRadius; dc++) {
          const dist = Math.sqrt(dr * dr + dc * dc);
          if (dist > cursorRadius) continue;
          const key = `${mouseCol + dc},${mouseRow + dr}`;
          // Only assign opacity once per cell (stable value avoids flicker)
          if (!cursorCellsRef.current.has(key) && Math.random() < 0.06) {
            cursorCellsRef.current.set(key, 0.3 + Math.random() * 0.15);
          }
        }
      }

      // Clean up old cells that are far from cursor
      const toRemove: string[] = [];
      cursorCellsRef.current.forEach((_, k) => {
        const [c, r] = k.split(",").map(Number);
        const d = Math.sqrt((c - mouseCol) ** 2 + (r - mouseRow) ** 2);
        if (d > cursorRadius * 2.5) toRemove.push(k);
      });
      toRemove.forEach((k) => cursorCellsRef.current.delete(k));
    }

    const cells = cellsRef.current;

    // Draw grid lines (the gaps between cells)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.07)";
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

    // Content zone fade: reduce opacity for cells near the left where text sits.
    // Fade zone covers roughly the left 45% and top 70% of the canvas.
    const fadeRight = width * 0.45;
    const fadeBottom = height * 0.75;

    // Draw lit cells with primary color
    ctx.fillStyle = primaryColor;
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      const cellKey = `${cell.col},${cell.row}`;
      const cursorOpacity = cursorCellsRef.current.get(cellKey);

      if (cursorOpacity !== undefined) {
        cell.targetOpacity = Math.max(cell.baseOpacity, cursorOpacity);
      } else {
        cell.targetOpacity = cell.baseOpacity;
      }

      // Lerp
      cell.currentOpacity += (cell.targetOpacity - cell.currentOpacity) * 0.1;

      if (cell.currentOpacity < 0.01) continue;

      // Dampen opacity in the content zone so squares don't compete with text
      let dampen = 1;
      if (cell.x < fadeRight && cell.y < fadeBottom) {
        const xFactor = 1 - cell.x / fadeRight;   // 1 at left edge, 0 at fadeRight
        const yFactor = 1 - cell.y / fadeBottom;   // 1 at top, 0 at fadeBottom
        dampen = 1 - xFactor * yFactor * 0.85;     // up to 85% reduction in top-left
      }

      ctx.globalAlpha = cell.currentOpacity * dampen;
      ctx.fillRect(cell.x, cell.y, cellSize, cellSize);
    }

    ctx.globalAlpha = 1;
    animRef.current = requestAnimationFrame(draw);
  }, [step, cellSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      initCells(rect.width, rect.height);
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
  }, [initCells, draw]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-auto"
      style={{ zIndex: 0 }}
    />
  );
}
