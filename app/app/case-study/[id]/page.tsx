"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, X, Mail } from "lucide-react";

interface CaseStudyBlock {
  type: "report" | "title" | "text" | "image";
  content: string;
}

interface CaseStudySection {
  type?: "milestone" | "custom";
  title: string;
  summary: string;
  details: string;
  files: { name: string; type: string; url: string }[];
  blocks?: CaseStudyBlock[];
}

interface TeamMember {
  name: string;
  role: string;
  email: string;
  avatarSeed: string;
}

interface CaseStudy {
  id: string;
  project_id: string;
  project_title: string;
  company_name: string;
  introduction: string;
  sections: CaseStudySection[];
  links: { title: string; url: string }[];
  team: TeamMember[];
  created_at: string;
}

export default function CaseStudyPage() {
  const params = useParams();
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    fetch(`/api/case-studies?id=${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setCaseStudy(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="type-body text-text-tertiary">Loading case study...</p>
      </div>
    );
  }

  if (error || !caseStudy) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <p className="type-body text-text-tertiary">Case study not found.</p>
        <Link
          href="/profile"
          className="text-sm text-accent hover:underline"
        >
          Back to Profile
        </Link>
      </div>
    );
  }

  return (
      <main className="flex-1 pb-16">
        {/* Header */}
        <div className="border-b border-[var(--border-base)]">
          <div className="mx-auto max-w-3xl px-6 py-8">
            <Link
              href="/profile"
              className="inline-flex items-center gap-1.5 text-sm text-text-tertiary hover:text-text-primary transition-colors mb-6"
            >
              <ArrowLeft size={16} />
              Back to Profile
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white">
                <span className="text-lg font-bold text-black">
                  {caseStudy.company_name.charAt(0)}
                </span>
              </div>
              <span className="type-body font-medium text-text-secondary">
                {caseStudy.company_name}
              </span>
            </div>

            <h1 className="type-display text-text-primary">
              {caseStudy.project_title}
            </h1>

            <p className="type-body mt-3 text-text-tertiary">
              {caseStudy.sections.length} section
              {caseStudy.sections.length !== 1 ? "s" : ""} &middot; Published{" "}
              {new Date(caseStudy.created_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-6 mt-10">
          {/* Introduction */}
          {caseStudy.introduction && (
            <div className="mb-12">
              <h2 className="type-title text-text-primary mb-3">Introduction</h2>
              <p className="type-body text-text-secondary whitespace-pre-wrap">
                {caseStudy.introduction}
              </p>
              <div className="mt-8 border-b border-(--border-divider)" />
            </div>
          )}

          {/* Sections */}
          <div className="space-y-12">
            {caseStudy.sections.map((section, i) => (
              <article key={i}>
                {section.type === "custom" && section.blocks ? (
                  /* Custom block-based section */
                  <div className="space-y-3">
                    {section.blocks.map((block, bi) => (
                      <div key={bi}>
                        {block.type === "title" && (
                          <h2 className="type-title text-text-primary">{block.content}</h2>
                        )}
                        {block.type === "text" && (
                          <p className="type-body text-text-secondary whitespace-pre-wrap">{block.content}</p>
                        )}
                        {block.type === "image" && (
                          <div className="rounded-xl overflow-hidden border border-border">
                            <img src={block.content} alt="Section image" className="w-full object-contain" />
                          </div>
                        )}
                        {block.type === "report" && (
                          <div className="rounded-lg border border-accent/30 bg-accent/5 px-4 py-3">
                            <p className="type-body font-medium text-text-primary">{block.content}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Milestone-based section */
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                        {i + 1}
                      </span>
                      <h2 className="type-title text-text-primary">
                        {section.title}
                      </h2>
                    </div>

                    <p className="type-body font-medium text-text-primary">
                      {section.summary}
                    </p>

                    {section.details && (
                      <p className="type-body mt-3 text-text-secondary whitespace-pre-wrap">
                        {section.details}
                      </p>
                    )}

                    {section.files && section.files.length > 0 && (
                      <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        {section.files.map((file, fi) =>
                          file.type === "image" ? (
                            <div
                              key={fi}
                              className="rounded-xl overflow-hidden border border-border"
                            >
                              <img
                                src={file.url}
                                alt={file.name}
                                className="w-full object-contain"
                              />
                            </div>
                          ) : file.type === "video" ? (
                            <div
                              key={fi}
                              className="rounded-xl overflow-hidden border border-border"
                            >
                              <video src={file.url} controls className="w-full" />
                            </div>
                          ) : null
                    )}
                  </div>
                )}
                </>
                )}

                {/* Divider */}
                {i < caseStudy.sections.length - 1 && (
                  <div className="mt-12 border-b border-(--border-divider)" />
                )}
              </article>
            ))}
          </div>

          {/* Links */}
          {caseStudy.links && caseStudy.links.length > 0 && (
            <div className="mt-12">
              <div className="border-b border-(--border-divider) mb-8" />
              <h2 className="type-title text-text-primary mb-4">Project Links</h2>
              <ul className="space-y-3">
                {caseStudy.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg border border-border bg-surface-1 px-4 py-3 transition-colors hover:bg-surface-2"
                    >
                      <ArrowLeft size={16} className="shrink-0 text-accent rotate-135" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-text-primary">
                          {link.title}
                        </p>
                        <p className="text-xs text-accent truncate">
                          {link.url}
                        </p>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Team */}
          {caseStudy.team && caseStudy.team.length > 0 && (
            <div className="mt-12">
              <div className="border-b border-(--border-divider) mb-8" />
              <h2 className="type-title text-text-primary mb-4">Team</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {caseStudy.team.map((member, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedMember(member)}
                    className="flex items-center gap-4 rounded-xl border border-border bg-surface-1 p-4 text-left transition-all duration-200 hover:border-border-hover hover:bg-surface-2 active:scale-[0.99]"
                  >
                    <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden bg-surface-2">
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
        </div>

        {/* Team Member Modal */}
        {selectedMember && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedMember(null)}
          >
            <div
              className="relative w-[90vw] max-w-sm rounded-2xl bg-surface-1 p-8"
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
                <div className="h-16 w-16 rounded-full overflow-hidden bg-surface-2">
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

                <div className="mt-5 w-full">
                  <a
                    href={`mailto:${selectedMember.email}`}
                    className="flex items-center justify-center gap-2 rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm text-accent hover:bg-surface-3 transition-colors"
                  >
                    <Mail size={16} />
                    {selectedMember.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
  );
}
