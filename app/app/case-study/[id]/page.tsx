"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Image as ImageIcon,
  Video,
} from "lucide-react";

interface CaseStudySection {
  title: string;
  summary: string;
  details: string;
  files: { name: string; type: string; url: string }[];
}

interface CaseStudy {
  id: string;
  project_id: string;
  project_title: string;
  company_name: string;
  sections: CaseStudySection[];
  created_at: string;
}

export default function CaseStudyPage() {
  const params = useParams();
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <p className="type-body text-text-tertiary">Loading case study...</p>
        </div>
      </div>
    );
  }

  if (error || !caseStudy) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <p className="type-body text-text-tertiary">Case study not found.</p>
          <Link
            href="/profile"
            className="text-sm text-accent hover:underline"
          >
            Back to Profile
          </Link>
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

        {/* Sections */}
        <div className="mx-auto max-w-3xl px-6 mt-10">
          <div className="space-y-12">
            {caseStudy.sections.map((section, i) => (
              <article key={i}>
                {/* Section number + title */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <h2 className="type-title text-text-primary">
                    {section.title}
                  </h2>
                </div>

                {/* Summary */}
                <p className="type-body font-medium text-text-primary">
                  {section.summary}
                </p>

                {/* Details */}
                {section.details && (
                  <p className="type-body mt-3 text-text-secondary whitespace-pre-wrap">
                    {section.details}
                  </p>
                )}

                {/* Media */}
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

                {/* Divider */}
                {i < caseStudy.sections.length - 1 && (
                  <div className="mt-12 border-b border-[var(--border-divider)]" />
                )}
              </article>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
