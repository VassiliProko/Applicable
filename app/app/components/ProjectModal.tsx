"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Project } from "@/app/lib/types";
import { X, Clock, Signal, Check, CheckCircle, LogIn } from "lucide-react";

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

export default function ProjectModal({
  project,
  onClose,
  showApply = true,
}: {
  project: Project | null;
  onClose: () => void;
  showApply?: boolean;
}) {
  const { status } = useSession();
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const resetAndClose = useCallback(() => {
    setFormData({});
    setSubmitted(false);
    dialogRef.current?.close();
    onClose();
  }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (project) {
      setFormData({});
      setSubmitted(false);
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [project]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (e: Event) => {
      e.preventDefault();
      resetAndClose();
    };

    dialog.addEventListener("cancel", handleCancel);
    return () => dialog.removeEventListener("cancel", handleCancel);
  }, [resetAndClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      resetAndClose();
    }
  };

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    setSubmitting(true);
    setSubmitError("");

    const answers = project.applicationQuestions.map((q) => ({
      questionId: q.id,
      label: q.label,
      answer: formData[q.id] || "",
    }));

    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: project.id, answers }),
    });

    if (res.ok) {
      setSubmitted(true);
    } else {
      const data = await res.json();
      setSubmitError(data.error === "Already applied" ? "You have already applied to this project." : data.error || "Failed to submit");
    }
    setSubmitting(false);
  };

  const requiredFilled =
    project?.applicationQuestions
      .filter((q) => q.required)
      .every((q) => formData[q.id]?.trim()) ?? false;

  const difficultyColor: Record<string, string> = {
    Beginner: "bg-success/15 text-success",
    Intermediate: "bg-secondary/15 text-secondary",
    Advanced: "bg-primary/15 text-primary",
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      aria-labelledby="modal-title"
      className="m-auto max-h-[90vh] w-[90vw] max-w-6xl overflow-hidden rounded-[18px] bg-surface-1 p-0 text-text-primary"
      style={{ boxShadow: "var(--shadow-high)" }}
    >
      {project && (
        <div className="relative flex max-h-[90vh] flex-col lg:flex-row">
          {/* Close button */}
          <button
            onClick={resetAndClose}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-[6px] text-text-tertiary transition-all duration-100 hover:bg-surface-2 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <X size={20} />
          </button>

          {/* Left: project details */}
          <div className={`flex-1 overflow-y-auto p-9 ${showApply ? "lg:max-w-[60%]" : ""}`}>
            <h2 id="modal-title" className="type-headline pr-8">
              {project.title}
            </h2>

            <div className="mt-4 aspect-video w-full overflow-hidden rounded-[10px] bg-black">
              <img
                src={getThumbnail(project)}
                alt={project.title}
                className="h-full w-full object-cover"
              />
            </div>

            <p className="type-body mt-4 text-text-secondary">
              {project.tagline}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
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
            </div>

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

            <div className="mt-6">
              <h3 className="type-title">Overview</h3>
              <p className="type-body mt-2 text-text-secondary">
                {project.details.overview}
              </p>
            </div>

            <div className="mt-6">
              <h3 className="type-title">What You&apos;ll Learn</h3>
              <ul className="mt-3 space-y-2">
                {project.details.learningOutcomes.map((outcome, oi) => (
                  <li
                    key={oi}
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

            <div className="mt-6">
              <h3 className="type-title">Prerequisites</h3>
              <ul className="mt-3 space-y-2">
                {project.details.prerequisites.map((prereq, pi) => (
                  <li
                    key={pi}
                    className="type-body flex items-start gap-2 text-text-secondary"
                  >
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-text-tertiary" />
                    {prereq}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: application form */}
          {showApply && (
            <div className="border-t border-border bg-surface-2/50 p-9 lg:w-[40%] lg:border-l lg:border-t-0 overflow-y-auto">
              {status !== "authenticated" ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <LogIn size={48} className="text-text-tertiary" />
                  <h3 className="type-title mt-4">Sign in to Apply</h3>
                  <p className="type-body mt-2 text-text-secondary">
                    You need an account to submit an application. Sign in or
                    create one to get started.
                  </p>
                  <button
                    onClick={() => router.push("/login")}
                    className="mt-6 h-12 w-full rounded-[6px] bg-primary text-base font-medium text-white transition-all duration-100 hover:bg-primary-hover active:bg-primary-active active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => router.push("/register")}
                    className="mt-3 h-12 w-full rounded-[6px] bg-surface-2 text-base font-medium text-text-primary transition-all duration-100 hover:bg-surface-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    Create Account
                  </button>
                </div>
              ) : submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle size={48} className="text-success" />
                  <h3 className="type-title mt-4">Application Sent</h3>
                  <p className="type-body mt-2 text-text-secondary">
                    Your application has been submitted. We&apos;ll be in touch
                    soon.
                  </p>
                  <button
                    onClick={resetAndClose}
                    className="mt-6 h-12 rounded-[6px] bg-surface-2 px-6 text-base font-medium transition-all duration-100 hover:bg-surface-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="type-title">Apply</h3>
                  <p className="type-caption mt-1 text-text-tertiary">
                    Tell us why you&apos;re a great fit for this project.
                  </p>
                  <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    {project.applicationQuestions.map((q) => (
                      <div key={q.id}>
                        <label
                          htmlFor={q.id}
                          className="type-body block font-medium text-text-primary"
                        >
                          {q.label}
                          {q.required && (
                            <span className="ml-1 text-primary">*</span>
                          )}
                        </label>
                        {q.type === "textarea" ? (
                          <textarea
                            id={q.id}
                            placeholder={q.placeholder}
                            required={q.required}
                            value={formData[q.id] ?? ""}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                [q.id]: e.target.value,
                              }))
                            }
                            rows={3}
                            className="type-body mt-1.5 w-full resize-y rounded-[6px] border border-border bg-transparent px-3.5 py-2.5 text-text-primary placeholder:text-text-tertiary transition-all duration-100 focus:border-primary focus:outline-none focus:shadow-[0_0_0_2px_var(--primary-focus-ring)]"
                          />
                        ) : (
                          <input
                            id={q.id}
                            type="text"
                            placeholder={q.placeholder}
                            required={q.required}
                            value={formData[q.id] ?? ""}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                [q.id]: e.target.value,
                              }))
                            }
                            className="type-body mt-1.5 h-12 w-full rounded-[6px] border border-border bg-transparent px-3.5 text-text-primary placeholder:text-text-tertiary transition-all duration-100 focus:border-primary focus:outline-none focus:shadow-[0_0_0_2px_var(--primary-focus-ring)]"
                          />
                        )}
                      </div>
                    ))}
                    {submitError && (
                      <p className="text-sm text-error mb-2">{submitError}</p>
                    )}
                    <button
                      type="submit"
                      disabled={!requiredFilled || submitting}
                      className="h-12 w-full rounded-[6px] bg-primary text-base font-medium text-white transition-all duration-100 hover:bg-primary-hover active:bg-primary-active active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-40 disabled:pointer-events-none"
                    >
                      {submitting ? "Submitting..." : "Submit Application"}
                    </button>
                  </form>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </dialog>
  );
}
