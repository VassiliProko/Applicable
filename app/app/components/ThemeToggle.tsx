"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, mounted, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-surface-2 text-text-secondary transition-all duration-200 hover:bg-surface-3 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {!mounted ? <Sun size={20} /> : theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
