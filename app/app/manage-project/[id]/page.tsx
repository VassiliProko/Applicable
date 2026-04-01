"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  X,
  Mail,
  User,
  Clock,
  Signal,
  ChevronDown,
  ChevronUp,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  Send,
} from "lucide-react";

interface Applicant {
  id: string;
  project_id: string;
  user_id: string;
  status: "pending" | "accepted" | "rejected";
  answers: { questionId: string; label: string; answer: string }[];
  created_at: string;
  user: {
    id: string;
    name: string;
    email: string;
    title: string | null;
    bio: string | null;
    skills: string | null;
  } | null;
}

interface ProjectData {
  id: string;
  title: string;
  tagline: string;
  companyName: string;
  category: string;
  difficulty: string;
  timeCommitment: string;
  skillTags: string[];
  logoUrl?: string;
  maxParticipants?: number;
  milestones?: { title: string; deadline?: string }[];
}

interface MilestoneReport {
  id: string;
  user_id: string;
  milestone_id: string;
  summary: string;
  details: string;
  files: { name: string; type: string; url: string }[];
  link: string | null;
  review_status: "pending" | "approved" | "rejected";
  feedback: string | null;
  created_at: string;
  userName?: string;
}

const statusStyles = {
  pending: "bg-secondary/15 text-secondary",
  accepted: "bg-success/15 text-success",
  rejected: "bg-error/15 text-error",
};

const statusLabels = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
};

export default function ManageProjectPage() {
  const params = useParams();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedApp, setExpandedApp] = useState<string | null>(null);
  const [profileModal, setProfileModal] = useState<Applicant | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "accepted" | "rejected">("all");
  const [updating, setUpdating] = useState<string | null>(null);
  const [manageTab, setManageTab] = useState<"applicants" | "reports" | "submissions">("applicants");

  // Reports review
  const [reports, setReports] = useState<MilestoneReport[]>([]);
  const [expandedReport, setExpandedReport] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState<Record<string, string>>({});
  const [reviewingReport, setReviewingReport] = useState<string | null>(null);

  // Final submissions
  interface FinalSubmission {
    id: string;
    project_id: string;
    user_id: string;
    deliverables: { id: string; title: string; url: string; status: string }[];
    status: "pending" | "approved" | "rejected";
    feedback: string | null;
    created_at: string;
    user: { name: string; email: string; title: string | null } | null;
  }
  const [submissions, setSubmissions] = useState<FinalSubmission[]>([]);
  const [submissionFeedback, setSubmissionFeedback] = useState<Record<string, string>>({});
  const [reviewingSubmission, setReviewingSubmission] = useState<string | null>(null);
  const [expandedSubmission, setExpandedSubmission] = useState<string | null>(null);

  useEffect(() => {
    // Fetch project details
    fetch("/api/projects")
      .then((res) => res.json())
      .then((projects) => {
        if (Array.isArray(projects)) {
          const found = projects.find((p: ProjectData) => p.id === params.id);
          if (found) setProject(found);
        }
      });

    // Fetch applicants
    fetch(`/api/applications?projectId=${params.id}`)
      .then((res) => res.json())
      .then(async (data) => {
        if (Array.isArray(data)) {
          setApplicants(data);

          // Fetch reports for all accepted members
          const accepted = data.filter((a: Applicant) => a.status === "accepted");
          const allReports: MilestoneReport[] = [];

          for (const app of accepted) {
            const res = await fetch(`/api/reports?projectId=${params.id}&userId=${app.user_id}`);
            const reports = await res.json();
            if (Array.isArray(reports)) {
              allReports.push(
                ...reports.map((r: MilestoneReport) => ({
                  ...r,
                  userName: app.user?.name || "Unknown",
                }))
              );
            }
          }
          setReports(allReports);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Fetch final submissions
    fetch(`/api/submissions?projectId=${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setSubmissions(data);
      })
      .catch(() => {});
  }, [params.id]);

  async function updateStatus(applicationId: string, status: "accepted" | "rejected") {
    setUpdating(applicationId);
    const res = await fetch("/api/applications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId, status }),
    });

    if (res.ok) {
      setApplicants((prev) =>
        prev.map((a) => (a.id === applicationId ? { ...a, status } : a))
      );
    }
    setUpdating(null);
  }

  async function reviewReport(reportId: string, reviewStatus: "approved" | "rejected") {
    setReviewingReport(reportId);
    const res = await fetch("/api/reports", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reportId,
        reviewStatus,
        feedback: feedbackText[reportId] || "",
      }),
    });

    if (res.ok) {
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId
            ? { ...r, review_status: reviewStatus, feedback: feedbackText[reportId] || null }
            : r
        )
      );
    }
    setReviewingReport(null);
  }

  // Get milestone title by id
  function getMilestoneTitle(milestoneId: string): string {
    if (!project?.milestones) return milestoneId;
    const idx = parseInt(milestoneId.replace("m-", ""));
    return project.milestones[idx]?.title || milestoneId;
  }

  async function reviewSubmission(submissionId: string, status: "approved" | "rejected") {
    setReviewingSubmission(submissionId);
    const res = await fetch("/api/submissions", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        submissionId,
        status,
        feedback: submissionFeedback[submissionId] || "",
      }),
    });
    if (res.ok) {
      setSubmissions((prev) =>
        prev.map((s) => s.id === submissionId ? { ...s, status, feedback: submissionFeedback[submissionId] || null } : s)
      );
    }
    setReviewingSubmission(null);
  }

  const pendingSubmissions = submissions.filter((s) => s.status === "pending");
  const pendingReports = reports.filter((r) => r.review_status === "pending");
  const reviewedReports = reports.filter((r) => r.review_status !== "pending");

  const filtered = filter === "all" ? applicants : applicants.filter((a) => a.status === filter);
  const counts = {
    all: applicants.length,
    pending: applicants.filter((a) => a.status === "pending").length,
    accepted: applicants.filter((a) => a.status === "accepted").length,
    rejected: applicants.filter((a) => a.status === "rejected").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <p className="type-body text-text-tertiary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <p className="type-body text-text-tertiary">Project not found or you don&apos;t have access.</p>
          <Link href="/profile" className="text-sm text-accent hover:underline">Back to Profile</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pb-16">
        {/* Header */}
        <div className="border-b border-[var(--border-base)]">
          <div className="mx-auto max-w-5xl px-6 py-6">
            <Link
              href="/profile"
              className="inline-flex items-center gap-1.5 text-sm text-text-tertiary hover:text-text-primary transition-colors mb-4"
            >
              <ArrowLeft size={16} />
              Back to Profile
            </Link>

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white">
                {project.logoUrl ? (
                  <img src={project.logoUrl} alt={project.companyName} className="h-7 w-7 object-contain" />
                ) : (
                  <span className="text-lg font-bold text-black">{project.companyName.charAt(0)}</span>
                )}
              </div>
              <div>
                <h1 className="type-headline text-text-primary">{project.title}</h1>
                <p className="type-body text-text-secondary">{project.companyName}</p>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <span className="type-caption rounded-full bg-primary/15 px-2.5 py-1 font-medium text-primary">
                <Signal size={12} className="inline mr-1 -mt-0.5" />
                {project.difficulty}
              </span>
              <span className="type-caption text-text-tertiary">
                <Clock size={12} className="inline mr-1 -mt-0.5" />
                {project.timeCommitment}
              </span>
              <span className="type-caption text-text-tertiary">
                {counts.accepted}/{project.maxParticipants || 4} accepted
              </span>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-6 mt-8">
          {/* Tabs */}
          <div className="flex gap-1 rounded-lg bg-surface-1 p-1 w-fit mb-8">
            <button
              onClick={() => setManageTab("applicants")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
                manageTab === "applicants" ? "bg-surface-3 text-text-primary shadow-sm" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Applicants
              <span className={`ml-1.5 text-xs ${manageTab === "applicants" ? "text-text-secondary" : "text-text-tertiary"}`}>
                {applicants.length}
              </span>
            </button>
            <button
              onClick={() => setManageTab("reports")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
                manageTab === "reports" ? "bg-surface-3 text-text-primary shadow-sm" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Reports
              {pendingReports.length > 0 && (
                <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                  {pendingReports.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setManageTab("submissions")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
                manageTab === "submissions" ? "bg-surface-3 text-text-primary shadow-sm" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Submissions
              {pendingSubmissions.length > 0 && (
                <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-success text-[10px] font-bold text-white">
                  {pendingSubmissions.length}
                </span>
              )}
            </button>
          </div>

          {manageTab === "applicants" && (
          <>
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {(["all", "pending", "accepted", "rejected"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-xl border p-4 text-left transition-all ${
                  filter === f ? "border-accent bg-accent/5" : "border-border bg-surface-1 hover:bg-surface-2"
                }`}
              >
                <p className="text-2xl font-bold text-text-primary">{counts[f]}</p>
                <p className="type-caption text-text-tertiary capitalize">{f === "all" ? "Total" : f}</p>
              </button>
            ))}
          </div>

          {/* Applicants list */}
          <h2 className="type-title text-text-primary mb-4">
            {filter === "all" ? "All Applicants" : `${statusLabels[filter as keyof typeof statusLabels]} Applicants`}
          </h2>

          {filtered.length > 0 ? (
            <div className="space-y-3">
              {filtered.map((app) => (
                <div key={app.id} className="rounded-xl border border-border bg-surface-1 overflow-hidden">
                  {/* Applicant header */}
                  <div className="flex items-center gap-4 p-5">
                    <button
                      onClick={() => setProfileModal(app)}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-2 text-text-secondary hover:bg-surface-3 transition-colors"
                    >
                      <User size={18} />
                    </button>

                    <div className="flex-1 min-w-0">
                      <button
                        onClick={() => setProfileModal(app)}
                        className="text-sm font-semibold text-text-primary hover:text-accent transition-colors"
                      >
                        {app.user?.name || "Unknown User"}
                      </button>
                      <p className="type-caption text-text-tertiary">
                        {app.user?.title || app.user?.email || ""}
                        {" · Applied "}
                        {new Date(app.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                    </div>

                    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${statusStyles[app.status]}`}>
                      {statusLabels[app.status]}
                    </span>

                    {/* Accept/Reject buttons */}
                    {app.status === "pending" && (
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => updateStatus(app.id, "accepted")}
                          disabled={updating === app.id}
                          className="flex items-center gap-1 rounded-lg bg-success/15 px-3 py-1.5 text-xs font-medium text-success hover:bg-success/25 transition-colors disabled:opacity-50"
                        >
                          <Check size={14} />
                          Accept
                        </button>
                        <button
                          onClick={() => updateStatus(app.id, "rejected")}
                          disabled={updating === app.id}
                          className="flex items-center gap-1 rounded-lg bg-error/15 px-3 py-1.5 text-xs font-medium text-error hover:bg-error/25 transition-colors disabled:opacity-50"
                        >
                          <X size={14} />
                          Reject
                        </button>
                      </div>
                    )}

                    {app.status !== "pending" && (
                      <button
                        onClick={() => updateStatus(app.id, app.status === "accepted" ? "rejected" : "accepted")}
                        disabled={updating === app.id}
                        className="text-xs text-text-tertiary hover:text-text-primary transition-colors disabled:opacity-50"
                      >
                        Change
                      </button>
                    )}

                    {/* Expand answers */}
                    <button
                      onClick={() => setExpandedApp(expandedApp === app.id ? null : app.id)}
                      className="shrink-0 text-text-tertiary hover:text-text-primary transition-colors"
                    >
                      {expandedApp === app.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>

                  {/* Expanded answers */}
                  {expandedApp === app.id && (
                    <div className="border-t border-border bg-surface-2/50 p-5 space-y-4">
                      {app.answers && app.answers.length > 0 ? (
                        app.answers.map((a, i) => (
                          <div key={i}>
                            <p className="type-caption font-medium text-text-secondary">{a.label}</p>
                            <p className="type-body text-text-primary mt-1">{a.answer || "—"}</p>
                          </div>
                        ))
                      ) : (
                        <p className="type-body text-text-tertiary">No answers submitted.</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-surface-1 p-10 text-center">
              <p className="type-body text-text-tertiary">
                {filter === "all" ? "No applications yet." : `No ${filter} applications.`}
              </p>
            </div>
          )}
          </>
          )}

          {/* Reports Tab */}
          {manageTab === "reports" && (
            <div>
              {/* Pending reports */}
              {pendingReports.length > 0 && (
                <div className="mb-8">
                  <h2 className="type-title text-text-primary mb-4">
                    Pending Review
                    <span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                      {pendingReports.length}
                    </span>
                  </h2>
                  <div className="space-y-3">
                    {pendingReports.map((report) => (
                      <div key={report.id} className="rounded-xl border border-secondary/30 bg-surface-1 overflow-hidden">
                        <div className="flex items-center gap-4 p-5">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/15">
                            <FileText size={18} className="text-secondary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-text-primary">
                              {getMilestoneTitle(report.milestone_id)}
                            </p>
                            <p className="type-caption text-text-tertiary">
                              by {report.userName} · {new Date(report.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </p>
                          </div>
                          <span className="rounded-full bg-secondary/15 px-3 py-1 text-xs font-medium text-secondary">
                            Pending
                          </span>
                          <button
                            onClick={() => setExpandedReport(expandedReport === report.id ? null : report.id)}
                            className="text-text-tertiary hover:text-text-primary"
                          >
                            {expandedReport === report.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                        </div>

                        {expandedReport === report.id && (
                          <div className="border-t border-border p-5 space-y-4">
                            <div>
                              <p className="type-caption font-medium text-text-tertiary uppercase tracking-wide">Summary</p>
                              <p className="type-body mt-1 text-text-primary">{report.summary}</p>
                            </div>
                            {report.details && (
                              <div>
                                <p className="type-caption font-medium text-text-tertiary uppercase tracking-wide">Details</p>
                                <p className="type-body mt-1 text-text-secondary whitespace-pre-wrap">{report.details}</p>
                              </div>
                            )}
                            {report.link && (
                              <div>
                                <p className="type-caption font-medium text-text-tertiary uppercase tracking-wide">Link</p>
                                <a href={report.link} target="_blank" rel="noopener noreferrer" className="type-body text-accent hover:underline">
                                  {report.link}
                                </a>
                              </div>
                            )}
                            {report.files && report.files.length > 0 && (
                              <div>
                                <p className="type-caption font-medium text-text-tertiary uppercase tracking-wide mb-2">Attachments</p>
                                <div className="grid gap-3 sm:grid-cols-2">
                                  {report.files.map((file, fi) =>
                                    file.type === "image" ? (
                                      <div key={fi} className="rounded-lg overflow-hidden border border-border">
                                        <img src={file.url} alt={file.name} className="w-full object-contain max-h-48" />
                                        <p className="type-caption text-text-tertiary px-3 py-1 bg-surface-2">{file.name}</p>
                                      </div>
                                    ) : (
                                      <div key={fi} className="flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-2">
                                        <FileText size={14} className="text-accent" />
                                        <span className="text-sm text-text-primary truncate">{file.name}</span>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Feedback + Actions */}
                            <div className="border-t border-border pt-4 mt-4">
                              <label className="type-caption font-medium text-text-secondary mb-1 block">
                                Feedback (required for rejection, optional for approval)
                              </label>
                              <textarea
                                value={feedbackText[report.id] || ""}
                                onChange={(e) => setFeedbackText((prev) => ({ ...prev, [report.id]: e.target.value }))}
                                placeholder="Write feedback for the submitter..."
                                rows={3}
                                className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-text-primary placeholder:text-text-disabled focus:border-accent focus:outline-none resize-none"
                              />
                              <div className="flex gap-3 mt-3">
                                <button
                                  onClick={() => reviewReport(report.id, "approved")}
                                  disabled={reviewingReport === report.id}
                                  className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-success px-4 py-2.5 text-sm font-medium text-white hover:bg-success/80 transition-colors disabled:opacity-50"
                                >
                                  <Check size={14} />
                                  Approve
                                </button>
                                <button
                                  onClick={() => {
                                    if (!feedbackText[report.id]?.trim()) {
                                      setFeedbackText((prev) => ({ ...prev, [report.id]: prev[report.id] || "" }));
                                      return;
                                    }
                                    reviewReport(report.id, "rejected");
                                  }}
                                  disabled={reviewingReport === report.id || !feedbackText[report.id]?.trim()}
                                  className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-error px-4 py-2.5 text-sm font-medium text-white hover:bg-error/80 transition-colors disabled:opacity-50"
                                >
                                  <X size={14} />
                                  Reject
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviewed reports */}
              <div>
                <h2 className="type-title text-text-primary mb-4">
                  Reviewed {reviewedReports.length > 0 && `(${reviewedReports.length})`}
                </h2>
                {reviewedReports.length > 0 ? (
                  <div className="space-y-3">
                    {reviewedReports.map((report) => (
                      <div key={report.id} className="rounded-xl border border-border bg-surface-1 overflow-hidden">
                        <div className="flex items-center gap-4 p-5">
                          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                            report.review_status === "approved" ? "bg-success/15" : "bg-error/15"
                          }`}>
                            <FileText size={18} className={report.review_status === "approved" ? "text-success" : "text-error"} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-text-primary">
                              {getMilestoneTitle(report.milestone_id)}
                            </p>
                            <p className="type-caption text-text-tertiary">
                              by {report.userName}
                            </p>
                          </div>
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                            report.review_status === "approved" ? "bg-success/15 text-success" : "bg-error/15 text-error"
                          }`}>
                            {report.review_status === "approved" ? "Approved" : "Rejected"}
                          </span>
                          <button
                            onClick={() => setExpandedReport(expandedReport === report.id ? null : report.id)}
                            className="text-text-tertiary hover:text-text-primary"
                          >
                            {expandedReport === report.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                        </div>

                        {expandedReport === report.id && (
                          <div className="border-t border-border p-5 space-y-4">
                            <div>
                              <p className="type-caption font-medium text-text-tertiary uppercase tracking-wide">Summary</p>
                              <p className="type-body mt-1 text-text-primary">{report.summary}</p>
                            </div>
                            {report.details && (
                              <div>
                                <p className="type-caption font-medium text-text-tertiary uppercase tracking-wide">Details</p>
                                <p className="type-body mt-1 text-text-secondary whitespace-pre-wrap">{report.details}</p>
                              </div>
                            )}
                            {report.feedback && (
                              <div className={`rounded-lg p-4 ${
                                report.review_status === "approved" ? "bg-success/5 border border-success/20" : "bg-error/5 border border-error/20"
                              }`}>
                                <p className="type-caption font-medium text-text-tertiary uppercase tracking-wide mb-1">
                                  <MessageSquare size={12} className="inline mr-1 -mt-0.5" />
                                  Your Feedback
                                </p>
                                <p className="type-body text-text-primary">{report.feedback}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-border bg-surface-1 p-10 text-center">
                    <p className="type-body text-text-tertiary">No reviewed reports yet.</p>
                  </div>
                )}
              </div>

              {reports.length === 0 && pendingReports.length === 0 && (
                <div className="rounded-xl border border-border bg-surface-1 p-10 text-center">
                  <FileText size={40} className="mx-auto text-text-disabled mb-3" />
                  <p className="type-body text-text-tertiary">No reports submitted yet. Accepted participants will submit milestone reports here.</p>
                </div>
              )}
            </div>
          )}

          {/* Submissions Tab */}
          {manageTab === "submissions" && (
            <div>
              {submissions.length > 0 ? (
                <div className="space-y-4">
                  {submissions.map((sub) => (
                    <div key={sub.id} className={`rounded-xl border overflow-hidden ${
                      sub.status === "approved" ? "border-success/30 bg-surface-1" :
                      sub.status === "rejected" ? "border-error/30 bg-surface-1" :
                      "border-secondary/30 bg-surface-1"
                    }`}>
                      <div className="flex items-center gap-4 p-5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-2">
                          <User size={18} className="text-text-secondary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-text-primary">
                            {sub.user?.name || "Unknown User"}
                          </p>
                          <p className="type-caption text-text-tertiary">
                            {sub.deliverables.length} deliverable{sub.deliverables.length !== 1 ? "s" : ""}
                            {" · Submitted "}
                            {new Date(sub.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </p>
                        </div>
                        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                          sub.status === "approved" ? "bg-success/15 text-success" :
                          sub.status === "rejected" ? "bg-error/15 text-error" :
                          "bg-secondary/15 text-secondary"
                        }`}>
                          {sub.status === "approved" ? "Approved" : sub.status === "rejected" ? "Rejected" : "Pending"}
                        </span>
                        <button
                          onClick={() => setExpandedSubmission(expandedSubmission === sub.id ? null : sub.id)}
                          className="text-text-tertiary hover:text-text-primary"
                        >
                          {expandedSubmission === sub.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                      </div>

                      {expandedSubmission === sub.id && (
                        <div className="border-t border-border p-5 space-y-4">
                          {/* Deliverables */}
                          <div>
                            <p className="type-caption font-medium text-text-tertiary uppercase tracking-wide mb-2">Deliverables</p>
                            <ul className="space-y-2">
                              {sub.deliverables.map((d, di) => (
                                <li key={di} className="flex items-center gap-3 rounded-lg border border-border bg-surface-2 px-4 py-3">
                                  <FileText size={14} className="shrink-0 text-accent" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-text-primary truncate">{d.title}</p>
                                    <a href={d.url} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline truncate block">
                                      {d.url}
                                    </a>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Previous feedback if rejected */}
                          {sub.feedback && sub.status === "rejected" && (
                            <div className="rounded-lg bg-error/5 border border-error/20 p-4">
                              <p className="type-caption font-medium text-error mb-1">Previous Feedback</p>
                              <p className="type-body text-text-secondary">{sub.feedback}</p>
                            </div>
                          )}

                          {/* Review actions */}
                          {sub.status === "pending" && (
                            <div className="border-t border-border pt-4">
                              <label className="type-caption font-medium text-text-secondary mb-1 block">
                                Feedback (required for rejection)
                              </label>
                              <textarea
                                value={submissionFeedback[sub.id] || ""}
                                onChange={(e) => setSubmissionFeedback((prev) => ({ ...prev, [sub.id]: e.target.value }))}
                                placeholder="Write feedback..."
                                rows={3}
                                className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-text-primary placeholder:text-text-disabled focus:border-accent focus:outline-none resize-none"
                              />
                              <div className="flex gap-3 mt-3">
                                <button
                                  onClick={() => reviewSubmission(sub.id, "approved")}
                                  disabled={reviewingSubmission === sub.id}
                                  className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-success px-4 py-2.5 text-sm font-medium text-white hover:bg-success/80 transition-colors disabled:opacity-50"
                                >
                                  <Check size={14} />
                                  Approve Project
                                </button>
                                <button
                                  onClick={() => {
                                    if (!submissionFeedback[sub.id]?.trim()) return;
                                    reviewSubmission(sub.id, "rejected");
                                  }}
                                  disabled={reviewingSubmission === sub.id || !submissionFeedback[sub.id]?.trim()}
                                  className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-error px-4 py-2.5 text-sm font-medium text-white hover:bg-error/80 transition-colors disabled:opacity-50"
                                >
                                  <X size={14} />
                                  Request Changes
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Show feedback if already reviewed */}
                          {sub.status === "approved" && sub.feedback && (
                            <div className="rounded-lg bg-success/5 border border-success/20 p-4">
                              <p className="type-caption font-medium text-success mb-1">Your Feedback</p>
                              <p className="type-body text-text-secondary">{sub.feedback}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-surface-1 p-10 text-center">
                  <Send size={40} className="mx-auto text-text-disabled mb-3" />
                  <p className="type-body text-text-tertiary">No final submissions yet. Participants will submit their completed work here.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile Modal */}
        {profileModal && profileModal.user && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setProfileModal(null)}
          >
            <div
              className="relative w-[90vw] max-w-md rounded-2xl bg-surface-1 p-8"
              style={{ boxShadow: "var(--shadow-high)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setProfileModal(null)}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-md text-text-tertiary hover:bg-surface-2 hover:text-text-primary transition-all"
              >
                <X size={18} />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full overflow-hidden bg-surface-2 flex items-center justify-center">
                  <img
                    src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(profileModal.user.name.split(" ").map((n) => n[0]).join(""))}&backgroundColor=e8432a`}
                    alt={profileModal.user.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <h3 className="type-title mt-4 text-text-primary">{profileModal.user.name}</h3>
                {profileModal.user.title && (
                  <p className="type-body text-text-secondary">{profileModal.user.title}</p>
                )}

                {profileModal.user.bio && (
                  <p className="type-body mt-3 text-text-secondary">{profileModal.user.bio}</p>
                )}

                {profileModal.user.skills && (
                  <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                    {profileModal.user.skills.split(",").map((s) => s.trim()).filter(Boolean).map((skill) => (
                      <span key={skill} className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-5 w-full">
                  <a
                    href={`mailto:${profileModal.user.email}`}
                    className="flex items-center justify-center gap-2 rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm text-accent hover:bg-surface-3 transition-colors"
                  >
                    <Mail size={16} />
                    {profileModal.user.email}
                  </a>
                </div>

                {/* Accept/Reject from modal */}
                {profileModal.status === "pending" && (
                  <div className="mt-4 flex gap-3 w-full">
                    <button
                      onClick={() => {
                        updateStatus(profileModal.id, "accepted");
                        setProfileModal({ ...profileModal, status: "accepted" });
                      }}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-success px-4 py-2.5 text-sm font-medium text-white hover:bg-success/80 transition-colors"
                    >
                      <Check size={14} />
                      Accept
                    </button>
                    <button
                      onClick={() => {
                        updateStatus(profileModal.id, "rejected");
                        setProfileModal({ ...profileModal, status: "rejected" });
                      }}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-error px-4 py-2.5 text-sm font-medium text-white hover:bg-error/80 transition-colors"
                    >
                      <X size={14} />
                      Reject
                    </button>
                  </div>
                )}

                {profileModal.status !== "pending" && (
                  <div className="mt-4 w-full">
                    <span className={`inline-flex rounded-full px-4 py-1.5 text-sm font-medium ${statusStyles[profileModal.status]}`}>
                      {statusLabels[profileModal.status]}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
