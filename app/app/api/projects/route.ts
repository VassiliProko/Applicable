import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { supabase } from "@/app/lib/db";
import crypto from "crypto";

// GET: list all projects (public)
export async function GET() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to load projects" }, { status: 500 });
  }

  // Transform DB rows to match the frontend Project interface
  const projects = (data || []).map((p) => ({
    id: p.id,
    title: p.title,
    tagline: p.tagline,
    description: p.description,
    imageUrl: p.image_url,
    logoUrl: p.company_domain
      ? `https://www.google.com/s2/favicons?domain=${p.company_domain}&sz=128`
      : undefined,
    companyName: p.company_name,
    category: p.category,
    skillTags: p.skill_tags,
    difficulty: p.difficulty,
    timeCommitment: p.time_commitment,
    details: {
      overview: p.overview,
      learningOutcomes: p.learning_outcomes,
      prerequisites: p.prerequisites,
    },
    applicationQuestions: p.application_questions,
    milestones: p.milestones,
    maxParticipants: p.max_participants,
    creatorId: p.creator_id,
  }));

  return NextResponse.json(projects);
}

// POST: create a new project (requires auth)
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const {
    title,
    tagline,
    description,
    imageUrl,
    companyName,
    companyDomain,
    category,
    skillTags,
    difficulty,
    timeCommitment,
    overview,
    learningOutcomes,
    prerequisites,
    applicationQuestions,
    milestones,
    maxParticipants,
  } = body;

  if (!title || !tagline || !companyName || !category || !difficulty || !timeCommitment || !overview) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const id = crypto.randomUUID();

  const { error } = await supabase.from("projects").insert({
    id,
    creator_id: session.user.id,
    title,
    tagline,
    description: description || "",
    image_url: imageUrl || null,
    company_name: companyName,
    company_domain: companyDomain || null,
    category,
    skill_tags: skillTags || [],
    difficulty,
    time_commitment: timeCommitment,
    overview,
    learning_outcomes: learningOutcomes || [],
    prerequisites: prerequisites || [],
    application_questions: applicationQuestions || [],
    milestones: milestones || [],
    max_participants: maxParticipants || 4,
  });

  if (error) {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }

  return NextResponse.json({ id, message: "Project created" }, { status: 201 });
}
