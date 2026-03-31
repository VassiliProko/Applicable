"use client";

import { useState, useEffect } from "react";
import { Project } from "@/app/lib/types";
import { useTheme } from "./ThemeProvider";
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
  GripVertical,
  Type,
  AlignLeft,
  ListChecks,
  Trash2 as TrashIcon,
  ChevronUp,
  ChevronDown,
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
  const { theme } = useTheme();
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

    // Check if case study is already posted, and load intro/links
    fetch(`/api/case-studies`)
      .then((res) => res.json())
      .then((studies: { project_id: string; introduction?: string; sections?: { type?: string; customId?: string; milestoneId?: string; blocks?: { id: string; type: string; content: string; reportId?: string }[] }[]; links?: { title: string; url: string }[]; team?: { name: string; role: string; email: string; avatarSeed: string }[] }[]) => {
        if (!Array.isArray(studies)) return;
        const existing = studies.find((s) => s.project_id === project.id);
        if (existing) {
          setCaseStudyPosted(true);
          if (existing.introduction) setCaseStudyIntro(existing.introduction);
          if (existing.links && existing.links.length > 0) setCaseStudyLinks(existing.links);
          if (existing.team && existing.team.length > 0) {
            const roles: Record<string, string> = {};
            existing.team.forEach((t) => {
              const match = teamMembers.find((m) => m.name === t.name);
              if (match) roles[match.id] = t.role;
            });
            setCaseStudyTeamRoles((prev) => ({ ...prev, ...roles }));
          }
          // Restore custom sections and section order
          if (existing.sections && existing.sections.length > 0) {
            const restoredCustom: CustomSection[] = [];
            const restoredOrder: string[] = [];

            existing.sections.forEach((s) => {
              if (s.type === "custom" && s.customId && s.blocks) {
                restoredCustom.push({
                  id: s.customId,
                  blocks: s.blocks.map((b) => ({
                    id: b.id || `block-${Date.now()}-${Math.random()}`,
                    type: b.type as CaseStudyBlock["type"],
                    content: b.content,
                    reportId: b.reportId,
                  })),
                  saved: true,
                });
                restoredOrder.push(s.customId);
              } else if (s.milestoneId) {
                restoredOrder.push(s.milestoneId);
              }
            });

            if (restoredCustom.length > 0) setCustomSections(restoredCustom);
            if (restoredOrder.length > 0) setSectionOrder(restoredOrder);
          }
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
  const [caseStudyIntro, setCaseStudyIntro] = useState("");
  const [editingIntro, setEditingIntro] = useState(false);
  const [caseStudyLinks, setCaseStudyLinks] = useState<{ title: string; url: string }[]>([]);
  const [caseStudyTeamRoles, setCaseStudyTeamRoles] = useState<Record<string, string>>(
    () => {
      const initial: Record<string, string> = {};
      teamMembers.forEach((m) => { initial[m.id] = m.role; });
      return initial;
    }
  );
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");

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

  const completedSections = milestones.filter((m) => m.done && m.report);
  const [sectionOrder, setSectionOrder] = useState<string[]>([]);
  const [draggedSection, setDraggedSection] = useState<string | null>(null);
  const [dragOverSection, setDragOverSection] = useState<string | null>(null);

  // Custom sections
  interface CaseStudyBlock {
    id: string;
    type: "report" | "title" | "text" | "image";
    content: string;
    reportId?: string;
  }

  interface CustomSection {
    id: string;
    blocks: CaseStudyBlock[];
    saved: boolean;
  }

  const [customSections, setCustomSections] = useState<CustomSection[]>([]);
  const [editingCustom, setEditingCustom] = useState<string | null>(null);
  const [uploadingBlock, setUploadingBlock] = useState(false);
  const [showReportPicker, setShowReportPicker] = useState<string | null>(null);
  const [draggedBlock, setDraggedBlock] = useState<{ sectionId: string; blockId: string } | null>(null);
  const [dragOverBlock, setDragOverBlock] = useState<string | null>(null);
  const [showAddPicker, setShowAddPicker] = useState(false);

  // Unified section list: milestone sections + custom sections, ordered
  type UnifiedSection =
    | { kind: "milestone"; id: string; milestone: Milestone }
    | { kind: "custom"; id: string; section: CustomSection };

  const allSections: UnifiedSection[] = (() => {
    const milestoneSections: UnifiedSection[] = completedSections.map((m) => ({
      kind: "milestone" as const,
      id: m.id,
      milestone: m,
    }));
    const customs: UnifiedSection[] = customSections
      .filter((s) => s.saved)
      .map((s) => ({
        kind: "custom" as const,
        id: s.id,
        section: s,
      }));
    const all = [...milestoneSections, ...customs];

    if (sectionOrder.length === 0) return all;

    const ordered: UnifiedSection[] = [];
    for (const id of sectionOrder) {
      const found = all.find((s) => s.id === id);
      if (found) ordered.push(found);
    }
    for (const s of all) {
      if (!sectionOrder.includes(s.id)) ordered.push(s);
    }
    return ordered;
  })();

  // Keep caseStudySections for backward compat in publishCaseStudy
  const caseStudySections = allSections
    .filter((s): s is UnifiedSection & { kind: "milestone" } => s.kind === "milestone")
    .map((s) => s.milestone);

  function addCustomSection() {
    const id = `custom-${Date.now()}`;
    setCustomSections((prev) => [
      ...prev,
      { id, blocks: [], saved: false },
    ]);
    setEditingCustom(id);
    setShowAddPicker(false);
  }

  function addReportAsSection(milestone: Milestone) {
    const id = `custom-${Date.now()}`;
    const blocks: CaseStudyBlock[] = [];
    blocks.push({ id: newBlockId(), type: "title", content: milestone.text });
    if (milestone.report?.summary) {
      blocks.push({ id: newBlockId(), type: "text", content: milestone.report.summary });
    }
    if (milestone.report?.details) {
      blocks.push({ id: newBlockId(), type: "text", content: milestone.report.details });
    }
    if (milestone.report?.files) {
      milestone.report.files.forEach((f) => {
        if (f.type === "image") {
          blocks.push({ id: newBlockId(), type: "image", content: f.url });
        }
      });
    }
    setCustomSections((prev) => [
      ...prev,
      { id, blocks, saved: true },
    ]);
    setShowAddPicker(false);
    if (caseStudyPosted) setCaseStudyDirty(true);
  }

  let blockCounter = 0;
  function newBlockId() {
    blockCounter++;
    return `block-${Date.now()}-${blockCounter}-${Math.random().toString(36).slice(2, 6)}`;
  }

  function addBlock(sectionId: string, type: CaseStudyBlock["type"], content = "", reportId?: string) {
    setCustomSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              blocks: [
                ...s.blocks,
                { id: newBlockId(), type, content, reportId },
              ],
            }
          : s
      )
    );
  }

  function addBlocks(sectionId: string, blocks: Omit<CaseStudyBlock, "id">[]) {
    setCustomSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              blocks: [
                ...s.blocks,
                ...blocks.map((b) => ({ ...b, id: newBlockId() })),
              ],
            }
          : s
      )
    );
  }

  function updateBlock(sectionId: string, blockId: string, content: string) {
    setCustomSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              blocks: s.blocks.map((b) =>
                b.id === blockId ? { ...b, content } : b
              ),
            }
          : s
      )
    );
  }

  function removeBlock(sectionId: string, blockId: string) {
    setCustomSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, blocks: s.blocks.filter((b) => b.id !== blockId) }
          : s
      )
    );
  }

  function moveBlock(sectionId: string, blockId: string, direction: "up" | "down") {
    setCustomSections((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s;
        const idx = s.blocks.findIndex((b) => b.id === blockId);
        if (idx < 0) return s;
        const targetIdx = direction === "up" ? idx - 1 : idx + 1;
        if (targetIdx < 0 || targetIdx >= s.blocks.length) return s;
        const newBlocks = [...s.blocks];
        [newBlocks[idx], newBlocks[targetIdx]] = [newBlocks[targetIdx], newBlocks[idx]];
        return { ...s, blocks: newBlocks };
      })
    );
  }

  function handleBlockDrop(sectionId: string, targetBlockId: string) {
    if (!draggedBlock || draggedBlock.sectionId !== sectionId || draggedBlock.blockId === targetBlockId) {
      setDraggedBlock(null);
      setDragOverBlock(null);
      return;
    }
    setCustomSections((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s;
        const fromIdx = s.blocks.findIndex((b) => b.id === draggedBlock.blockId);
        const toIdx = s.blocks.findIndex((b) => b.id === targetBlockId);
        if (fromIdx < 0 || toIdx < 0) return s;
        const newBlocks = [...s.blocks];
        const [moved] = newBlocks.splice(fromIdx, 1);
        newBlocks.splice(toIdx, 0, moved);
        return { ...s, blocks: newBlocks };
      })
    );
    setDraggedBlock(null);
    setDragOverBlock(null);
  }

  function saveCustomSection(sectionId: string) {
    setCustomSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, saved: true } : s))
    );
    setEditingCustom(null);
    if (caseStudyPosted) setCaseStudyDirty(true);
  }

  function deleteCustomSection(sectionId: string) {
    setCustomSections((prev) => prev.filter((s) => s.id !== sectionId));
    setSectionOrder((prev) => prev.filter((id) => id !== sectionId));
    setEditingCustom(null);
    if (caseStudyPosted) setCaseStudyDirty(true);
  }

  async function handleBlockImageUpload(sectionId: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBlock(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (res.ok) {
      const data = await res.json();
      addBlock(sectionId, "image", data.url);
    }
    setUploadingBlock(false);
    e.target.value = "";
  }

  function handleDragStart(id: string) {
    setDraggedSection(id);
  }

  function handleDragOver(e: React.DragEvent, id: string) {
    e.preventDefault();
    if (id !== draggedSection) setDragOverSection(id);
  }

  function handleDragLeave() {
    setDragOverSection(null);
  }

  function handleDrop(targetId: string) {
    if (!draggedSection || draggedSection === targetId) {
      setDraggedSection(null);
      setDragOverSection(null);
      return;
    }

    const currentOrder = allSections.map((s) => s.id);
    const fromIndex = currentOrder.indexOf(draggedSection);
    const toIndex = currentOrder.indexOf(targetId);

    const newOrder = [...currentOrder];
    newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, draggedSection);

    setSectionOrder(newOrder);
    setDraggedSection(null);
    setDragOverSection(null);
    if (caseStudyPosted) setCaseStudyDirty(true);
  }

  function handleDragEnd() {
    setDraggedSection(null);
    setDragOverSection(null);
  }
  const [publishingCaseStudy, setPublishingCaseStudy] = useState(false);

  async function publishCaseStudy() {
    if (allSections.length === 0) return;
    setPublishingCaseStudy(true);

    const sections = allSections.map((s) => {
      if (s.kind === "milestone") {
        const section = getCaseStudySection(s.milestone);
        return {
          type: "milestone" as const,
          milestoneId: s.milestone.id,
          title: s.milestone.text,
          summary: section.summary,
          details: section.details,
          files: s.milestone.report?.files || [],
        };
      } else {
        return {
          type: "custom" as const,
          customId: s.section.id,
          title: "",
          summary: "",
          details: "",
          files: [] as { name: string; type: string; url: string }[],
          blocks: s.section.blocks,
        };
      }
    });

    const res = await fetch("/api/case-studies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: project.id,
        projectTitle: project.title,
        companyName: project.companyName,
        introduction: caseStudyIntro,
        sections,
        links: caseStudyLinks,
        team: teamMembers.map((m) => ({
          name: m.name,
          role: caseStudyTeamRoles[m.id] || m.role,
          email: m.email,
          avatarSeed: m.avatarSeed,
        })),
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

          <div className="flex items-center gap-4">
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

            <div>
              <h1 className="type-headline text-text-primary">
                {project.title}
              </h1>
              <p className="type-body text-text-secondary mt-1">
                {project.companyName}
              </p>
            </div>
          </div>

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
            <div className="flex flex-wrap gap-1.5">
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

          {/* Milestone Progress Bar */}
          <div className="mt-6 py-5">
            <p className="type-subhead text-text-secondary mb-4">
              Progress <span className="text-text-primary">{progressPercent}%</span>
            </p>

            {/* Icons row */}
            <div className="flex mb-2">
              {milestones.map((m) => (
                <div key={m.id} className="flex-1 flex justify-end">
                  <img
                    src={m.done ? "/icons/Completed icon.png" : theme === "light" ? "/icons/Incomplete icon_dark.png" : "/icons/Incomplete icon.png"}
                    alt={m.done ? "Completed" : "Incomplete"}
                    className="w-7 h-7 object-contain"
                  />
                </div>
              ))}
            </div>

            {/* Bar track */}
            <div className="h-2 rounded-full bg-surface-3">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{
                  width: completedMilestones === 0
                    ? "0%"
                    : `${(completedMilestones / milestones.length) * 100}%`,
                }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Sidebar Tabs + Content */}
      <div className="mx-auto max-w-7xl px-6 mt-8 flex gap-0">
        {/* Sidebar Tabs */}
        <nav className="hidden md:flex flex-col gap-1 p-1 w-48 shrink-0 self-start sticky top-24 mr-8 pr-8 border-r border-[var(--border-base)] min-h-[calc(100vh-200px)]">
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
          <div className="max-w-3xl divide-y divide-[var(--border-base)]">
            <div className="pb-8">
              <h2 className="type-title text-text-primary">Overview</h2>
              <p className="type-body mt-3 text-text-secondary">
                {project.details.overview}
              </p>
            </div>

            <div className="py-8">
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

            <div className="py-8">
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
              <div className="pt-8">
                <div className="rounded-xl border border-border bg-surface-1 p-6">
                  <p className="type-body text-text-secondary italic">
                    &ldquo;{project.tagline}&rdquo;
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Milestones & Tasks Tab */}
        {activeTab === "Milestones & Tasks" && (
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Milestones */}
            <div className="lg:border-r lg:border-[var(--border-base)] lg:pr-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="type-title text-text-primary">Milestones</h2>
                <span className="type-caption text-text-tertiary">
                  {completedMilestones}/{milestones.length} completed
                </span>
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
                        <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-success" />
                      ) : overdue ? (
                        <AlertTriangle size={20} className="mt-0.5 shrink-0 text-error" />
                      ) : (
                        <Circle size={20} className="mt-0.5 shrink-0 text-text-disabled" />
                      )}
                      <div className="flex-1">
                        <span
                          className={`type-body ${
                            milestone.done ? "text-text-tertiary line-through" : "text-text-primary"
                          }`}
                        >
                          {milestone.text}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          {milestone.done && milestone.report ? (
                            <button
                              onClick={() => setViewingReport({ milestone, report: milestone.report! })}
                              className="type-caption text-accent hover:underline text-left"
                            >
                              View Report
                            </button>
                          ) : (
                            <span
                              className={`type-caption inline-flex items-center gap-1 ${
                                overdue ? "text-error" : dueSoon ? "text-warning" : "text-text-tertiary"
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
            </div>

            {/* Tasks */}
            <div>
              <h2 className="type-title text-text-primary mb-4">Tasks</h2>

              <ul className="space-y-2">
                {tasks.map((task) => {
                  const taskOverdue = !task.done && isOverdue(task.deadline);
                  const taskDueSoon = !task.done && !taskOverdue && isDueSoon(task.deadline);

                  return (
                    <li key={task.id} className="flex items-center gap-3 group">
                      <button onClick={() => toggleTask(task.id)} className="shrink-0">
                        {task.done ? (
                          <CheckCircle2 size={18} className="text-success" />
                        ) : taskOverdue ? (
                          <AlertTriangle size={18} className="text-error" />
                        ) : (
                          <Circle size={18} className="text-text-disabled group-hover:text-text-secondary transition-colors" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <span className={`type-body ${task.done ? "text-text-tertiary line-through" : "text-text-primary"}`}>
                          {task.text}
                        </span>
                      </div>
                      <span
                        className={`shrink-0 type-caption inline-flex items-center gap-1 ${
                          task.done ? "text-text-disabled" : taskOverdue ? "text-error" : taskDueSoon ? "text-warning" : "text-text-tertiary"
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
            </div>
          </div>
        )}

        {/* Submission Tab */}
        {activeTab === "Submission" && (
          <div className="max-w-3xl divide-y divide-[var(--border-base)]">
            {/* Deliverables */}
            <div className="pb-8">
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
                      <LinkIcon size={16} className="shrink-0 text-accent" />
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
            </div>

            {/* Final Submission */}
            <div className="py-8">
              <h2 className="type-title text-text-primary mb-2">
                Final Submission
              </h2>
              <p className="type-body text-text-tertiary mb-5">
                Once you&apos;ve completed all milestones and added your
                deliverables, submit your project for review.
              </p>

              <div className="flex items-center justify-between mb-5">
                <span className="type-body text-text-secondary">
                  Milestones completed
                </span>
                <span className="type-body font-medium text-text-primary">
                  {completedMilestones}/{milestones.length}
                </span>
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
            </div>
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
                  {allSections.length === 0
                    ? "Complete milestones or add sections to build your case study."
                    : `${allSections.length} section${allSections.length !== 1 ? "s" : ""}`}
                </p>
              </div>
              {allSections.length > 0 && (
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

            {/* Introduction */}
            <section className="rounded-xl border border-border bg-surface-1 p-6 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="type-subhead text-text-primary">Introduction</h3>
                {!editingIntro && (
                  <button
                    onClick={() => setEditingIntro(true)}
                    className="flex items-center gap-1 text-xs text-text-tertiary hover:text-text-primary transition-colors"
                  >
                    <Pencil size={12} />
                    Edit
                  </button>
                )}
              </div>
              {editingIntro ? (
                <div className="space-y-3">
                  <textarea
                    value={caseStudyIntro}
                    onChange={(e) => setCaseStudyIntro(e.target.value)}
                    rows={5}
                    placeholder="Introduce your project — what problem were you solving, what was your role, and what was the goal?"
                    className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 text-text-primary placeholder:text-text-disabled focus:border-accent focus:outline-none resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingIntro(false);
                        if (caseStudyPosted) setCaseStudyDirty(true);
                      }}
                      className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
                    >
                      <Check size={14} />
                      Save
                    </button>
                    <button
                      onClick={() => setEditingIntro(false)}
                      className="rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-3 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : caseStudyIntro ? (
                <p className="type-body text-text-secondary whitespace-pre-wrap">
                  {caseStudyIntro}
                </p>
              ) : (
                <p className="type-body text-text-tertiary italic">
                  No introduction yet. Click Edit to write one.
                </p>
              )}
            </section>

            {/* Case Study Sections */}
            <div className="space-y-6">
              {allSections.map((unified, i) => {
                if (unified.kind === "milestone") {
                  const milestone = unified.milestone;
                  const section = getCaseStudySection(milestone);
                  const isEditing = editingSection === milestone.id;

                  return (
                    <section
                      key={milestone.id}
                      draggable={!isEditing}
                      onDragStart={() => handleDragStart(milestone.id)}
                      onDragOver={(e) => handleDragOver(e, milestone.id)}
                      onDragLeave={handleDragLeave}
                      onDrop={() => handleDrop(milestone.id)}
                      onDragEnd={handleDragEnd}
                      className={`rounded-xl border bg-surface-1 p-6 transition-all ${
                        draggedSection === milestone.id
                          ? "opacity-50 border-primary"
                          : dragOverSection === milestone.id
                            ? "border-accent border-dashed"
                            : "border-border"
                      } ${!isEditing ? "cursor-grab active:cursor-grabbing" : ""}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <GripVertical size={16} className="shrink-0 text-text-disabled mt-0.5" />
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                            {i + 1}
                          </span>
                          <h3 className="type-subhead text-text-primary">{milestone.text}</h3>
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
                            <label className="type-caption font-medium text-text-secondary">Summary</label>
                            <input
                              value={caseStudyEdits[milestone.id]?.summary || ""}
                              onChange={(e) =>
                                setCaseStudyEdits((prev) => ({ ...prev, [milestone.id]: { ...prev[milestone.id], summary: e.target.value } }))
                              }
                              className="mt-1 w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-text-primary focus:border-accent focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="type-caption font-medium text-text-secondary">Details</label>
                            <textarea
                              value={caseStudyEdits[milestone.id]?.details || ""}
                              onChange={(e) =>
                                setCaseStudyEdits((prev) => ({ ...prev, [milestone.id]: { ...prev[milestone.id], details: e.target.value } }))
                              }
                              rows={6}
                              className="mt-1 w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-text-primary focus:border-accent focus:outline-none resize-none"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => saveSectionEdit(milestone.id)} className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors">
                              <Check size={14} /> Save
                            </button>
                            <button onClick={() => setEditingSection(null)} className="rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-3 transition-colors">
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="type-body font-medium text-text-primary">{section.summary}</p>
                          {section.details && (
                            <p className="type-body mt-2 text-text-secondary whitespace-pre-wrap">{section.details}</p>
                          )}
                          {milestone.report?.files && milestone.report.files.length > 0 && (
                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                              {milestone.report.files.map((file, fi) =>
                                file.type === "image" ? (
                                  <div key={fi} className="rounded-lg overflow-hidden border border-border">
                                    <img src={file.url} alt={file.name} className="w-full object-contain max-h-48" />
                                  </div>
                                ) : file.type === "video" ? (
                                  <div key={fi} className="rounded-lg overflow-hidden border border-border">
                                    <video src={file.url} controls className="w-full max-h-48" />
                                  </div>
                                ) : null
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </section>
                  );
                }

                // Custom section
                const cs = unified.section;
                const isEditingCustomSection = editingCustom === cs.id;

                return (
                  <section
                    key={cs.id}
                    draggable={!isEditingCustomSection}
                    onDragStart={() => handleDragStart(cs.id)}
                    onDragOver={(e) => handleDragOver(e, cs.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={() => handleDrop(cs.id)}
                    onDragEnd={handleDragEnd}
                    className={`rounded-xl border bg-surface-1 p-6 transition-all ${
                      draggedSection === cs.id
                        ? "opacity-50 border-primary"
                        : dragOverSection === cs.id
                          ? "border-accent border-dashed"
                          : "border-border"
                    } ${!isEditingCustomSection ? "cursor-grab active:cursor-grabbing" : ""}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <GripVertical size={16} className="shrink-0 text-text-disabled mt-0.5" />
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                          {i + 1}
                        </span>
                        <span className="type-caption text-text-tertiary">Custom Section</span>
                      </div>
                      <div className="flex gap-2">
                        {!isEditingCustomSection && (
                          <button
                            onClick={() => setEditingCustom(cs.id)}
                            className="flex items-center gap-1 text-xs text-text-tertiary hover:text-text-primary transition-colors"
                          >
                            <Pencil size={12} /> Edit
                          </button>
                        )}
                        <button
                          onClick={() => deleteCustomSection(cs.id)}
                          className="flex items-center gap-1 text-xs text-text-tertiary hover:text-error transition-colors"
                        >
                          <TrashIcon size={12} /> Remove
                        </button>
                      </div>
                    </div>

                    {isEditingCustomSection ? (
                      <div>
                        {/* Toolbar */}
                        <div className="flex items-center gap-1 mb-4 p-1 rounded-lg bg-surface-2 w-fit">
                          <button
                            onClick={() => addBlock(cs.id, "title")}
                            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-3 hover:text-text-primary transition-colors"
                            title="Add title"
                          >
                            <Type size={14} /> Title
                          </button>
                          <button
                            onClick={() => addBlock(cs.id, "text")}
                            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-3 hover:text-text-primary transition-colors"
                            title="Add text"
                          >
                            <AlignLeft size={14} /> Text
                          </button>
                          <label
                            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-3 hover:text-text-primary transition-colors cursor-pointer ${uploadingBlock ? "opacity-50" : ""}`}
                            title="Add image"
                          >
                            <ImageIcon size={14} /> Image
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploadingBlock}
                              onChange={(e) => handleBlockImageUpload(cs.id, e)}
                            />
                          </label>
                        </div>


                        {/* Blocks */}
                        <div className="space-y-3">
                          {cs.blocks.map((block, bi) => (
                            <div
                              key={block.id}
                              onDragOver={(e) => { e.preventDefault(); setDragOverBlock(block.id); }}
                              onDragLeave={() => setDragOverBlock(null)}
                              onDrop={() => handleBlockDrop(cs.id, block.id)}
                              className={`relative group flex gap-2 rounded-lg p-1 transition-all ${
                                draggedBlock?.blockId === block.id ? "opacity-50" : ""
                              } ${dragOverBlock === block.id ? "ring-2 ring-accent ring-dashed" : ""}`}
                            >
                              {/* Left controls */}
                              <div className="flex flex-col items-center gap-0.5 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div
                                  draggable
                                  onDragStart={() => setDraggedBlock({ sectionId: cs.id, blockId: block.id })}
                                  onDragEnd={() => { setDraggedBlock(null); setDragOverBlock(null); }}
                                  className="cursor-grab active:cursor-grabbing p-0.5"
                                >
                                  <GripVertical size={14} className="text-text-disabled" />
                                </div>
                                <button onClick={() => moveBlock(cs.id, block.id, "up")} disabled={bi === 0} className="text-text-disabled hover:text-text-primary disabled:opacity-30 transition-colors">
                                  <ChevronUp size={14} />
                                </button>
                                <button onClick={() => moveBlock(cs.id, block.id, "down")} disabled={bi === cs.blocks.length - 1} className="text-text-disabled hover:text-text-primary disabled:opacity-30 transition-colors">
                                  <ChevronDown size={14} />
                                </button>
                              </div>

                              {/* Block content */}
                              <div className="flex-1 min-w-0">
                                <button
                                  onClick={() => removeBlock(cs.id, block.id)}
                                  className="absolute right-0 top-0 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-error text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X size={10} />
                                </button>
                                {block.type === "title" && (
                                  <input
                                    value={block.content}
                                    onChange={(e) => updateBlock(cs.id, block.id, e.target.value)}
                                    placeholder="Section title..."
                                    className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-lg font-semibold text-text-primary placeholder:text-text-disabled focus:border-accent focus:outline-none"
                                  />
                                )}
                                {block.type === "text" && (
                                  <textarea
                                    value={block.content}
                                    onChange={(e) => updateBlock(cs.id, block.id, e.target.value)}
                                    placeholder="Write your content..."
                                    rows={4}
                                    className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-text-primary placeholder:text-text-disabled focus:border-accent focus:outline-none resize-none"
                                  />
                                )}
                                {block.type === "image" && (
                                  <div className="rounded-lg overflow-hidden border border-border">
                                    <img src={block.content} alt="Uploaded" className="w-full object-contain max-h-64" />
                                  </div>
                                )}
                                {block.type === "report" && (
                                  <div className="rounded-lg border border-accent/30 bg-accent/5 px-4 py-3">
                                    <p className="type-caption font-medium text-accent mb-1">From report:</p>
                                    <p className="type-body text-text-primary">{block.content}</p>
                                    {(() => {
                                      const m = completedSections.find((ms) => ms.id === block.reportId);
                                      return m?.report?.details ? (
                                        <p className="type-body mt-1 text-text-secondary">{m.report.details}</p>
                                      ) : null;
                                    })()}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                          {cs.blocks.length === 0 && (
                            <p className="type-body text-text-tertiary text-center py-6">
                              Use the toolbar above to add content blocks.
                            </p>
                          )}
                        </div>

                        {/* Save button */}
                        <div className="flex justify-end mt-4">
                          <button
                            onClick={() => saveCustomSection(cs.id)}
                            disabled={cs.blocks.length === 0}
                            className="flex items-center gap-1 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-hover transition-colors disabled:opacity-40"
                          >
                            <Check size={14} /> Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Saved view */
                      <div className="space-y-3">
                        {cs.blocks.map((block) => (
                          <div key={block.id}>
                            {block.type === "title" && (
                              <h3 className="type-subhead text-text-primary">{block.content}</h3>
                            )}
                            {block.type === "text" && (
                              <p className="type-body text-text-secondary whitespace-pre-wrap">{block.content}</p>
                            )}
                            {block.type === "image" && (
                              <div className="rounded-lg overflow-hidden border border-border">
                                <img src={block.content} alt="Section image" className="w-full object-contain max-h-64" />
                              </div>
                            )}
                            {block.type === "report" && (
                              <div className="rounded-lg border border-accent/30 bg-accent/5 px-4 py-3">
                                <p className="type-body font-medium text-text-primary">{block.content}</p>
                                {(() => {
                                  const m = completedSections.find((ms) => ms.id === block.reportId);
                                  return m?.report?.details ? (
                                    <p className="type-body mt-1 text-text-secondary">{m.report.details}</p>
                                  ) : null;
                                })()}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                );
              })}

              {/* Unsaved custom sections being edited */}
              {customSections
                .filter((cs) => !cs.saved && editingCustom === cs.id)
                .map((cs) => (
                  <section key={cs.id} className="rounded-xl border border-dashed border-accent bg-surface-1 p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="type-caption font-medium text-accent">New Section</span>
                      <button
                        onClick={() => deleteCustomSection(cs.id)}
                        className="flex items-center gap-1 text-xs text-text-tertiary hover:text-error transition-colors"
                      >
                        <TrashIcon size={12} /> Discard
                      </button>
                    </div>

                    {/* Toolbar */}
                    <div className="flex items-center gap-1 mb-4 p-1 rounded-lg bg-surface-2 w-fit">
                      <button onClick={() => addBlock(cs.id, "title")} className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-3 hover:text-text-primary transition-colors">
                        <Type size={14} /> Title
                      </button>
                      <button onClick={() => addBlock(cs.id, "text")} className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-3 hover:text-text-primary transition-colors">
                        <AlignLeft size={14} /> Text
                      </button>
                      <label className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-3 hover:text-text-primary transition-colors cursor-pointer ${uploadingBlock ? "opacity-50" : ""}`}>
                        <ImageIcon size={14} /> Image
                        <input type="file" accept="image/*" className="hidden" disabled={uploadingBlock} onChange={(e) => handleBlockImageUpload(cs.id, e)} />
                      </label>
                      <button
                        onClick={() => setShowReportPicker(showReportPicker === cs.id ? null : cs.id)}
                        className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-3 hover:text-text-primary transition-colors"
                      >
                        <ListChecks size={14} /> Report
                      </button>
                    </div>

                    {showReportPicker === cs.id && (
                      <div className="mb-4 rounded-lg border border-border bg-surface-2 p-3">
                        <p className="type-caption text-text-tertiary mb-2">Select a report to insert:</p>
                        <div className="space-y-1">
                          {completedSections.map((m) => (
                            <button
                              key={m.id}
                              onClick={() => {
                                addBlock(cs.id, "report", m.report?.summary || "", m.id);
                                setShowReportPicker(null);
                              }}
                              className="w-full text-left rounded-md px-3 py-2 text-sm text-text-primary hover:bg-surface-3 transition-colors"
                            >
                              {m.text}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      {cs.blocks.map((block) => (
                        <div key={block.id} className="relative group">
                          <button
                            onClick={() => removeBlock(cs.id, block.id)}
                            className="absolute -right-2 -top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-error text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={10} />
                          </button>
                          {block.type === "title" && (
                            <input
                              value={block.content}
                              onChange={(e) => updateBlock(cs.id, block.id, e.target.value)}
                              placeholder="Section title..."
                              className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-lg font-semibold text-text-primary placeholder:text-text-disabled focus:border-accent focus:outline-none"
                            />
                          )}
                          {block.type === "text" && (
                            <textarea
                              value={block.content}
                              onChange={(e) => updateBlock(cs.id, block.id, e.target.value)}
                              placeholder="Write your content..."
                              rows={4}
                              className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-text-primary placeholder:text-text-disabled focus:border-accent focus:outline-none resize-none"
                            />
                          )}
                          {block.type === "image" && (
                            <div className="rounded-lg overflow-hidden border border-border">
                              <img src={block.content} alt="Uploaded" className="w-full object-contain max-h-64" />
                            </div>
                          )}
                          {block.type === "report" && (
                            <div className="rounded-lg border border-accent/30 bg-accent/5 px-4 py-3">
                              <p className="type-caption font-medium text-accent mb-1">From report:</p>
                              <p className="type-body text-text-primary">{block.content}</p>
                            </div>
                          )}
                        </div>
                      ))}
                      {cs.blocks.length === 0 && (
                        <p className="type-body text-text-tertiary text-center py-6">
                          Use the toolbar above to add content blocks.
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => saveCustomSection(cs.id)}
                        disabled={cs.blocks.length === 0}
                        className="flex items-center gap-1 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-hover transition-colors disabled:opacity-40"
                      >
                        <Check size={14} /> Save
                      </button>
                    </div>
                  </section>
                ))}

              {/* Add Section Button */}
              <div className="relative">
                <button
                  onClick={() => setShowAddPicker(!showAddPicker)}
                  className="w-full rounded-xl border-2 border-dashed border-border bg-transparent py-4 text-sm font-medium text-text-tertiary hover:border-accent hover:text-text-primary transition-colors"
                >
                  <Plus size={16} className="inline mr-1 -mt-0.5" />
                  Add Section
                </button>

                {showAddPicker && (
                  <div className="mt-2 rounded-xl border border-border bg-surface-1 p-4 shadow-lg">
                    <p className="type-caption font-medium text-text-tertiary mb-3">
                      Choose section type:
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {/* Custom section */}
                      <button
                        onClick={addCustomSection}
                        className="flex items-center gap-3 rounded-lg border border-border bg-surface-2 p-4 text-left hover:bg-surface-3 transition-colors"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                          <AlignLeft size={20} className="text-accent" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-primary">Custom Section</p>
                          <p className="type-caption text-text-tertiary">Build from scratch with titles, text, and images</p>
                        </div>
                      </button>

                      {/* From report */}
                      {completedSections.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => addReportAsSection(m)}
                          className="flex items-center gap-3 rounded-lg border border-border bg-surface-2 p-4 text-left hover:bg-surface-3 transition-colors"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <FileText size={20} className="text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-text-primary truncate">{m.text}</p>
                            <p className="type-caption text-text-tertiary">Import from report</p>
                          </div>
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setShowAddPicker(false)}
                      className="mt-3 w-full text-center type-caption text-text-tertiary hover:text-text-primary transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Links */}
            <section className="rounded-xl border border-border bg-surface-1 p-6 mt-6">
              <h3 className="type-subhead text-text-primary mb-3">
                Project Links
              </h3>
              <p className="type-caption text-text-tertiary mb-4">
                Add relevant links — live demo, repository, design files, documentation, etc.
              </p>

              {caseStudyLinks.length > 0 && (
                <ul className="space-y-2 mb-4">
                  {caseStudyLinks.map((link, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 rounded-lg border border-border bg-surface-2 px-4 py-3"
                    >
                      <LinkIcon size={16} className="shrink-0 text-accent" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {link.title}
                        </p>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-accent hover:underline truncate block"
                        >
                          {link.url}
                        </a>
                      </div>
                      <button
                        onClick={() => {
                          setCaseStudyLinks((prev) => prev.filter((_, idx) => idx !== i));
                          if (caseStudyPosted) setCaseStudyDirty(true);
                        }}
                        className="shrink-0 text-text-disabled hover:text-error transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  value={newLinkTitle}
                  onChange={(e) => setNewLinkTitle(e.target.value)}
                  placeholder="Title (e.g. Live Demo)"
                  className="flex-1 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-primary placeholder:text-text-disabled focus:border-accent focus:outline-none"
                />
                <input
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newLinkTitle.trim() && newLinkUrl.trim()) {
                      setCaseStudyLinks((prev) => [...prev, { title: newLinkTitle.trim(), url: newLinkUrl.trim() }]);
                      setNewLinkTitle("");
                      setNewLinkUrl("");
                      if (caseStudyPosted) setCaseStudyDirty(true);
                    }
                  }}
                  placeholder="URL"
                  className="flex-1 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-primary placeholder:text-text-disabled focus:border-accent focus:outline-none"
                />
                <button
                  onClick={() => {
                    if (!newLinkTitle.trim() || !newLinkUrl.trim()) return;
                    setCaseStudyLinks((prev) => [...prev, { title: newLinkTitle.trim(), url: newLinkUrl.trim() }]);
                    setNewLinkTitle("");
                    setNewLinkUrl("");
                    if (caseStudyPosted) setCaseStudyDirty(true);
                  }}
                  disabled={!newLinkTitle.trim() || !newLinkUrl.trim()}
                  className="flex items-center justify-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors disabled:opacity-40"
                >
                  <Plus size={14} />
                  Add
                </button>
              </div>
            </section>

            {/* Team Roles */}
            <section className="rounded-xl border border-border bg-surface-1 p-6 mt-6">
              <h3 className="type-subhead text-text-primary mb-2">
                Team Members
              </h3>
              <p className="type-caption text-text-tertiary mb-4">
                Set each member&apos;s title as it should appear in the case study.
              </p>

              <ul className="space-y-3">
                {teamMembers.map((member) => (
                  <li key={member.id} className="flex items-center gap-3">
                    <div className="h-9 w-9 shrink-0 rounded-full overflow-hidden bg-surface-2">
                      <img
                        src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(member.avatarSeed)}&backgroundColor=e8432a`}
                        alt={member.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium text-text-primary w-32 shrink-0 truncate">
                      {member.name}
                    </span>
                    <input
                      value={caseStudyTeamRoles[member.id] || ""}
                      onChange={(e) => {
                        setCaseStudyTeamRoles((prev) => ({
                          ...prev,
                          [member.id]: e.target.value,
                        }));
                        if (caseStudyPosted) setCaseStudyDirty(true);
                      }}
                      placeholder="e.g. Frontend Developer"
                      className="flex-1 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-primary placeholder:text-text-disabled focus:border-accent focus:outline-none"
                    />
                  </li>
                ))}
              </ul>
            </section>
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
