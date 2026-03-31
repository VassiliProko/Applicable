import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { supabase } from "@/app/lib/db";
import crypto from "crypto";

// GET: load all reports for a project
export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");

  if (!projectId) {
    return NextResponse.json(
      { error: "projectId is required" },
      { status: 400 }
    );
  }

  const { data: reports, error } = await supabase
    .from("milestone_reports")
    .select("id, milestone_id, summary, details, files, link, created_at")
    .eq("user_id", session.user.id)
    .eq("project_id", projectId);

  if (error) {
    return NextResponse.json({ error: "Failed to load reports" }, { status: 500 });
  }

  return NextResponse.json(reports || []);
}

// POST: save a milestone report
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId, milestoneId, summary, details, files, link } =
    await request.json();

  if (!projectId || !milestoneId || !summary) {
    return NextResponse.json(
      { error: "projectId, milestoneId, and summary are required" },
      { status: 400 }
    );
  }

  const id = crypto.randomUUID();

  const { error } = await supabase.from("milestone_reports").upsert(
    {
      id,
      user_id: session.user.id,
      project_id: projectId,
      milestone_id: milestoneId,
      summary,
      details: details || "",
      files: files || [],
      link: link || null,
    },
    { onConflict: "user_id,project_id,milestone_id" }
  );

  if (error) {
    return NextResponse.json({ error: "Failed to save report" }, { status: 500 });
  }

  return NextResponse.json({ message: "Report saved" }, { status: 201 });
}
