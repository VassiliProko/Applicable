"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StaticGrid from "@/app/components/StaticGrid";
import { useTheme } from "@/app/components/ThemeProvider";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  X,
  Check,
  Trash2,
} from "lucide-react";

interface MilestoneInput {
  id: string;
  title: string;
  deadline: string;
}

interface QuestionInput {
  id: string;
  label: string;
  type: "text" | "textarea";
  required: boolean;
}

const categories = [
  "Engineering",
  "Data & Analytics",
  "Design",
  "Product",
  "Content",
  "Mobile",
  "DevOps",
  "Marketing",
  "Other",
];

const steps = ["Basics", "Details", "Milestones", "Application", "Review"];

export default function CreateProjectPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [createdProjectId, setCreatedProjectId] = useState<string | null>(null);

  // Step 1: Basics
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyDomain, setCompanyDomain] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
  const [timeMin, setTimeMin] = useState("");
  const [timeMax, setTimeMax] = useState("");
  const [maxParticipants, setMaxParticipants] = useState(4);

  // Step 2: Details
  const [overview, setOverview] = useState("");
  const [description, setDescription] = useState("");
  const [skillTags, setSkillTags] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [learningOutcomes, setLearningOutcomes] = useState<string[]>([""]);
  const [prerequisites, setPrerequisites] = useState<string[]>([""]);

  // Step 3: Milestones
  const [milestones, setMilestones] = useState<MilestoneInput[]>([
    { id: "ms-1", title: "", deadline: "" },
  ]);

  // Step 4: Application Questions
  const [questions, setQuestions] = useState<QuestionInput[]>([
    { id: "q-1", label: "Why are you interested in this project?", type: "textarea", required: true },
    { id: "q-2", label: "What relevant experience do you have?", type: "textarea", required: true },
  ]);

  function addSkill() {
    if (!newSkill.trim() || skillTags.includes(newSkill.trim())) return;
    setSkillTags((prev) => [...prev, newSkill.trim()]);
    setNewSkill("");
  }

  function addListItem(setter: React.Dispatch<React.SetStateAction<string[]>>) {
    setter((prev) => [...prev, ""]);
  }

  function updateListItem(setter: React.Dispatch<React.SetStateAction<string[]>>, index: number, value: string) {
    setter((prev) => prev.map((item, i) => (i === index ? value : item)));
  }

  function removeListItem(setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) {
    setter((prev) => prev.filter((_, i) => i !== index));
  }

  function addMilestone() {
    setMilestones((prev) => [
      ...prev,
      { id: `ms-${Date.now()}`, title: "", deadline: "" },
    ]);
  }

  function addQuestion() {
    setQuestions((prev) => [
      ...prev,
      { id: `q-${Date.now()}`, label: "", type: "textarea", required: false },
    ]);
  }

  function canProceed(): boolean {
    switch (step) {
      case 0:
        return !!(title && tagline && companyName && category && difficulty && timeMin);
      case 1:
        return !!(overview && skillTags.length > 0 && learningOutcomes.some((o) => o.trim()));
      case 2:
        return milestones.some((m) => m.title.trim());
      case 3:
        return questions.some((q) => q.label.trim());
      default:
        return true;
    }
  }

  async function handleSubmit() {
    setSubmitting(true);

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        tagline,
        description,
        companyName,
        companyDomain: companyDomain || null,
        category,
        skillTags,
        difficulty,
        timeCommitment: timeMax ? `${timeMin}-${timeMax} hours` : `${timeMin} hours`,
        overview,
        learningOutcomes: learningOutcomes.filter((o) => o.trim()),
        prerequisites: prerequisites.filter((p) => p.trim()),
        milestones: milestones
          .filter((m) => m.title.trim())
          .map((m) => ({ title: m.title, deadline: m.deadline })),
        applicationQuestions: questions
          .filter((q) => q.label.trim())
          .map((q) => ({
            id: q.id,
            label: q.label,
            type: q.type,
            placeholder: "",
            required: q.required,
          })),
        maxParticipants,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setCreatedProjectId(data.id);
    }
    setSubmitting(false);
  }

  const inputClass =
    "w-full rounded-lg border border-border bg-surface-2 px-4 py-3 text-text-primary placeholder:text-text-disabled focus:border-accent focus:outline-none";
  const labelClass = "type-caption font-medium text-text-secondary mb-1 block";

  const isLight = theme === "light";
  const stepImages = isLight
    ? [
        "/Loading screen/Step 1_light.png",
        "/Loading screen/Step 2_light.png",
        "/Loading screen/Step 3_light.png",
        "/Loading screen/Step 4_light.png",
        "/Loading screen/Step 5_light.png",
      ]
    : [
        "/Loading screen/Step 1.png",
        "/Loading screen/Step 2.png",
        "/Loading screen/Step 3.png",
        "/Loading screen/Step 4.png",
        "/Loading screen/Completed icon.png",
      ];

  if (createdProjectId) {
    return (
      <main className="flex-1 flex items-center justify-center px-6 relative overflow-hidden">
        <StaticGrid />
        <div
          className="absolute bottom-0 left-0 right-0 h-[50%] z-1 pointer-events-none"
          style={{ background: "linear-gradient(to top, var(--background), transparent)" }}
        />
        <div className="relative z-10 flex flex-col items-center text-center animate-fade-in">
          <img
            src={isLight ? "/Loading screen/Step 5_light.png" : "/Loading screen/Completed icon.png"}
            alt="Project created"
            className="w-48 h-48 object-contain mb-8 animate-float animate-glow"
          />
          <h1 className="type-display text-text-primary">Project Published!</h1>
          <p className="type-body text-text-secondary mt-3 max-w-md">
            Your project is live and ready for applicants. Share it with the world or head to your dashboard to manage it.
          </p>
          <div className="flex gap-3 mt-8">
            <button
              onClick={() => router.push(`/manage-project/${createdProjectId}`)}
              className="inline-flex h-12 items-center gap-2 rounded-lg bg-primary px-6 text-base font-medium text-white transition-colors hover:bg-primary-hover active:scale-[0.98]"
            >
              Go to Dashboard
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => router.push("/#projects")}
              className="inline-flex h-12 items-center gap-2 rounded-lg border border-border bg-surface-2 px-6 text-base font-medium text-text-primary transition-colors hover:bg-surface-3 active:scale-[0.98]"
            >
              Browse Projects
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-6 py-10 flex gap-32">
          {/* Left: Form */}
          <div className="flex-1 min-w-0">
          {/* Header */}
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-sm text-text-tertiary hover:text-text-primary transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <h1 className="type-headline text-text-primary">Create a Project</h1>
          <p className="type-body text-text-tertiary mt-1">
            Post a project for others to apply and work on.
          </p>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mt-6 mb-8">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <button
                  onClick={() => i < step && setStep(i)}
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    i < step
                      ? "bg-success text-white"
                      : i === step
                        ? "bg-primary text-white"
                        : "bg-surface-3 text-text-disabled"
                  }`}
                >
                  {i < step ? <Check size={14} /> : i + 1}
                </button>
                <span
                  className={`text-xs font-medium hidden sm:block ${
                    i === step ? "text-text-primary" : "text-text-tertiary"
                  }`}
                >
                  {s}
                </span>
                {i < steps.length - 1 && (
                  <div className="w-6 h-px bg-surface-3 hidden sm:block" />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Basics */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Project Title *</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Accessible Component Library"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Tagline *</label>
                <input
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="A short description that appears on the card"
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Company / Organization *</label>
                  <input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Stripe"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Company Website</label>
                  <input
                    value={companyDomain}
                    onChange={(e) => setCompanyDomain(e.target.value)}
                    placeholder="e.g. stripe.com (for logo)"
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Difficulty *</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as typeof difficulty)}
                    className={inputClass}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Time Commitment *</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      value={timeMin}
                      onChange={(e) => setTimeMin(e.target.value)}
                      placeholder="Min"
                      className={inputClass + " flex-1"}
                    />
                    <span className="text-sm text-text-tertiary">—</span>
                    <input
                      type="number"
                      min={1}
                      value={timeMax}
                      onChange={(e) => setTimeMax(e.target.value)}
                      placeholder="Max"
                      className={inputClass + " flex-1"}
                    />
                    <span className="text-sm text-text-tertiary shrink-0">hours</span>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Max Participants</label>
                  <input
                    type="number"
                    min={1}
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(parseInt(e.target.value) || 1)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Overview *</label>
                <textarea
                  value={overview}
                  onChange={(e) => setOverview(e.target.value)}
                  rows={5}
                  placeholder="Describe the project in detail — what the participant will build, the scope, and expected deliverables..."
                  className={inputClass + " resize-none"}
                />
              </div>
              <div>
                <label className={labelClass}>Additional Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Any extra context (optional)"
                  className={inputClass + " resize-none"}
                />
              </div>
              <div>
                <label className={labelClass}>Skill Tags *</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {skillTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
                    >
                      {tag}
                      <button onClick={() => setSkillTags((prev) => prev.filter((t) => t !== tag))}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                    placeholder="Add a skill (e.g. React)"
                    className={inputClass}
                  />
                  <button
                    onClick={addSkill}
                    disabled={!newSkill.trim()}
                    className="shrink-0 rounded-lg bg-surface-3 px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary disabled:opacity-40"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <div>
                <label className={labelClass}>What You&apos;ll Learn *</label>
                {learningOutcomes.map((outcome, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input
                      value={outcome}
                      onChange={(e) => updateListItem(setLearningOutcomes, i, e.target.value)}
                      placeholder={`Learning outcome ${i + 1}`}
                      className={inputClass}
                    />
                    {learningOutcomes.length > 1 && (
                      <button
                        onClick={() => removeListItem(setLearningOutcomes, i)}
                        className="shrink-0 text-text-disabled hover:text-error"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addListItem(setLearningOutcomes)}
                  className="text-xs text-accent hover:underline"
                >
                  + Add outcome
                </button>
              </div>
              <div>
                <label className={labelClass}>Prerequisites</label>
                {prerequisites.map((prereq, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input
                      value={prereq}
                      onChange={(e) => updateListItem(setPrerequisites, i, e.target.value)}
                      placeholder={`Prerequisite ${i + 1}`}
                      className={inputClass}
                    />
                    {prerequisites.length > 1 && (
                      <button
                        onClick={() => removeListItem(setPrerequisites, i)}
                        className="shrink-0 text-text-disabled hover:text-error"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addListItem(setPrerequisites)}
                  className="text-xs text-accent hover:underline"
                >
                  + Add prerequisite
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Milestones */}
          {step === 2 && (
            <div className="space-y-5">
              <p className="type-body text-text-tertiary">
                Define the milestones participants need to complete. Each milestone requires a report submission.
              </p>
              {milestones.map((ms, i) => (
                <div
                  key={ms.id}
                  className="rounded-lg border border-border bg-surface-1 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary">
                      Milestone {i + 1}
                    </span>
                    {milestones.length > 1 && (
                      <button
                        onClick={() => setMilestones((prev) => prev.filter((m) => m.id !== ms.id))}
                        className="text-text-disabled hover:text-error"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <input
                    value={ms.title}
                    onChange={(e) =>
                      setMilestones((prev) =>
                        prev.map((m) => (m.id === ms.id ? { ...m, title: e.target.value } : m))
                      )
                    }
                    placeholder="What should the participant accomplish?"
                    className={inputClass}
                  />
                  <div>
                    <label className={labelClass}>Deadline</label>
                    <input
                      type="date"
                      value={ms.deadline}
                      onChange={(e) =>
                        setMilestones((prev) =>
                          prev.map((m) => (m.id === ms.id ? { ...m, deadline: e.target.value } : m))
                        )
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={addMilestone}
                className="w-full rounded-lg border-2 border-dashed border-border py-3 text-sm font-medium text-text-tertiary hover:border-accent hover:text-text-primary transition-colors"
              >
                <Plus size={14} className="inline mr-1 -mt-0.5" />
                Add Milestone
              </button>
            </div>
          )}

          {/* Step 4: Application Questions */}
          {step === 3 && (
            <div className="space-y-5">
              <p className="type-body text-text-tertiary">
                Define the questions applicants need to answer when applying to your project.
              </p>
              {questions.map((q, i) => (
                <div
                  key={q.id}
                  className="rounded-lg border border-border bg-surface-1 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary">
                      Question {i + 1}
                    </span>
                    {questions.length > 1 && (
                      <button
                        onClick={() => setQuestions((prev) => prev.filter((qq) => qq.id !== q.id))}
                        className="text-text-disabled hover:text-error"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <input
                    value={q.label}
                    onChange={(e) =>
                      setQuestions((prev) =>
                        prev.map((qq) => (qq.id === q.id ? { ...qq, label: e.target.value } : qq))
                      )
                    }
                    placeholder="e.g. Why are you interested in this project?"
                    className={inputClass}
                  />
                  <div className="flex items-center gap-4">
                    <select
                      value={q.type}
                      onChange={(e) =>
                        setQuestions((prev) =>
                          prev.map((qq) =>
                            qq.id === q.id ? { ...qq, type: e.target.value as "text" | "textarea" } : qq
                          )
                        )
                      }
                      className={inputClass + " w-auto"}
                    >
                      <option value="textarea">Long answer</option>
                      <option value="text">Short answer</option>
                    </select>
                    <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                      <input
                        type="checkbox"
                        checked={q.required}
                        onChange={(e) =>
                          setQuestions((prev) =>
                            prev.map((qq) =>
                              qq.id === q.id ? { ...qq, required: e.target.checked } : qq
                            )
                          )
                        }
                        className="rounded"
                      />
                      Required
                    </label>
                  </div>
                </div>
              ))}
              <button
                onClick={addQuestion}
                className="w-full rounded-lg border-2 border-dashed border-border py-3 text-sm font-medium text-text-tertiary hover:border-accent hover:text-text-primary transition-colors"
              >
                <Plus size={14} className="inline mr-1 -mt-0.5" />
                Add Question
              </button>
            </div>
          )}

          {/* Step 5: Review */}
          {step === 4 && (
            <div className="divide-y divide-[var(--border-base)]">
              <div className="pb-6">
                <h2 className="type-title text-text-primary">{title}</h2>
                <p className="type-body text-text-secondary mt-1">{tagline}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="type-caption rounded-full bg-primary/15 px-2.5 py-1 font-medium text-primary">
                    {difficulty}
                  </span>
                  <span className="type-caption text-text-tertiary">{timeMax ? `${timeMin}-${timeMax} hours` : `${timeMin} hours`}</span>
                  <span className="type-caption text-text-tertiary">{companyName}</span>
                  <span className="type-caption text-text-tertiary">{category}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {skillTags.map((tag) => (
                    <span key={tag} className="type-caption rounded-full bg-accent/10 px-2.5 py-0.5 font-medium text-accent">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="py-6">
                <h3 className="type-subhead text-text-primary mb-2">Overview</h3>
                <p className="type-body text-text-secondary">{overview}</p>
              </div>

              <div className="py-6">
                <h3 className="type-subhead text-text-primary mb-2">
                  Milestones ({milestones.filter((m) => m.title.trim()).length})
                </h3>
                <ul className="space-y-2">
                  {milestones.filter((m) => m.title.trim()).map((m, i) => (
                    <li key={m.id} className="type-body flex items-center gap-2 text-text-secondary">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-3 text-xs font-medium text-text-primary">
                        {i + 1}
                      </span>
                      {m.title}
                      {m.deadline && (
                        <span className="type-caption text-text-tertiary ml-auto">
                          Due {new Date(m.deadline + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="py-6">
                <h3 className="type-subhead text-text-primary mb-2">
                  Application Questions ({questions.filter((q) => q.label.trim()).length})
                </h3>
                <ul className="space-y-2">
                  {questions.filter((q) => q.label.trim()).map((q, i) => (
                    <li key={q.id} className="type-body text-text-secondary">
                      {i + 1}. {q.label}
                      {q.required && <span className="text-primary ml-1">*</span>}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--border-base)]">
            {step > 0 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                <ArrowLeft size={16} />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < steps.length - 1 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="flex items-center gap-1 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-1 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50 transition-colors"
              >
                {submitting ? "Publishing..." : "Publish Project"}
              </button>
            )}
          </div>
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px shrink-0 bg-border self-stretch" />

          {/* Right: Step Image + Encouragement */}
          <div className="hidden lg:flex w-[380px] shrink-0 sticky top-28 self-start flex-col items-center justify-center p-8 h-[calc(100vh-10rem)]">
            <img
              key={step}
              src={stepImages[step]}
              alt={`Step ${step + 1}`}
              className="max-w-full object-contain animate-fade-in transition-all duration-500"
              style={{ maxHeight: `${30 + step * 10}%` }}
            />
            <p key={`phrase-${step}`} className="mt-6 text-center type-subhead text-text-secondary animate-fade-in">
              {[
                "Every great opportunity starts with a single idea.",
                "The details you add will help the right people find your project.",
                "Clear milestones turn ambition into action.",
                "Great questions attract great applicants.",
                "You're about to create a real opportunity for someone. Hit publish!",
              ][step]}
            </p>
            <p key={`sub-${step}`} className="mt-2 text-center type-caption text-text-tertiary animate-fade-in">
              {[
                "You're laying the foundation for someone's next breakthrough.",
                "Every skill tag and description brings you closer to the perfect match.",
                "You're building a roadmap that will guide someone to success.",
                "The right questions reveal the most passionate candidates.",
                "Someone out there is waiting for exactly this project.",
              ][step]}
            </p>
          </div>
        </div>
      </main>
  );
}
