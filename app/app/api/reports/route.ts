import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { supabase } from "@/app/lib/db";
import crypto from "crypto";

// GET: load reports for a project
export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");
  const userId = searchParams.get("userId");

  if (!projectId) {
    return NextResponse.json({ error: "projectId is required" }, { status: 400 });
  }

  // If userId is provided, creator is viewing someone else's reports
  const targetUserId = userId || session.user.id;

  const { data: reports, error } = await supabase
    .from("milestone_reports")
    .select("id, user_id, milestone_id, summary, details, files, link, review_status, feedback, created_at")
    .eq("user_id", targetUserId)
    .eq("project_id", projectId);

  if (error) {
    return NextResponse.json({ error: "Failed to load reports" }, { status: 500 });
  }

  return NextResponse.json(reports || []);
}

// POST: save a milestone report (resets review to pending)
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
      review_status: "pending",
      feedback: null,
    },
    { onConflict: "user_id,project_id,milestone_id" }
  );

  if (error) {
    return NextResponse.json({ error: "Failed to save report" }, { status: 500 });
  }

  return NextResponse.json({ message: "Report saved" }, { status: 201 });
}

// PUT: creator reviews a report (approve/reject with feedback)
export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { reportId, reviewStatus, feedback } = await request.json();

  if (!reportId || !["approved", "rejected"].includes(reviewStatus)) {
    return NextResponse.json({ error: "Invalid params" }, { status: 400 });
  }

  // Get the report to find the project
  const { data: report } = await supabase
    .from("milestone_reports")
    .select("project_id")
    .eq("id", reportId)
    .single();

  if (!report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  // Verify caller is the project creator
  const { data: project } = await supabase
    .from("projects")
    .select("creator_id")
    .eq("id", report.project_id)
    .single();

  if (!project || project.creator_id !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error } = await supabase
    .from("milestone_reports")
    .update({
      review_status: reviewStatus,
      feedback: feedback || null,
    })
    .eq("id", reportId);

  if (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }

  return NextResponse.json({ message: "Review saved" });
}
