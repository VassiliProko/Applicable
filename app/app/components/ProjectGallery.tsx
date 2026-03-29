"use client";

import { useState } from "react";
import { projects } from "@/app/lib/mock-data";
import { Project } from "@/app/lib/types";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";

export default function ProjectGallery() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="projects" className="px-9 py-18 scroll-mt-6">
      <div className="mx-auto max-w-[1280px]">
        <h2 className="type-headline">Discover Projects</h2>
        <p className="type-body mt-2 max-w-lg text-text-secondary">
          Real-world projects across every discipline. Pick one that excites you
          and prove what you can do.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <div
              key={project.id}
              style={{
                animationDelay: `${i * 30}ms`,
                animationFillMode: "both",
              }}
            >
              <ProjectCard project={project} onClick={setSelectedProject} />
            </div>
          ))}
        </div>
      </div>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
