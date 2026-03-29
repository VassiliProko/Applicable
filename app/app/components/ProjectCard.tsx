"use client";

import { Project } from "@/app/lib/types";
import { Clock, Signal } from "lucide-react";

const difficultyColor: Record<Project["difficulty"], string> = {
  Beginner: "bg-success/15 text-success",
  Intermediate: "bg-secondary/15 text-secondary",
  Advanced: "bg-primary/15 text-primary",
};

export default function ProjectCard({
  project,
  onClick,
}: {
  project: Project;
  onClick: (project: Project) => void;
}) {
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
      className="cursor-pointer rounded-[12px] bg-surface-1 p-[18px] transition-all duration-100 hover:-translate-y-px hover:shadow-[var(--shadow-mid)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-[0.99]"
      style={{ boxShadow: "var(--shadow-low)" }}
    >
      <h3 className="type-title">{project.title}</h3>
      <p className="type-body mt-2 text-text-secondary">{project.tagline}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.skillTags.map((tag) => (
          <span
            key={tag}
            className="type-caption rounded-full bg-accent/10 px-2.5 py-0.5 font-medium text-accent"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span
          className={`type-caption inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${difficultyColor[project.difficulty]}`}
        >
          <Signal size={12} />
          {project.difficulty}
        </span>
        <span className="type-caption inline-flex items-center gap-1 text-text-tertiary">
          <Clock size={12} />
          {project.timeCommitment}
        </span>
      </div>
    </div>
  );
}
