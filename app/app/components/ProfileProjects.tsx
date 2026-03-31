"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Project } from "@/app/lib/types";
import { projects } from "@/app/lib/mock-data";
import { Clock, FileText, ArrowUpDown } from "lucide-react";
import FitTitle from "./FitTitle";
import ProgressGrid from "./ProgressGrid";
import ProjectModal from "./ProjectModal";

const staticTabs = ["Ongoing", "Applied", "Posted"] as const;
type Tab = (typeof staticTabs)[number];

type ApplicationStatus = "accepted" | "rejected" | "in review";

// Mock data: assign projects to tabs, with application statuses for "Applied"
const appliedProjects = [projects[0], projects[1], projects[2], projects[5]];

const applicationStatus: Record<string, ApplicationStatus> = {
  [projects[0].id]: "in review",
  [projects[1].id]: "accepted",
  [projects[2].id]: "rejected",
  [projects[5].id]: "in review",
};

// Ongoing = existing ongoing + accepted from applied
const acceptedApplied = appliedProjects.filter(
  (p) => applicationStatus[p.id] === "accepted"
);
const ongoingBase = [projects[3], projects[4]];
const ongoingIds = new Set(ongoingBase.map((p) => p.id));
const ongoingProjects = [
  ...ongoingBase,
  ...acceptedApplied.filter((p) => !ongoingIds.has(p.id)),
];

const projectsByTab: Record<"Ongoing" | "Applied", Project[]> = {
  Ongoing: ongoingProjects,
  Applied: appliedProjects,
};

const statusStyles: Record<ApplicationStatus, string> = {
  accepted: "bg-success/15 text-success",
  rejected: "bg-error/15 text-error",
  "in review": "bg-secondary/15 text-secondary",
};

const statusLabels: Record<ApplicationStatus, string> = {
  accepted: "Accepted",
  rejected: "Rejected",
  "in review": "In Review",
};

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

  useEffect(() => {
    fetch("/api/reports/progress")
      .then((res) => res.json())
      .then((data) => {
        if (typeof data === "object" && !data.error) setProgress(data);
      })
      .catch(() => {});

    fetch("/api/case-studies")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCaseStudies(data);
      })
      .catch(() => {});
  }, []);

  function handleProjectClick(project: Project) {
    const isOngoing = activeTab === "Ongoing";
    const isAccepted =
      activeTab === "Applied" && applicationStatus[project.id] === "accepted";

    if (isOngoing || isAccepted) {
      router.push(`/project/${project.id}`);
    } else {
      setSelectedProject(project);
    }
  }

  function getTabCount(tab: Tab): number {
    if (tab === "Posted") return caseStudies.length;
    return projectsByTab[tab].length;
  }

  const statusOrder: Record<ApplicationStatus, number> = {
    accepted: 0,
    "in review": 1,
    rejected: 2,
  };

  const difficultyOrder: Record<string, number> = {
    Beginner: 0,
    Intermediate: 1,
    Advanced: 2,
  };

  function getSortedApplied(): Project[] {
    const items = [...projectsByTab.Applied];
    switch (appliedSort) {
      case "status":
        return items.sort((a, b) => {
          const sa = applicationStatus[a.id] ? statusOrder[applicationStatus[a.id]] : 99;
          const sb = applicationStatus[b.id] ? statusOrder[applicationStatus[b.id]] : 99;
          return sa - sb;
        });
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

      {/* Ongoing & Applied Cards */}
      {(activeTab === "Ongoing" || activeTab === "Applied") && (
        <>
          {/* Sort dropdown for Applied */}
          {activeTab === "Applied" && projectsByTab.Applied.length > 1 && (
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

          {(activeTab === "Applied" ? getSortedApplied() : projectsByTab[activeTab]).length > 0 ? (
            <div className={`${activeTab === "Applied" && projectsByTab.Applied.length > 1 ? "mt-3" : "mt-4"} grid gap-4 sm:grid-cols-2 lg:grid-cols-3`}>
              {(activeTab === "Applied" ? getSortedApplied() : projectsByTab[activeTab]).map((project) => {
                const status =
                  activeTab === "Applied"
                    ? applicationStatus[project.id]
                    : undefined;

                return (
                  <div
                    key={project.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleProjectClick(project)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleProjectClick(project);
                      }
                    }}
                    className="relative flex h-full cursor-pointer flex-col rounded-xl border border-transparent bg-surface-1 p-4.5 transition-all duration-200 hover:border-border hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-[0.99]"
                  >
                    {/* Status Tag */}
                    {status && (
                      <span
                        className={`absolute top-3 right-3 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}
                      >
                        {statusLabels[status]}
                      </span>
                    )}

                    <FitTitle className="type-title pr-20">
                      {project.title}
                    </FitTitle>

                    {/* Grid for ongoing, image for applied */}
                    {activeTab === "Ongoing" ? (
                      (() => {
                        const totalMilestones = project.details.learningOutcomes.length;
                        const completed = progress[project.id] || 0;
                        const percent = totalMilestones > 0 ? Math.round((completed / totalMilestones) * 100) : 0;
                        return (
                          <div className="mt-3">
                            <ProgressGrid percent={percent} />
                          </div>
                        );
                      })()
                    ) : (
                      <div className="mt-3 aspect-4/3 w-full overflow-hidden rounded-lg bg-black">
                        {project.imageUrl && (
                          <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                    )}

                    <p className="type-body mt-3 line-clamp-2 text-text-secondary">
                      {project.tagline}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white">
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
              })}
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-border bg-surface-1 p-10 text-center">
              <p className="type-body text-text-tertiary">
                No {activeTab.toLowerCase()} projects yet.
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      router.push(`/case-study/${cs.id}`);
                    }
                  }}
                  className="flex h-full cursor-pointer flex-col rounded-xl border border-transparent bg-surface-1 p-4.5 transition-all duration-200 hover:border-border hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white">
                      <span className="text-sm font-semibold text-black">
                        {cs.company_name.charAt(0)}
                      </span>
                    </div>
                    <span className="type-caption font-medium text-text-secondary">
                      {cs.company_name}
                    </span>
                  </div>

                  <FitTitle className="type-title">
                    {cs.project_title}
                  </FitTitle>

                  <p className="type-body mt-2 text-text-tertiary">
                    {cs.sections.length} section
                    {cs.sections.length !== 1 ? "s" : ""}
                  </p>

                  <div className="mt-3 space-y-1.5">
                    {cs.sections.slice(0, 3).map((s, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 type-caption text-text-secondary"
                      >
                        <FileText size={12} className="shrink-0 text-accent" />
                        <span className="truncate">{s.title}</span>
                      </div>
                    ))}
                    {cs.sections.length > 3 && (
                      <p className="type-caption text-text-tertiary">
                        +{cs.sections.length - 3} more
                      </p>
                    )}
                  </div>

                  <div className="mt-auto pt-4">
                    <span className="type-caption text-text-tertiary">
                      Posted{" "}
                      {new Date(cs.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-border bg-surface-1 p-10 text-center">
              <FileText
                size={40}
                className="mx-auto text-text-disabled mb-3"
              />
              <p className="type-body text-text-tertiary">
                No case studies posted yet. Complete a project and publish your
                case study from the dashboard.
              </p>
            </div>
          )}
        </>
      )}

      {/* Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        showApply={false}
      />
    </section>
  );
}
