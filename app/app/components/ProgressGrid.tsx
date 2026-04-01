"use client";

import { useMemo } from "react";

const COLS = 14;
const ROWS = 10;
const TOTAL = COLS * ROWS;

export default function ProgressGrid({
  percent,
  completed = false,
}: {
  percent: number;
  completed?: boolean;
}) {
  const filledCount = Math.round((percent / 100) * TOTAL);

  const { filledSet, opacities } = useMemo(() => {
    const indices = Array.from({ length: TOTAL }, (_, i) => i);

    // Deterministic shuffle
    let rng = 42;
    function nextRng() {
      rng = (rng * 16807) % 2147483647;
      return rng / 2147483647;
    }
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(nextRng() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    const filled = new Set(indices.slice(0, filledCount));

    // Deterministic opacity per filled cell
    const ops: Record<number, number> = {};
    indices.slice(0, filledCount).forEach((idx) => {
      ops[idx] = 0.5 + nextRng() * 0.5;
    });

    return { filledSet: filled, opacities: ops };
  }, [filledCount]);

  const isComplete = percent >= 100;

  return (
    <div className="relative w-full aspect-4/3 bg-border overflow-hidden">
      {/* Grid */}
      <div
        className="absolute inset-0 grid gap-px"
        style={{
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        }}
      >
        {Array.from({ length: TOTAL }, (_, i) => {
          const isFilled = filledSet.has(i);
          return (
            <div
              key={i}
              className={`rounded-xs transition-all duration-700 ${
                isFilled
                  ? "bg-primary"
                  : "bg-surface-2"
              }`}
              style={
                isFilled && !isComplete
                  ? { opacity: opacities[i] }
                  : undefined
              }
            />
          );
        })}
      </div>

      {/* Radial vignette overlay — orange when completed */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-1000"
        style={{
          background: completed
            ? "radial-gradient(ellipse at center, transparent 10%, var(--primary-500) 75%)"
            : "radial-gradient(ellipse at center, transparent 25%, var(--surface-1) 75%)",
        }}
      />
    </div>
  );
}
