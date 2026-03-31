import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { supabase } from "@/app/lib/db";
import crypto from "crypto";

// GET: list all case studies or get a single one
export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const caseStudyId = searchParams.get("id");

  if (caseStudyId) {
    const { data, error } = await supabase
      .from("case_studies")
      .select("id, project_id, project_title, company_name, introduction, sections, links, team, created_at")
      .eq("id", caseStudyId)
      .eq("user_id", session.user.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  }

  const { data, error } = await supabase
    .from("case_studies")
    .select("id, project_id, project_title, company_name, introduction, sections, links, team, created_at")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }

  return NextResponse.json(data || []);
}

// POST: publish a case study
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId, projectTitle, companyName, introduction, sections, links, team } =
    await request.json();

  if (!projectId || !projectTitle || !sections?.length) {
    return NextResponse.json(
      { error: "projectId, projectTitle, and sections are required" },
      { status: 400 }
    );
  }

  const id = crypto.randomUUID();

  const { error } = await supabase.from("case_studies").upsert(
    {
      id,
      user_id: session.user.id,
      project_id: projectId,
      project_title: projectTitle,
      company_name: companyName || "",
      introduction: introduction || "",
      sections,
      links: links || [],
      team: team || [],
    },
    { onConflict: "project_id" }
  );

  if (error) {
    return NextResponse.json({ error: "Failed to publish" }, { status: 500 });
  }

  const { data: row } = await supabase
    .from("case_studies")
    .select("id")
    .eq("user_id", session.user.id)
    .eq("project_id", projectId)
    .single();

  return NextResponse.json(
    { id: row?.id || id, message: "Case study published" },
    { status: 201 }
  );
}
