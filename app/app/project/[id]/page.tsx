"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import ProjectDashboard from "@/app/components/ProjectDashboard";
import { Project } from "@/app/lib/types";

export default function ProjectPage() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((projects) => {
        if (Array.isArray(projects)) {
          const found = projects.find((p: Project) => p.id === params.id);
          setProject(found || null);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <p className="type-body text-text-tertiary">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <p className="type-body text-text-tertiary">Project not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <ProjectDashboard project={project} />
    </div>
  );
}
