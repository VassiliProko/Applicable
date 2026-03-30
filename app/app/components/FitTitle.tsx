"use client";

import { useRef, useEffect } from "react";

export default function FitTitle({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reset font size
    el.style.fontSize = "";

    // Shrink until it fits in one line
    let size = parseFloat(getComputedStyle(el).fontSize);
    const minSize = 14;

    while (el.scrollHeight > el.clientHeight + 2 && size > minSize) {
      size -= 1;
      el.style.fontSize = `${size}px`;
    }
  }, [children]);

  return (
    <h3
      ref={ref}
      className={className}
      style={{ overflow: "hidden", maxHeight: "2em", lineHeight: "1.35" }}
    >
      {children}
    </h3>
  );
}
