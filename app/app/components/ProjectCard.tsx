"use client";

import { Project } from "@/app/lib/types";
import { Clock, Zap } from "lucide-react";

/* ── Category → accent color ── */
const categoryColors: Record<string, string> = {
  Engineering: "bg-blue-500/15 text-blue-400",
  Design: "bg-violet-500/15 text-violet-400",
  "Data & Analytics": "bg-emerald-500/15 text-emerald-400",
  Mobile: "bg-orange-500/15 text-orange-400",
  DevOps: "bg-cyan-500/15 text-cyan-400",
  Content: "bg-amber-500/15 text-amber-400",
  Marketing: "bg-pink-500/15 text-pink-400",
  Product: "bg-indigo-500/15 text-indigo-400",
};

const categoryThumbnails: Record<string, string> = {
  Design: "/Thumbnails/design.png",
  Mobile: "/Thumbnails/mobile.png",
  Marketing: "/Thumbnails/marketing.png",
  Engineering: "/Thumbnails/dev.png",
  DevOps: "/Thumbnails/dev.png",
  "Data & Analytics": "/Thumbnails/dev.png",
  Content: "/Thumbnails/dev.png",
  Product: "/Thumbnails/dev.png",
};

const difficultyLabels: Record<string, string> = {
  Beginner: "Beginner",
  Intermediate: "Mid",
  Advanced: "Advanced",
};

function getThumbnail(project: Project): string {
  if (project.imageUrl) return project.imageUrl;
  return categoryThumbnails[project.category] || "/Thumbnails/dev.png";
}

function getUrgencyLabel(project: Project): string | null {
  if (!project.milestones?.length) return null;
  const first = project.milestones[0];
  if (!first.deadline) return null;
  const days = Math.ceil(
    (new Date(first.deadline + "T00:00:00").getTime() - Date.now()) /
      (1000 * 60 * 60 * 24)
  );
  if (days < 0) return null;
  if (days <= 7) return "Starts this week";
  if (days <= 14) return "Starts next week";
  return null;
}

export default function ProjectCard({
  project,
  onClick,
}: {
  project: Project;
  onClick: (project: Project) => void;
}) {
  const urgency = getUrgencyLabel(project);
  const catColor = categoryColors[project.category] || "bg-zinc-500/15 text-zinc-400";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(project)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(project);
        }
      }}
      className="group flex h-full cursor-pointer flex-col rounded-xl border border-transparent bg-surface-1 p-5 transition-all duration-200 hover:bg-surface-2 hover:border-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-[0.99]"
    >
      {/* Image */}
      <div className="w-full aspect-[16/9] overflow-hidden rounded-xl bg-black">
        <img
          src={getThumbnail(project)}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>

      {/* Category pill + urgency */}
      <div className="flex items-center gap-2 mt-4 mb-2">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase ${catColor}`}
        >
          {project.category}
        </span>
        {urgency && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#F5A432]/15 px-2.5 py-0.5 text-xs font-semibold text-[#F5A432]">
            <Zap size={11} />
            {urgency}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold leading-snug text-text-primary line-clamp-2">
        {project.title}
      </h3>

      {/* Description */}
      <p className="mt-1.5 text-sm leading-relaxed text-text-secondary line-clamp-2">
        {project.description}
      </p>

      {/* Footer — org + meta */}
      <div className="mt-auto flex items-center justify-between pt-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white">
            {project.logoUrl ? (
              <img
                src={project.logoUrl}
                alt={`${project.companyName} logo`}
                className="h-4.5 w-4.5 object-contain"
              />
            ) : (
              <span className="text-xs font-bold text-black">
                {project.companyName.charAt(0)}
              </span>
            )}
          </div>
          <span className="truncate text-sm font-medium text-text-secondary">
            {project.companyName}
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-medium text-text-disabled">
            {difficultyLabels[project.difficulty] || project.difficulty}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-text-tertiary">
            <Clock size={13} />
            {project.timeCommitment}
          </span>
        </div>
      </div>
    </div>
  );
}
