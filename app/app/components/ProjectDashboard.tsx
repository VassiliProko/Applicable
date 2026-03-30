"use client";

import { useState, useEffect } from "react";
import { Project } from "@/app/lib/types";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Signal,
  Check,
  Plus,
  Trash2,
  LinkIcon,
  CircleDot,
  CheckCircle2,
  Circle,
  X,
  Mail,
  MapPin,
  User,
  Upload,
  FileText,
  Image as ImageIcon,
  Video,
  Calendar,
  AlertTriangle,
  Pencil,
} from "lucide-react";

interface MilestoneReport {
  summary: string;
  details: string;
  files: { name: string; type: string; url: string }[];
  link?: string;
}

interface Milestone {
  id: string;
  text: string;
  done: boolean;
  deadline: string;
  report?: MilestoneReport;
}

interface Task {
  id: string;
  text: string;
  done: boolean;
  deadline: string;
}

interface Deliverable {
  id: string;
  title: string;
  url: string;
  status: "draft" | "submitted" | "reviewed";
}

interface ActivityItem {
  id: string;
  text: string;
  date: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  location: string;
  bio: string;
  skills: string[];
  avatarSeed: string;
}

const tabs = ["Brief", "Milestones & Tasks", "Submission", "Team", "My Case Study"] as const;
type DashboardTab = (typeof tabs)[number];

const difficultyColor: Record<string, string> = {
  Beginner: "bg-success/15 text-success",
  Intermediate: "bg-secondary/15 text-secondary",
  Advanced: "bg-primary/15 text-primary",
};

export default function ProjectDashboard({ project }: { project: Project }) {
  const [activeTab, setActiveTab] = useState<DashboardTab>("Brief");

  // Milestones from learning outcomes with staggered deadlines
  const [milestones, setMilestones] = useState<Milestone[]>(
    project.details.learningOutcomes.map((outcome, i) => {
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 7 * (i + 1));
      return {
        id: `m-${i}`,
        text: outcome,
        done: false,
        deadline: deadline.toISOString().split("T")[0],
      };
    })
  );

  // Load saved reports from API on mount
  useEffect(() => {
    fetch(`/api/reports?projectId=${project.id}`)
      .then((res) => res.json())
      .then((reports: { milestone_id: string; summary: string; details: string; files: { name: string; type: string; url: string }[]; link?: string }[]) => {
        if (!Array.isArray(reports)) return;
        setMilestones((prev) =>
          prev.map((m) => {
            const saved = reports.find((r) => r.milestone_id === m.id);
            if (saved) {
              return {
                ...m,
                done: true,
                report: {
                  summary: saved.summary,
                  details: saved.details,
                  files: saved.files,
                  link: saved.link || undefined,
                },
              };
            }
            return m;
          })
        );
      })
      .catch(() => {});

    // Check if case study is already posted
    fetch(`/api/case-studies`)
      .then((res) => res.json())
      .then((studies: { project_id: string }[]) => {
        if (Array.isArray(studies) && studies.some((s) => s.project_id === project.id)) {
          setCaseStudyPosted(true);
        }
      })
      .catch(() => {});
  }, [project.id]);

  // Report modal (editing)
  const [reportMilestone, setReportMilestone] = useState<Milestone | null>(null);
  const [reportSummary, setReportSummary] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [reportLink, setReportLink] = useState("");
  const [reportFiles, setReportFiles] = useState<
    { name: string; type: string; url: string }[]
  >([]);

  // Report modal (viewing)
  const [viewingReport, setViewingReport] = useState<{
    milestone: Milestone;
    report: MilestoneReport;
  } | null>(null);

  // Tasks
  const [tasks, setTasks] = useState<Task[]>([
    { id: "t-1", text: "Set up project repository", done: true, deadline: "2026-03-20" },
    { id: "t-2", text: "Review project requirements", done: true, deadline: "2026-03-22" },
    { id: "t-3", text: "Build initial prototype", done: false, deadline: "2026-04-05" },
  ]);
  const [newTask, setNewTask] = useState("");
  const [newTaskDeadline, setNewTaskDeadline] = useState("");

  // Deliverables
  const [deliverables, setDeliverables] = useState<Deliverable[]>([
    {
      id: "d-1",
      title: "GitHub Repository",
      url: "https://github.com/johndoe/project",
      status: "submitted",
    },
  ]);
  const [newDelivTitle, setNewDelivTitle] = useState("");
  const [newDelivUrl, setNewDelivUrl] = useState("");

  // Activity
  const [activity] = useState<ActivityItem[]>([
    { id: "a-1", text: "Application accepted", date: "Mar 15, 2026" },
    { id: "a-2", text: "Project started", date: "Mar 16, 2026" },
    { id: "a-3", text: "Repository link submitted", date: "Mar 18, 2026" },
    {
      id: "a-4",
      text:
        'Milestone completed: "' +
        project.details.learningOutcomes[0] +
        '"',
      date: "Mar 22, 2026",
    },
  ]);

  // Team
  const [teamMembers] = useState<TeamMember[]>([
    {
      id: "tm-1",
      name: "John Doe",
      email: "johndoe@email.com",
      role: "Full-Stack Developer",
      location: "San Francisco, CA",
      bio: "Passionate developer who loves building products that make a difference.",
      skills: ["React", "TypeScript", "Node.js"],
      avatarSeed: "JD",
    },
    {
      id: "tm-2",
      name: "Sarah Chen",
      email: "sarah.chen@email.com",
      role: "Frontend Engineer",
      location: "New York, NY",
      bio: "UI/UX enthusiast with a focus on accessible and performant web applications.",
      skills: ["React", "CSS", "Accessibility"],
      avatarSeed: "SC",
    },
    {
      id: "tm-3",
      name: "Marcus Rivera",
      email: "m.rivera@email.com",
      role: "Backend Developer",
      location: "Austin, TX",
      bio: "Systems thinker who enjoys designing APIs and database architectures.",
      skills: ["Node.js", "PostgreSQL", "Docker"],
      avatarSeed: "MR",
    },
    {
      id: "tm-4",
      name: "Aisha Patel",
      email: "aisha.p@email.com",
      role: "Product Designer",
      location: "London, UK",
      bio: "Design-driven problem solver focused on user research and prototyping.",
      skills: ["Figma", "UX Research", "Prototyping"],
      avatarSeed: "AP",
    },
  ]);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Case Study
  const [caseStudyEdits, setCaseStudyEdits] = useState<
    Record<string, { summary: string; details: string }>
  >({});
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [caseStudyPosted, setCaseStudyPosted] = useState(false);
  const [caseStudyDirty, setCaseStudyDirty] = useState(false);

  const completedMilestones = milestones.filter((m) => m.done).length;
  const progressPercent = Math.round(
    (completedMilestones / milestones.length) * 100
  );

  function openReport(milestone: Milestone) {
    if (milestone.done) return; // already completed, don't reopen
    setReportMilestone(milestone);
    setReportSummary("");
    setReportDetails("");
    setReportLink("");
    setReportFiles([]);
  }

  const [uploading, setUploading] = useState(false);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploaded: { name: string; type: string; url: string }[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        uploaded.push(data);
      }
    }

    setReportFiles((prev) => [...prev, ...uploaded]);
    setUploading(false);
    e.target.value = "";
  }

  function removeReportFile(index: number) {
    setReportFiles((prev) => prev.filter((_, i) => i !== index));
  }

  const [submittingReport, setSubmittingReport] = useState(false);

  async function submitReport() {
    if (!reportMilestone || !reportSummary.trim()) return;

    setSubmittingReport(true);

    const report = {
      summary: reportSummary.trim(),
      details: reportDetails.trim(),
      files: reportFiles,
      link: reportLink.trim() || undefined,
    };

    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: project.id,
        milestoneId: reportMilestone.id,
        ...report,
      }),
    });

    if (res.ok) {
      setMilestones((prev) =>
        prev.map((m) =>
          m.id === reportMilestone.id
            ? { ...m, done: true, report }
            : m
        )
      );
      setReportMilestone(null);
    }

    setSubmittingReport(false);
  }

  function addTask() {
    if (!newTask.trim()) return;
    const deadline = newTaskDeadline || new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];
    setTasks((prev) => [
      ...prev,
      { id: `t-${Date.now()}`, text: newTask.trim(), done: false, deadline },
    ]);
    setNewTask("");
    setNewTaskDeadline("");
  }

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  function removeTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function addDeliverable() {
    if (!newDelivTitle.trim() || !newDelivUrl.trim()) return;
    setDeliverables((prev) => [
      ...prev,
      {
        id: `d-${Date.now()}`,
        title: newDelivTitle.trim(),
        url: newDelivUrl.trim(),
        status: "draft",
      },
    ]);
    setNewDelivTitle("");
    setNewDelivUrl("");
  }

  const deliverableStatusStyles: Record<string, string> = {
    draft: "bg-surface-3 text-text-secondary",
    submitted: "bg-secondary/15 text-secondary",
    reviewed: "bg-success/15 text-success",
  };

  function formatDeadline(dateStr: string) {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  function isOverdue(dateStr: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dateStr + "T00:00:00") < today;
  }

  function isDueSoon(dateStr: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(dateStr + "T00:00:00");
    const diff = deadline.getTime() - today.getTime();
    return diff >= 0 && diff <= 3 * 86400000; // within 3 days
  }

  // Case study: get the content for a section (edited version or original report)
  function getCaseStudySection(milestone: Milestone) {
    const edit = caseStudyEdits[milestone.id];
    if (edit) return edit;
    if (milestone.report) {
      return { summary: milestone.report.summary, details: milestone.report.details };
    }
    return { summary: "", details: "" };
  }

  function startEditingSection(milestoneId: string) {
    const milestone = milestones.find((m) => m.id === milestoneId);
    if (!milestone) return;
    const section = getCaseStudySection(milestone);
    setCaseStudyEdits((prev) => ({
      ...prev,
      [milestoneId]: { ...section },
    }));
    setEditingSection(milestoneId);
  }

  function saveSectionEdit(milestoneId: string) {
    setEditingSection(null);
    // Also save to the API
    const section = caseStudyEdits[milestoneId];
    if (section) {
      fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          milestoneId,
          summary: section.summary,
          details: section.details,
          files: milestones.find((m) => m.id === milestoneId)?.report?.files || [],
        }),
      });
      // Update milestones state with edited content
      setMilestones((prev) =>
        prev.map((m) =>
          m.id === milestoneId && m.report
            ? { ...m, report: { ...m.report, summary: section.summary, details: section.details } }
            : m
        )
      );
      // Mark case study as needing update if already posted
      if (caseStudyPosted) {
        setCaseStudyDirty(true);
      }
    }
  }

  const caseStudySections = milestones.filter((m) => m.done && m.report);
  const [publishingCaseStudy, setPublishingCaseStudy] = useState(false);

  async function publishCaseStudy() {
    if (caseStudySections.length === 0) return;
    setPublishingCaseStudy(true);

    const sections = caseStudySections.map((m) => {
      const section = getCaseStudySection(m);
      return {
        milestoneId: m.id,
        title: m.text,
        summary: section.summary,
        details: section.details,
        files: m.report?.files || [],
      };
    });

    const res = await fetch("/api/case-studies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: project.id,
        projectTitle: project.title,
        companyName: project.companyName,
        sections,
      }),
    });

    if (res.ok) {
      setCaseStudyPosted(true);
      setCaseStudyDirty(false);
    }
    setPublishingCaseStudy(false);
  }

  return (
    <main className="flex-1 pb-16">
      {/* Header */}
      <div className="border-b border-[var(--border-base)]">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <Link
            href="/profile"
            className="inline-flex items-center gap-1.5 text-sm text-text-tertiary hover:text-text-primary transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Back to Profile
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            {/* Company logo */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white">
              {project.logoUrl ? (
                <img
                  src={project.logoUrl}
                  alt={`${project.companyName} logo`}
                  className="h-8 w-8 object-contain"
                />
              ) : (
                <span className="text-xl font-bold text-black">
                  {project.companyName.charAt(0)}
                </span>
              )}
            </div>

            <div className="flex-1">
              <h1 className="type-headline text-text-primary">
                {project.title}
              </h1>
              <p className="type-body text-text-secondary mt-1">
                {project.companyName}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span
                  className={`type-caption inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium ${difficultyColor[project.difficulty]}`}
                >
                  <Signal size={14} />
                  {project.difficulty}
                </span>
                <span className="type-caption inline-flex items-center gap-1 text-text-tertiary">
                  <Clock size={14} />
                  {project.timeCommitment}
                </span>
                <div className="flex gap-1.5">
                  {project.skillTags.map((tag) => (
                    <span
                      key={tag}
                      className="type-caption rounded-full bg-accent/10 px-2.5 py-0.5 font-medium text-accent"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Progress circle */}
            <div className="flex flex-col items-center gap-1">
              <div className="relative h-16 w-16">
                <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="var(--surface-3)"
                    strokeWidth="3"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="var(--primary-500)"
                    strokeWidth="3"
                    strokeDasharray={`${progressPercent} ${100 - progressPercent}`}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-text-primary">
                  {progressPercent}%
                </span>
              </div>
              <span className="type-caption text-text-tertiary">Progress</span>
            </div>
          </div>

        </div>
      </div>

      {/* Sidebar Tabs + Content */}
      <div className="mx-auto max-w-7xl px-6 mt-8 flex gap-8">
        {/* Sidebar Tabs */}
        <nav className="hidden md:flex flex-col gap-1 rounded-lg bg-surface-1 p-1 w-48 shrink-0 self-start sticky top-24">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-md px-4 py-2.5 text-sm font-medium text-left transition-all duration-150 ${
                activeTab === tab
                  ? "bg-surface-3 text-text-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* Mobile Tabs (horizontal) */}
        <div className="md:hidden flex gap-1 rounded-lg bg-surface-1 p-1 w-fit mb-6 self-start">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-md px-3 py-2 text-xs font-medium transition-all duration-150 ${
                activeTab === tab
                  ? "bg-surface-3 text-text-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 min-w-0">
        {/* Brief Tab */}
        {activeTab === "Brief" && (
          <div className="max-w-3xl space-y-8">
            <div>
              <h2 className="type-title text-text-primary">Overview</h2>
              <p className="type-body mt-3 text-text-secondary">
                {project.details.overview}
              </p>
            </div>

            <div>
              <h2 className="type-title text-text-primary">
                What You&apos;ll Learn
              </h2>
              <ul className="mt-3 space-y-3">
                {project.details.learningOutcomes.map((outcome) => (
                  <li
                    key={outcome}
                    className="type-body flex items-start gap-2 text-text-secondary"
                  >
                    <Check
                      size={16}
                      className="mt-2 shrink-0 text-success"
                    />
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="type-title text-text-primary">Prerequisites</h2>
              <ul className="mt-3 space-y-3">
                {project.details.prerequisites.map((prereq) => (
                  <li
                    key={prereq}
                    className="type-body flex items-start gap-2 text-text-secondary"
                  >
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-text-tertiary" />
                    {prereq}
                  </li>
                ))}
              </ul>
            </div>

            {project.tagline && (
              <div className="rounded-xl border border-border bg-surface-1 p-6">
                <p className="type-body text-text-secondary italic">
                  &ldquo;{project.tagline}&rdquo;
                </p>
              </div>
            )}
          </div>
        )}

        {/* Milestones & Tasks Tab */}
        {activeTab === "Milestones & Tasks" && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Milestones */}
              <section className="rounded-xl border border-border bg-surface-1 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="type-title text-text-primary">Milestones</h2>
                  <span className="type-caption text-text-tertiary">
                    {completedMilestones}/{milestones.length} completed
                  </span>
                </div>

                <div className="h-2 w-full rounded-full bg-surface-3 mb-5">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <ul className="space-y-3">
                  {milestones.map((milestone) => {
                    const overdue = !milestone.done && isOverdue(milestone.deadline);
                    const dueSoon = !milestone.done && !overdue && isDueSoon(milestone.deadline);

                    return (
                    <li
                      key={milestone.id}
                      className="flex items-start gap-3 group"
                    >
                      {milestone.done ? (
                        <CheckCircle2
                          size={20}
                          className="mt-0.5 shrink-0 text-success"
                        />
                      ) : overdue ? (
                        <AlertTriangle
                          size={20}
                          className="mt-0.5 shrink-0 text-error"
                        />
                      ) : (
                        <Circle
                          size={20}
                          className="mt-0.5 shrink-0 text-text-disabled"
                        />
                      )}
                      <div className="flex-1">
                        <span
                          className={`type-body ${
                            milestone.done
                              ? "text-text-tertiary line-through"
                              : "text-text-primary"
                          }`}
                        >
                          {milestone.text}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          {milestone.done && milestone.report ? (
                            <button
                              onClick={() =>
                                setViewingReport({
                                  milestone,
                                  report: milestone.report!,
                                })
                              }
                              className="type-caption text-accent hover:underline text-left"
                            >
                              View Report
                            </button>
                          ) : (
                            <span
                              className={`type-caption inline-flex items-center gap-1 ${
                                overdue
                                  ? "text-error"
                                  : dueSoon
                                    ? "text-warning"
                                    : "text-text-tertiary"
                              }`}
                            >
                              <Calendar size={11} />
                              {overdue
                                ? `Overdue — was due ${formatDeadline(milestone.deadline)}`
                                : `Due ${formatDeadline(milestone.deadline)}`}
                            </span>
                          )}
                        </div>
                      </div>
                      {!milestone.done && (
                        <button
                          onClick={() => openReport(milestone)}
                          className="shrink-0 flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-hover transition-colors"
                        >
                          <FileText size={12} />
                          Submit Report
                        </button>
                      )}
                    </li>
                    );
                  })}
                </ul>
              </section>

              {/* Tasks */}
              <section className="rounded-xl border border-border bg-surface-1 p-6">
                <h2 className="type-title text-text-primary mb-4">Tasks</h2>

                <ul className="space-y-2">
                  {tasks.map((task) => {
                    const taskOverdue = !task.done && isOverdue(task.deadline);
                    const taskDueSoon = !task.done && !taskOverdue && isDueSoon(task.deadline);

                    return (
                    <li
                      key={task.id}
                      className="flex items-center gap-3 group"
                    >
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="shrink-0"
                      >
                        {task.done ? (
                          <CheckCircle2 size={18} className="text-success" />
                        ) : taskOverdue ? (
                          <AlertTriangle size={18} className="text-error" />
                        ) : (
                          <Circle
                            size={18}
                            className="text-text-disabled group-hover:text-text-secondary transition-colors"
                          />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <span
                          className={`type-body ${
                            task.done
                              ? "text-text-tertiary line-through"
                              : "text-text-primary"
                          }`}
                        >
                          {task.text}
                        </span>
                      </div>
                      <span
                        className={`shrink-0 type-caption inline-flex items-center gap-1 ${
                          task.done
                            ? "text-text-disabled"
                            : taskOverdue
                              ? "text-error"
                              : taskDueSoon
                                ? "text-warning"
                                : "text-text-tertiary"
                        }`}
                      >
                        <Calendar size={11} />
                        {formatDeadline(task.deadline)}
                      </span>
                      <button
                        onClick={() => removeTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 text-text-disabled hover:text-error transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </li>
                    );
                  })}
                </ul>

                <div className="mt-4 flex gap-2">
                  <input
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTask()}
                    placeholder="Add a task..."
                    className="flex-1 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-primary placeholder:text-text-disabled focus:border-accent focus:outline-none"
                  />
                  <input
                    type="date"
                    value={newTaskDeadline}
                    onChange={(e) => setNewTaskDeadline(e.target.value)}
                    className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none"
                  />
                  <button
                    onClick={addTask}
                    disabled={!newTask.trim()}
                    className="flex items-center gap-1 rounded-lg bg-surface-3 px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors disabled:opacity-40"
                  >
                    <Plus size={14} />
                    Add
                  </button>
                </div>
              </section>
            </div>

            {/* Activity Sidebar */}
            <div>
              <section className="rounded-xl border border-border bg-surface-1 p-6">
                <h2 className="type-title text-text-primary mb-4">Activity</h2>

                <ul className="space-y-4">
                  {activity.map((item, i) => (
                    <li key={item.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <CircleDot
                          size={16}
                          className={
                            i === activity.length - 1
                              ? "text-primary shrink-0"
                              : "text-text-disabled shrink-0"
                          }
                        />
                        {i < activity.length - 1 && (
                          <div className="w-px flex-1 bg-border mt-1" />
                        )}
                      </div>
                      <div className="pb-4">
                        <p className="text-sm text-text-primary">{item.text}</p>
                        <p className="type-caption text-text-tertiary">
                          {item.date}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        )}

        {/* Submission Tab */}
        {activeTab === "Submission" && (
          <div className="max-w-3xl space-y-6">
            {/* Deliverables */}
            <section className="rounded-xl border border-border bg-surface-1 p-6">
              <h2 className="type-title text-text-primary mb-2">
                Deliverables
              </h2>
              <p className="type-body text-text-tertiary mb-5">
                Add links to your work — repositories, design files, documents,
                or anything relevant to this project.
              </p>

              {deliverables.length > 0 && (
                <ul className="space-y-3 mb-6">
                  {deliverables.map((d) => (
                    <li
                      key={d.id}
                      className="flex items-center gap-3 rounded-lg border border-border bg-surface-2 px-4 py-3"
                    >
                      <LinkIcon
                        size={16}
                        className="shrink-0 text-accent"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {d.title}
                        </p>
                        <a
                          href={d.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-accent hover:underline truncate block"
                        >
                          {d.url}
                        </a>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${deliverableStatusStyles[d.status]}`}
                      >
                        {d.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  value={newDelivTitle}
                  onChange={(e) => setNewDelivTitle(e.target.value)}
                  placeholder="Title (e.g. GitHub Repo)"
                  className="flex-1 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-primary placeholder:text-text-disabled focus:border-accent focus:outline-none"
                />
                <input
                  value={newDelivUrl}
                  onChange={(e) => setNewDelivUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addDeliverable()}
                  placeholder="URL"
                  className="flex-1 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-primary placeholder:text-text-disabled focus:border-accent focus:outline-none"
                />
                <button
                  onClick={addDeliverable}
                  disabled={!newDelivTitle.trim() || !newDelivUrl.trim()}
                  className="flex items-center justify-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors disabled:opacity-40"
                >
                  <Plus size={14} />
                  Add
                </button>
              </div>
            </section>

            {/* Final Submission */}
            <section className="rounded-xl border border-border bg-surface-1 p-6">
              <h2 className="type-title text-text-primary mb-2">
                Final Submission
              </h2>
              <p className="type-body text-text-tertiary mb-5">
                Once you&apos;ve completed all milestones and added your
                deliverables, submit your project for review.
              </p>

              <div className="rounded-lg border border-border bg-surface-2 p-4 mb-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">
                    Milestones completed
                  </span>
                  <span className="text-sm font-medium text-text-primary">
                    {completedMilestones}/{milestones.length}
                  </span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-surface-3">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <button
                disabled={
                  completedMilestones < milestones.length ||
                  deliverables.length === 0
                }
                className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-white transition-colors hover:bg-primary-hover active:bg-primary-active disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Submit Project for Review
              </button>
              {(completedMilestones < milestones.length ||
                deliverables.length === 0) && (
                <p className="type-caption mt-2 text-text-tertiary text-center">
                  Complete all milestones and add at least one deliverable to
                  submit.
                </p>
              )}
            </section>
          </div>
        )}

        {/* Team Tab */}
        {activeTab === "Team" && (
          <div className="max-w-3xl">
            <p className="type-body text-text-tertiary mb-6">
              Your project team. Click on a member to see their profile and
              contact details.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {teamMembers.map((member) => (
                <button
                  key={member.id}
                  onClick={() => setSelectedMember(member)}
                  className="flex items-center gap-4 rounded-xl border border-border bg-surface-1 p-5 text-left transition-all duration-200 hover:border-border-hover hover:bg-surface-2 active:scale-[0.99]"
                >
                  <div className="h-12 w-12 shrink-0 rounded-full overflow-hidden bg-surface-2">
                    <img
                      src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(member.avatarSeed)}&backgroundColor=e8432a`}
                      alt={member.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-text-primary truncate">
                      {member.name}
                    </p>
                    <p className="type-caption text-text-tertiary truncate">
                      {member.role}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* My Case Study Tab */}
        {activeTab === "My Case Study" && (
          <div className="max-w-3xl">
            {/* Header with Post button */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="type-title text-text-primary">
                  {project.title}
                </h2>
                <p className="type-body text-text-tertiary mt-1">
                  {caseStudySections.length === 0
                    ? "Complete milestones to start building your case study."
                    : `${caseStudySections.length} section${caseStudySections.length !== 1 ? "s" : ""}`}
                </p>
              </div>
              {caseStudySections.length > 0 && (
                <button
                  onClick={publishCaseStudy}
                  disabled={(caseStudyPosted && !caseStudyDirty) || publishingCaseStudy}
                  className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors ${
                    caseStudyPosted && !caseStudyDirty
                      ? "bg-success/15 text-success cursor-default"
                      : caseStudyDirty
                        ? "bg-secondary text-white hover:bg-secondary/80 active:bg-secondary/70"
                        : "bg-primary text-white hover:bg-primary-hover active:bg-primary-active disabled:opacity-50"
                  }`}
                >
                  {publishingCaseStudy ? (
                    caseStudyDirty ? "Updating..." : "Publishing..."
                  ) : caseStudyPosted && !caseStudyDirty ? (
                    <>
                      <CheckCircle2 size={16} />
                      Posted
                    </>
                  ) : caseStudyDirty ? (
                    "Update Case Study"
                  ) : (
                    "Post Case Study"
                  )}
                </button>
              )}
            </div>

            {caseStudyPosted && !caseStudyDirty && (
              <div className="mb-6 rounded-lg bg-success/10 px-4 py-3 text-sm text-success">
                Your case study is live and visible on your profile.
              </div>
            )}
            {caseStudyDirty && (
              <div className="mb-6 rounded-lg bg-secondary/10 px-4 py-3 text-sm text-secondary">
                You have unsaved changes. Click &ldquo;Update Case Study&rdquo; to publish them.
              </div>
            )}

            {/* Case Study Sections */}
            {caseStudySections.length > 0 ? (
              <div className="space-y-6">
                {caseStudySections.map((milestone, i) => {
                  const section = getCaseStudySection(milestone);
                  const isEditing = editingSection === milestone.id;

                  return (
                    <section
                      key={milestone.id}
                      className="rounded-xl border border-border bg-surface-1 p-6"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                            {i + 1}
                          </span>
                          <h3 className="type-subhead text-text-primary">
                            {milestone.text}
                          </h3>
                        </div>
                        {!isEditing && (
                          <button
                            onClick={() => startEditingSection(milestone.id)}
                            className="shrink-0 flex items-center gap-1 text-xs text-text-tertiary hover:text-text-primary transition-colors"
                          >
                            <Pencil size={12} />
                            Edit
                          </button>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="space-y-3">
                          <div>
                            <label className="type-caption font-medium text-text-secondary">
                              Summary
                            </label>
                            <input
                              value={caseStudyEdits[milestone.id]?.summary || ""}
                              onChange={(e) =>
                                setCaseStudyEdits((prev) => ({
                                  ...prev,
                                  [milestone.id]: {
                                    ...prev[milestone.id],
                                    summary: e.target.value,
                                  },
                                }))
                              }
                              className="mt-1 w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-text-primary placeholder:text-text-disabled focus:border-accent focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="type-caption font-medium text-text-secondary">
                              Details
                            </label>
                            <textarea
                              value={caseStudyEdits[milestone.id]?.details || ""}
                              onChange={(e) =>
                                setCaseStudyEdits((prev) => ({
                                  ...prev,
                                  [milestone.id]: {
                                    ...prev[milestone.id],
                                    details: e.target.value,
                                  },
                                }))
                              }
                              rows={6}
                              className="mt-1 w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-text-primary placeholder:text-text-disabled focus:border-accent focus:outline-none resize-none"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveSectionEdit(milestone.id)}
                              className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
                            >
                              <Check size={14} />
                              Save
                            </button>
                            <button
                              onClick={() => setEditingSection(null)}
                              className="rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-3 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="type-body font-medium text-text-primary">
                            {section.summary}
                          </p>
                          {section.details && (
                            <p className="type-body mt-2 text-text-secondary whitespace-pre-wrap">
                              {section.details}
                            </p>
                          )}
                          {/* Show attached images */}
                          {milestone.report?.files && milestone.report.files.length > 0 && (
                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                              {milestone.report.files.map((file, fi) =>
                                file.type === "image" ? (
                                  <div
                                    key={fi}
                                    className="rounded-lg overflow-hidden border border-border"
                                  >
                                    <img
                                      src={file.url}
                                      alt={file.name}
                                      className="w-full object-contain max-h-48"
                                    />
                                  </div>
                                ) : file.type === "video" ? (
                                  <div
                                    key={fi}
                                    className="rounded-lg overflow-hidden border border-border"
                                  >
                                    <video
                                      src={file.url}
                                      controls
                                      className="w-full max-h-48"
                                    />
                                  </div>
                                ) : null
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </section>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-surface-1 p-10 text-center">
                <FileText
                  size={40}
                  className="mx-auto text-text-disabled mb-3"
                />
                <p className="type-body text-text-tertiary">
                  No sections yet. Submit milestone reports to build your case
                  study.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Team Member Modal */}
        {selectedMember && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedMember(null)}
          >
            <div
              className="relative w-[90vw] max-w-md rounded-2xl bg-surface-1 p-8"
              style={{ boxShadow: "var(--shadow-high)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedMember(null)}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-md text-text-tertiary hover:bg-surface-2 hover:text-text-primary transition-all"
              >
                <X size={18} />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="h-20 w-20 rounded-full overflow-hidden bg-surface-2">
                  <img
                    src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(selectedMember.avatarSeed)}&backgroundColor=e8432a`}
                    alt={selectedMember.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <h3 className="type-title mt-4 text-text-primary">
                  {selectedMember.name}
                </h3>
                <p className="type-body text-text-secondary">
                  {selectedMember.role}
                </p>

                <p className="type-body mt-4 text-text-secondary">
                  {selectedMember.bio}
                </p>

                <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                  {selectedMember.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="mt-6 w-full space-y-2">
                  <div className="flex items-center gap-3 rounded-lg border border-border bg-surface-2 px-4 py-3">
                    <Mail size={16} className="shrink-0 text-accent" />
                    <a
                      href={`mailto:${selectedMember.email}`}
                      className="text-sm text-accent hover:underline"
                    >
                      {selectedMember.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-border bg-surface-2 px-4 py-3">
                    <MapPin size={16} className="shrink-0 text-accent" />
                    <span className="text-sm text-text-secondary">
                      {selectedMember.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Milestone Report Modal */}
        {reportMilestone && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setReportMilestone(null)}
          >
            <div
              className="relative w-[90vw] max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl bg-surface-1 p-8"
              style={{ boxShadow: "var(--shadow-high)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setReportMilestone(null)}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-md text-text-tertiary hover:bg-surface-2 hover:text-text-primary transition-all"
              >
                <X size={18} />
              </button>

              <h3 className="type-title text-text-primary pr-8">
                Milestone Report
              </h3>
              <p className="type-body mt-1 text-text-secondary">
                {reportMilestone.text}
              </p>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="type-caption font-medium text-text-secondary">
                    Summary *
                  </label>
                  <input
                    value={reportSummary}
                    onChange={(e) => setReportSummary(e.target.value)}
                    placeholder="Briefly describe what you accomplished"
                    className="mt-1 w-full rounded-lg border border-border bg-surface-2 px-4 py-3 text-text-primary placeholder:text-text-disabled focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="type-caption font-medium text-text-secondary">
                    Detailed Explanation
                  </label>
                  <textarea
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    rows={5}
                    placeholder="Explain your approach, challenges faced, and how you overcame them..."
                    className="mt-1 w-full rounded-lg border border-border bg-surface-2 px-4 py-3 text-text-primary placeholder:text-text-disabled focus:border-accent focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="type-caption font-medium text-text-secondary">
                    Link
                    <span className="ml-1 font-normal text-text-tertiary">(optional)</span>
                  </label>
                  <input
                    value={reportLink}
                    onChange={(e) => setReportLink(e.target.value)}
                    placeholder="GitHub repo, Figma file, or any relevant URL"
                    className="mt-1 w-full rounded-lg border border-border bg-surface-2 px-4 py-3 text-text-primary placeholder:text-text-disabled focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="type-caption font-medium text-text-secondary">
                    Attachments
                  </label>
                  <p className="type-caption text-text-tertiary mb-2">
                    Upload images or videos to support your report.
                  </p>

                  {/* Uploaded files */}
                  {reportFiles.length > 0 && (
                    <ul className="space-y-2 mb-3">
                      {reportFiles.map((file, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-3 rounded-lg border border-border bg-surface-2 px-3 py-2"
                        >
                          {file.type === "image" ? (
                            <ImageIcon
                              size={16}
                              className="shrink-0 text-accent"
                            />
                          ) : file.type === "video" ? (
                            <Video
                              size={16}
                              className="shrink-0 text-accent"
                            />
                          ) : (
                            <FileText
                              size={16}
                              className="shrink-0 text-accent"
                            />
                          )}
                          <span className="flex-1 text-sm text-text-primary truncate">
                            {file.name}
                          </span>
                          <button
                            onClick={() => removeReportFile(i)}
                            className="shrink-0 text-text-disabled hover:text-error transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  <label className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-surface-2 px-4 py-4 text-sm text-text-secondary hover:border-accent hover:text-text-primary transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
                    <Upload size={18} />
                    {uploading ? "Uploading..." : "Choose files to upload"}
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={submitReport}
                  disabled={!reportSummary.trim() || submittingReport || uploading}
                  className="flex-1 rounded-lg bg-primary px-4 py-3 font-medium text-white transition-colors hover:bg-primary-hover active:bg-primary-active disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submittingReport ? "Saving..." : "Submit Report"}
                </button>
                <button
                  onClick={() => setReportMilestone(null)}
                  className="rounded-lg border border-border bg-surface-2 px-4 py-3 font-medium text-text-secondary hover:bg-surface-3 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Report Modal (read-only) */}
        {viewingReport && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setViewingReport(null)}
          >
            <div
              className="relative w-[90vw] max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl bg-surface-1 p-8"
              style={{ boxShadow: "var(--shadow-high)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setViewingReport(null)}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-md text-text-tertiary hover:bg-surface-2 hover:text-text-primary transition-all"
              >
                <X size={18} />
              </button>

              <h3 className="type-title text-text-primary pr-8">
                Milestone Report
              </h3>
              <p className="type-body mt-1 text-text-secondary">
                {viewingReport.milestone.text}
              </p>

              <div className="mt-6 space-y-5">
                <div>
                  <h4 className="type-caption font-medium text-text-tertiary uppercase tracking-wide">
                    Summary
                  </h4>
                  <p className="type-body mt-1 text-text-primary">
                    {viewingReport.report.summary}
                  </p>
                </div>

                {viewingReport.report.details && (
                  <div>
                    <h4 className="type-caption font-medium text-text-tertiary uppercase tracking-wide">
                      Details
                    </h4>
                    <p className="type-body mt-1 text-text-secondary whitespace-pre-wrap">
                      {viewingReport.report.details}
                    </p>
                  </div>
                )}

                {viewingReport.report.link && (
                  <div>
                    <h4 className="type-caption font-medium text-text-tertiary uppercase tracking-wide">
                      Link
                    </h4>
                    <a
                      href={viewingReport.report.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="type-body mt-1 text-accent hover:underline inline-flex items-center gap-1"
                    >
                      {viewingReport.report.link}
                    </a>
                  </div>
                )}

                {viewingReport.report.files.length > 0 && (
                  <div>
                    <h4 className="type-caption font-medium text-text-tertiary uppercase tracking-wide mb-2">
                      Attachments
                    </h4>
                    <ul className="space-y-2">
                      {viewingReport.report.files.map((file, i) => (
                        <li key={i}>
                          {file.type === "image" ? (
                            <div className="rounded-lg overflow-hidden border border-border">
                              <img
                                src={file.url}
                                alt={file.name}
                                className="w-full object-contain max-h-64"
                              />
                              <p className="type-caption text-text-tertiary px-3 py-2 bg-surface-2">
                                {file.name}
                              </p>
                            </div>
                          ) : file.type === "video" ? (
                            <div className="rounded-lg overflow-hidden border border-border">
                              <video
                                src={file.url}
                                controls
                                className="w-full max-h-64"
                              />
                              <p className="type-caption text-text-tertiary px-3 py-2 bg-surface-2">
                                {file.name}
                              </p>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3 rounded-lg border border-border bg-surface-2 px-3 py-2">
                              <FileText
                                size={16}
                                className="shrink-0 text-accent"
                              />
                              <span className="text-sm text-text-primary truncate">
                                {file.name}
                              </span>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <button
                onClick={() => setViewingReport(null)}
                className="mt-6 w-full rounded-lg border border-border bg-surface-2 px-4 py-3 font-medium text-text-secondary hover:bg-surface-3 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </main>
  );
}
