"use client";

import { Project } from "@/app/lib/types";
import { Clock } from "lucide-react";

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
      className="flex h-full cursor-pointer flex-col rounded-[12px] border border-transparent bg-surface-1 p-[18px] transition-all duration-200 hover:border-[var(--border-base)] hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-[0.99]"
    >
      <h3 className="type-title line-clamp-2">{project.title}</h3>

      <div className="mt-3 aspect-[4/3] w-full overflow-hidden rounded-[8px] bg-black">
        {project.imageUrl && (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <p className="type-body mt-3 line-clamp-2 text-text-secondary">{project.tagline}</p>

      <div className="mt-auto flex items-center justify-between pt-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-white">
            {project.logoUrl ? (
              <img
                src={project.logoUrl}
                alt={`${project.companyName} logo`}
                className="h-6 w-6 object-contain"
              />
            ) : (
              <span className="text-sm font-semibold text-black">
                {project.companyName.charAt(0)}
              </span>
            )}
          </div>
          <span className="type-caption font-medium text-text-secondary">
            {project.companyName}
          </span>
        </div>
        <span className="type-caption inline-flex items-center gap-1 text-text-tertiary">
          <Clock size={12} />
          {project.timeCommitment}
        </span>
      </div>
    </div>
  );
}
