"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, X, Search } from "lucide-react";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterSection {
  heading?: string;
  options: FilterOption[];
}

interface DropdownProps {
  label: string;
  sections: FilterSection[];
  selected: string[];
  onToggle: (value: string) => void;
}

function FilterDropdown({ label, sections, selected, onToggle }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-[8px] px-3.5 py-2 text-[14px] font-medium transition-all duration-200 ${
          selected.length > 0
            ? "bg-accent/50 text-white"
            : "text-text-secondary hover:text-text-primary hover:bg-surface-3"
        }`}
      >
        {label}
        {selected.length > 0 && (
          <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-white/20 px-1 text-[11px] font-bold text-white">
            {selected.length}
          </span>
        )}
        <ChevronDown
          size={14}
          className={`ml-0.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute left-0 top-full z-50 mt-2 min-w-[340px] max-h-[340px] overflow-y-auto rounded-[12px] border border-border bg-surface-1 p-2.5 dropdown-enter"
          style={{ boxShadow: "var(--shadow-high)" }}
        >
          {sections.map((section, si) => (
            <div key={si}>
              {section.heading && (
                <p className="px-3 pt-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
                  {section.heading}
                </p>
              )}
              {section.options.map((option) => {
                const isSelected = selected.includes(option.value);
                return (
                  <button
                    key={option.value}
                    onClick={() => onToggle(option.value)}
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-[8px] px-3.5 py-2.5 text-left text-[14px] transition-all duration-200 hover:bg-surface-2 ${
                      isSelected ? "text-text-primary" : "text-text-secondary"
                    }`}
                  >
                    <span
                      className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[4px] border transition-all duration-200 ${
                        isSelected
                          ? "border-accent bg-accent"
                          : "border-[rgba(255,255,255,0.12)]"
                      }`}
                    >
                      {isSelected && <Check size={11} className="text-white" />}
                    </span>
                    {option.label}
                  </button>
                );
              })}
              {si < sections.length - 1 && (
                <div className="my-2 border-t border-[rgba(255,255,255,0.04)]" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface FilterBarProps {
  categories: string[];
  skills: string[];
  selectedCategories: string[];
  selectedSkills: string[];
  selectedDifficulties: string[];
  searchQuery: string;
  onToggleCategory: (value: string) => void;
  onToggleSkill: (value: string) => void;
  onToggleDifficulty: (value: string) => void;
  onSearchChange: (value: string) => void;
  onClearAll: () => void;
  activeCount: number;
}

export default function FilterBar({
  categories,
  skills,
  selectedCategories,
  selectedSkills,
  selectedDifficulties,
  searchQuery,
  onToggleCategory,
  onToggleSkill,
  onToggleDifficulty,
  onSearchChange,
  onClearAll,
  activeCount,
}: FilterBarProps) {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const isSticky = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Detect when the bar leaves its natural position (becomes sticky)
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isSticky.current = !entry.isIntersecting;
        // When scrolling back up to natural position, always show
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Hide on scroll down, show on scroll up (only while sticky)
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (isSticky.current) {
        setVisible(y < lastScrollY.current);
      }
      lastScrollY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Sentinel: stays in document flow to detect when bar becomes sticky */}
      <div ref={sentinelRef} className="mt-8 h-0 w-0" aria-hidden />
      <div className="sticky top-[84px] z-40">
        <div
          className={`rounded-[14px] border border-border bg-surface-1 px-2 py-2 transition-all duration-200 ${
            visible
              ? "translate-y-0 opacity-100"
              : "-translate-y-full opacity-0 pointer-events-none"
          }`}
        >
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1">
          <FilterDropdown
            label="Cause"
            sections={[
              {
                options: categories.map((c) => ({ label: c, value: c })),
              },
            ]}
            selected={selectedCategories}
            onToggle={onToggleCategory}
          />
          <FilterDropdown
            label="Skills"
            sections={[
              {
                options: skills.map((s) => ({ label: s, value: s })),
              },
            ]}
            selected={selectedSkills}
            onToggle={onToggleSkill}
          />
          <FilterDropdown
            label="Other"
            sections={[
              {
                heading: "Difficulty",
                options: [
                  { label: "Beginner", value: "Beginner" },
                  { label: "Intermediate", value: "Intermediate" },
                  { label: "Advanced", value: "Advanced" },
                ],
              },
            ]}
            selected={selectedDifficulties}
            onToggle={onToggleDifficulty}
          />

          {activeCount > 0 && (
            <button
              onClick={onClearAll}
              className="ml-2 inline-flex cursor-pointer items-center gap-1 rounded-[8px] px-3 py-2 text-[13px] font-medium text-text-tertiary transition-all duration-200 hover:bg-error/10 hover:text-error"
            >
              <X size={14} />
              Clear all
            </button>
          )}
          </div>

          <div className="relative ml-auto">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search projects..."
              className="h-9 w-[320px] rounded-[8px] border border-border bg-white pl-9 pr-9 text-[14px] text-black placeholder:text-text-tertiary transition-all duration-200 focus:border-accent focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-[5px] top-1/2 -translate-y-1/2 flex h-[26px] w-[26px] cursor-pointer items-center justify-center rounded-[6px] text-zinc-400 transition-all duration-200 hover:bg-zinc-100 hover:text-zinc-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
