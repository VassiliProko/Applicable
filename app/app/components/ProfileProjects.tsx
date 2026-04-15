"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Project } from "@/app/lib/types";
import { Clock, FileText, ArrowUpDown, Trash2 } from "lucide-react";

const categoryThumbnails: Record<string, string> = {
  "Design": "/Thumbnails/design.png",
  "Mobile": "/Thumbnails/mobile.png",
  "Marketing": "/Thumbnails/marketing.png",
  "Engineering": "/Thumbnails/dev.png",
  "DevOps": "/Thumbnails/dev.png",
  "Data & Analytics": "/Thumbnails/dev.png",
};

function getThumbnail(project: Project): string {
  if (project.imageUrl) return project.imageUrl;
  return categoryThumbnails[project.category] || "/Thumbnails/dev.png";
}
import FitTitle from "./FitTitle";
import ProgressGrid from "./ProgressGrid";
import ProjectModal from "./ProjectModal";

const staticTabs = ["Ongoing", "Applied", "Created", "Posted"] as const;
type Tab = (typeof staticTabs)[number];

type ApplicationStatus = "pending" | "accepted" | "rejected";

const statusStyles: Record<ApplicationStatus, string> = {
  accepted: "bg-success/15 text-success",
  rejected: "bg-error/15 text-error",
  pending: "bg-secondary/15 text-secondary",
};

const statusLabels: Record<ApplicationStatus, string> = {
  accepted: "Accepted",
  rejected: "Rejected",
  pending: "In Review",
};

interface ApplicationData {
  id: string;
  project_id: string;
  status: ApplicationStatus;
  created_at: string;
}

interface CaseStudy {
  id: string;
  project_id: string;
  project_title: string;
  company_name: string;
  sections: { title: string; summary: string }[];
  created_at: string;
}

export default function ProfileProjects() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("Ongoing");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [appliedSort, setAppliedSort] = useState<"status" | "name" | "company" | "difficulty">("status");
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Real data
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [myApplications, setMyApplications] = useState<ApplicationData[]>([]);
  const [createdProjects, setCreatedProjects] = useState<Project[]>([]);
  const [approvedSubmissions, setApprovedSubmissions] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Fetch all projects
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAllProjects(data);
      })
      .catch(() => {});

    // Fetch my applications
    fetch("/api/applications?mine=true")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setMyApplications(data);
      })
      .catch(() => {});

    // Fetch progress
    fetch("/api/reports/progress")
      .then((res) => res.json())
      .then((data) => {
        if (typeof data === "object" && !data.error) setProgress(data);
      })
      .catch(() => {});

    // Fetch my submissions to check which projects are fully approved
    fetch("/api/submissions?mine=true")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const approved = new Set<string>();
          data.forEach((s: { project_id: string; status: string }) => {
            if (s.status === "approved") approved.add(s.project_id);
          });
          setApprovedSubmissions(approved);
        }
      })
      .catch(() => {});

    // Fetch case studies
    fetch("/api/case-studies")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCaseStudies(data);
      })
      .catch(() => {});

    // Fetch created projects
    fetch("/api/profile")
      .then((res) => res.json())
      .then((user) => {
        if (user?.id) {
          fetch("/api/projects")
            .then((res) => res.json())
            .then((projects) => {
              if (Array.isArray(projects)) {
                setCreatedProjects(projects.filter((p: Project & { creatorId?: string }) => p.creatorId === user.id));
              }
            });
        }
      })
      .catch(() => {});
  }, []);

  // Derive applied projects from applications + all projects
  const appliedProjects = myApplications
    .map((app) => {
      const project = allProjects.find((p) => p.id === app.project_id);
      return project ? { ...project, applicationStatus: app.status } : null;
    })
    .filter(Boolean) as (Project & { applicationStatus: ApplicationStatus })[];

  // Ongoing = accepted applications
  const ongoingProjects = appliedProjects.filter((p) => p.applicationStatus === "accepted");

  const statusOrder: Record<ApplicationStatus, number> = {
    accepted: 0,
    pending: 1,
    rejected: 2,
  };

  const difficultyOrder: Record<string, number> = {
    Beginner: 0,
    Intermediate: 1,
    Advanced: 2,
  };

  function getSortedApplied() {
    const items = [...appliedProjects];
    switch (appliedSort) {
      case "status":
        return items.sort((a, b) => statusOrder[a.applicationStatus] - statusOrder[b.applicationStatus]);
      case "name":
        return items.sort((a, b) => a.title.localeCompare(b.title));
      case "company":
        return items.sort((a, b) => a.companyName.localeCompare(b.companyName));
      case "difficulty":
        return items.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
      default:
        return items;
    }
  }

  function handleProjectClick(project: Project, tab: Tab) {
    if (tab === "Ongoing") {
      router.push(`/project/${project.id}`);
    } else if (tab === "Applied") {
      const app = appliedProjects.find((p) => p.id === project.id);
      if (app?.applicationStatus === "accepted") {
        router.push(`/project/${project.id}`);
      } else {
        setSelectedProject(project);
      }
    } else if (tab === "Created") {
      router.push(`/manage-project/${project.id}`);
    } else {
      setSelectedProject(project);
    }
  }

  async function handleDeleteProject(project: Project) {
    setDeleting(true);
    const res = await fetch(`/api/projects?id=${project.id}`, { method: "DELETE" });
    if (res.ok) {
      setCreatedProjects((prev) => prev.filter((p) => p.id !== project.id));
      setAllProjects((prev) => prev.filter((p) => p.id !== project.id));
    }
    setDeleting(false);
    setDeleteTarget(null);
  }

  function getTabCount(tab: Tab): number {
    switch (tab) {
      case "Ongoing": return ongoingProjects.length;
      case "Applied": return appliedProjects.length;
      case "Created": return createdProjects.length;
      case "Posted": return caseStudies.length;
    }
  }

  return (
    <section className="mt-8 mb-16">
      <h2 className="type-headline text-text-primary mb-4">My Projects</h2>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-surface-1 p-1 w-fit">
        {staticTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-all duration-150 ${
              activeTab === tab
                ? "bg-surface-3 text-text-primary shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {tab}
            <span
              className={`ml-1.5 text-xs ${
                activeTab === tab ? "text-text-secondary" : "text-text-tertiary"
              }`}
            >
              {getTabCount(tab)}
            </span>
          </button>
        ))}
      </div>

      {/* Ongoing Tab */}
      {activeTab === "Ongoing" && (
        <>
          {ongoingProjects.length > 0 ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ongoingProjects.map((project) => {
                const totalMilestones = project.milestones?.length || project.details.learningOutcomes.length;
                const completed = progress[project.id] || 0;
                const percent = totalMilestones > 0 ? Math.round((completed / totalMilestones) * 100) : 0;

                return (
                  <div
                    key={project.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleProjectClick(project, "Ongoing")}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleProjectClick(project, "Ongoing"); } }}
                    className="flex h-full cursor-pointer flex-col rounded-xl border border-transparent bg-surface-1 p-4.5 transition-all duration-200 hover:border-border hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-[0.99]"
                  >
                    <FitTitle className="type-title">{project.title}</FitTitle>
                    <div className="mt-3">
                      <ProgressGrid percent={percent} completed={approvedSubmissions.has(project.id)} />
                    </div>
                    <p className="type-body mt-3 line-clamp-2 text-text-secondary">{project.tagline}</p>
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white">
                          {project.logoUrl ? (
                            <img src={project.logoUrl} alt={`${project.companyName} logo`} className="h-6 w-6 object-contain" />
                          ) : (
                            <span className="text-sm font-semibold text-black">{project.companyName.charAt(0)}</span>
                          )}
                        </div>
                        <span className="type-caption font-medium text-text-secondary">{project.companyName}</span>
                      </div>
                      <span className="type-caption inline-flex items-center gap-1 text-text-tertiary">
                        <Clock size={12} />
                        {project.timeCommitment}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-border bg-surface-1 p-10 text-center">
              <p className="type-body text-text-tertiary">No ongoing projects. Apply to a project and get accepted to start working.</p>
            </div>
          )}
        </>
      )}

      {/* Applied Tab */}
      {activeTab === "Applied" && (
        <>
          {appliedProjects.length > 1 && (
            <div className="mt-4 flex items-center gap-2">
              <ArrowUpDown size={14} className="text-text-tertiary" />
              <span className="type-caption text-text-tertiary">Sort by</span>
              <select
                value={appliedSort}
                onChange={(e) => setAppliedSort(e.target.value as typeof appliedSort)}
                className="rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm text-text-primary focus:border-accent focus:outline-none"
              >
                <option value="status">Status</option>
                <option value="name">Name</option>
                <option value="company">Company</option>
                <option value="difficulty">Difficulty</option>
              </select>
            </div>
          )}

          {appliedProjects.length > 0 ? (
            <div className={`${appliedProjects.length > 1 ? "mt-3" : "mt-4"} grid gap-4 sm:grid-cols-2 lg:grid-cols-3`}>
              {getSortedApplied().map((project) => (
                <div
                  key={project.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleProjectClick(project, "Applied")}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleProjectClick(project, "Applied"); } }}
                  className="relative flex h-full cursor-pointer flex-col rounded-xl border border-transparent bg-surface-1 p-4.5 transition-all duration-200 hover:border-border hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-[0.99]"
                >
                  <span className={`absolute top-3 right-3 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[project.applicationStatus]}`}>
                    {statusLabels[project.applicationStatus]}
                  </span>
                  <FitTitle className="type-title pr-20">{project.title}</FitTitle>
                  <div className="mt-3 aspect-4/3 w-full overflow-hidden rounded-lg bg-black">
                    <img src={getThumbnail(project)} alt={project.title} className="h-full w-full object-cover" />
                  </div>
                  <p className="type-body mt-3 line-clamp-2 text-text-secondary">{project.tagline}</p>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white">
                        {project.logoUrl ? (
                          <img src={project.logoUrl} alt={`${project.companyName} logo`} className="h-6 w-6 object-contain" />
                        ) : (
                          <span className="text-sm font-semibold text-black">{project.companyName.charAt(0)}</span>
                        )}
                      </div>
                      <span className="type-caption font-medium text-text-secondary">{project.companyName}</span>
                    </div>
                    <span className="type-caption inline-flex items-center gap-1 text-text-tertiary">
                      <Clock size={12} />
                      {project.timeCommitment}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-border bg-surface-1 p-10 text-center">
              <p className="type-body text-text-tertiary">No applications yet. Browse projects and apply to one that interests you.</p>
            </div>
          )}
        </>
      )}

      {/* Created Tab */}
      {activeTab === "Created" && (
        <>
          {createdProjects.length > 0 ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {createdProjects.map((project) => (
                <div
                  key={project.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleProjectClick(project, "Created")}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleProjectClick(project, "Created"); } }}
                  className="flex h-full cursor-pointer flex-col rounded-xl border border-transparent bg-surface-1 p-4.5 transition-all duration-200 hover:border-border hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-[0.99]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="type-caption rounded-full bg-accent/10 px-2.5 py-0.5 font-medium text-accent">Creator</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteTarget(project); }}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-text-tertiary hover:bg-error/10 hover:text-error transition-colors"
                      aria-label="Delete project"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <FitTitle className="type-title">{project.title}</FitTitle>
                  <p className="type-body mt-2 line-clamp-2 text-text-secondary">{project.tagline}</p>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white">
                        {project.logoUrl ? (
                          <img src={project.logoUrl} alt={`${project.companyName} logo`} className="h-6 w-6 object-contain" />
                        ) : (
                          <span className="text-sm font-semibold text-black">{project.companyName.charAt(0)}</span>
                        )}
                      </div>
                      <span className="type-caption font-medium text-text-secondary">{project.companyName}</span>
                    </div>
                    <span className="type-caption text-text-tertiary">{project.category}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-border bg-surface-1 p-10 text-center">
              <p className="type-body text-text-tertiary">
                No projects created yet.{" "}
                <a href="/create-project" className="text-accent hover:underline">Post a project</a> for others to join.
              </p>
            </div>
          )}
        </>
      )}

      {/* Posted Case Studies */}
      {activeTab === "Posted" && (
        <>
          {caseStudies.length > 0 ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {caseStudies.map((cs) => (
                <div
                  key={cs.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => router.push(`/case-study/${cs.id}`)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); router.push(`/case-study/${cs.id}`); } }}
                  className="flex h-full cursor-pointer flex-col rounded-xl border border-transparent bg-surface-1 p-4.5 transition-all duration-200 hover:border-border hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white">
                      <span className="text-sm font-semibold text-black">{cs.company_name.charAt(0)}</span>
                    </div>
                    <span className="type-caption font-medium text-text-secondary">{cs.company_name}</span>
                  </div>
                  <FitTitle className="type-title">{cs.project_title}</FitTitle>
                  <p className="type-body mt-2 text-text-tertiary">
                    {cs.sections.length} section{cs.sections.length !== 1 ? "s" : ""}
                  </p>
                  <div className="mt-3 space-y-1.5">
                    {cs.sections.slice(0, 3).map((s, i) => (
                      <div key={i} className="flex items-center gap-2 type-caption text-text-secondary">
                        <FileText size={12} className="shrink-0 text-accent" />
                        <span className="truncate">{s.title}</span>
                      </div>
                    ))}
                    {cs.sections.length > 3 && (
                      <p className="type-caption text-text-tertiary">+{cs.sections.length - 3} more</p>
                    )}
                  </div>
                  <div className="mt-auto pt-4">
                    <span className="type-caption text-text-tertiary">
                      Posted {new Date(cs.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-border bg-surface-1 p-10 text-center">
              <FileText size={40} className="mx-auto text-text-disabled mb-3" />
              <p className="type-body text-text-tertiary">
                No case studies posted yet. Complete a project and publish your case study from the dashboard.
              </p>
            </div>
          )}
        </>
      )}

      {/* Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        showApply={activeTab !== "Applied"}
      />

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => !deleting && setDeleteTarget(null)}
        >
          <div
            className="relative w-[90vw] max-w-md rounded-2xl bg-surface-1 p-8"
            style={{ boxShadow: "var(--shadow-high)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-error/10 mb-4">
                <Trash2 size={24} className="text-error" />
              </div>
              <h3 className="type-title text-text-primary">Delete Project</h3>
              <p className="type-body text-text-secondary mt-2">
                Are you sure you want to delete <strong>{deleteTarget.title}</strong>? This will permanently remove the project and all associated data.
              </p>
              <p className="type-caption text-error mt-2">This action cannot be undone.</p>
              <div className="flex gap-3 mt-6 w-full">
                <button
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                  className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-2 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteProject(deleteTarget)}
                  disabled={deleting}
                  className="flex-1 rounded-lg bg-error px-4 py-2.5 text-sm font-medium text-white hover:bg-error/80 transition-colors disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Delete Project"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
