import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/db";
import { projects } from "@/app/lib/mock-data";

// GET: seed the database with mock projects (only if empty)
export async function GET() {
  const { data: existing } = await supabase
    .from("projects")
    .select("id")
    .limit(1);

  if (existing && existing.length > 0) {
    return NextResponse.json({ message: "Database already has projects, skipping seed" });
  }

  // We need a creator_id — use a dummy system user or the first user
  const { data: users } = await supabase
    .from("users")
    .select("id")
    .limit(1);

  const creatorId = users?.[0]?.id || "system";

  const rows = projects.map((p) => ({
    id: p.id,
    creator_id: creatorId,
    title: p.title,
    tagline: p.tagline,
    description: p.description,
    image_url: p.imageUrl || null,
    company_name: p.companyName,
    company_domain: p.logoUrl
      ? new URL(p.logoUrl).searchParams.get("domain")
      : null,
    category: p.category,
    skill_tags: p.skillTags,
    difficulty: p.difficulty,
    time_commitment: p.timeCommitment,
    overview: p.details.overview,
    learning_outcomes: p.details.learningOutcomes,
    prerequisites: p.details.prerequisites,
    application_questions: p.applicationQuestions,
    milestones: p.details.learningOutcomes.map((outcome, i) => {
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 7 * (i + 1));
      return { title: outcome, deadline: deadline.toISOString().split("T")[0] };
    }),
    max_participants: 4,
  }));

  const { error } = await supabase.from("projects").insert(rows);

  if (error) {
    return NextResponse.json({ error: "Failed to seed", details: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: `Seeded ${rows.length} projects` });
}
