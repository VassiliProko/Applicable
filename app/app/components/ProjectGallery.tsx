"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { projects as mockProjects } from "@/app/lib/mock-data";
import { Project } from "@/app/lib/types";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";
import FilterBar from "./FilterBar";

function toggle(arr: string[], value: string) {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

export default function ProjectGallery() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch projects from DB, fall back to mock data
  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
        }
      })
      .catch(() => {});
  }, []);

  const categories = useMemo(
    () => [...new Set(projects.map((p) => p.category))].sort(),
    [projects]
  );

  const skills = useMemo(
    () => [...new Set(projects.flatMap((p) => p.skillTags))].sort(),
    [projects]
  );

  const activeCount =
    selectedCategories.length +
    selectedSkills.length +
    selectedDifficulties.length;

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return projects.filter((p) => {
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(p.category)
      )
        return false;
      if (
        selectedSkills.length > 0 &&
        !selectedSkills.some((s) => p.skillTags.includes(s))
      )
        return false;
      if (
        selectedDifficulties.length > 0 &&
        !selectedDifficulties.includes(p.difficulty)
      )
        return false;
      if (
        q &&
        !p.title.toLowerCase().includes(q) &&
        !p.tagline.toLowerCase().includes(q) &&
        !p.skillTags.some((t) => t.toLowerCase().includes(q)) &&
        !p.category.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [projects, selectedCategories, selectedSkills, selectedDifficulties, searchQuery]);

  const gridRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const clearAll = useCallback(() => {
    setSelectedCategories([]);
    setSelectedSkills([]);
    setSelectedDifficulties([]);
    setSearchQuery("");
  }, []);

  return (
    <section id="projects" className="blueprint-frame px-9 py-18 scroll-mt-6">
      <div className="mx-auto max-w-[1280px]">
        <h2 className="type-headline">Discover Projects</h2>
        <p className="type-body mt-2 max-w-lg text-text-secondary">
          Real-world projects across every discipline. Pick one that excites you
          and prove what you can do.
        </p>

        <FilterBar
          categories={categories}
          skills={skills}
          selectedCategories={selectedCategories}
          selectedSkills={selectedSkills}
          selectedDifficulties={selectedDifficulties}
          searchQuery={searchQuery}
          onToggleCategory={(v) => setSelectedCategories((s) => toggle(s, v))}
          onToggleSkill={(v) => setSelectedSkills((s) => toggle(s, v))}
          onToggleDifficulty={(v) =>
            setSelectedDifficulties((s) => toggle(s, v))
          }
          onSearchChange={setSearchQuery}
          onClearAll={clearAll}
          activeCount={activeCount}
        />

        <div ref={gridRef} className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((project, i) => (
            <div
              key={project.id}
              className={visible ? "card-enter" : "opacity-0"}
              style={visible ? { animationDelay: `${i * 60}ms` } : undefined}
            >
              <ProjectCard project={project} onClick={setSelectedProject} />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-12 text-center type-body text-text-tertiary">
            No projects match your filters.
          </p>
        )}
      </div>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
