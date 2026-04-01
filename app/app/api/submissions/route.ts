import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { supabase } from "@/app/lib/db";
import crypto from "crypto";

// GET: get submissions
export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");
  const mine = searchParams.get("mine");

  if (projectId) {
    // Creator viewing all submissions for their project
    const { data: project } = await supabase
      .from("projects")
      .select("creator_id")
      .eq("id", projectId)
      .single();

    if (!project || project.creator_id !== session.user.id) {
      // Maybe the user is checking their own submission
      const { data: own } = await supabase
        .from("project_submissions")
        .select("*")
        .eq("project_id", projectId)
        .eq("user_id", session.user.id)
        .single();

      if (own) {
        return NextResponse.json([own]);
      }
      return NextResponse.json([]);
    }

    // Creator: get all submissions with user info
    const { data, error } = await supabase
      .from("project_submissions")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: "Failed to load" }, { status: 500 });
    }

    // Fetch user details
    const userIds = (data || []).map((s) => s.user_id);
    const { data: users } = await supabase
      .from("users")
      .select("id, name, email, title")
      .in("id", userIds);

    const usersMap: Record<string, { name: string; email: string; title: string | null }> = {};
    (users || []).forEach((u) => { usersMap[u.id] = u; });

    const enriched = (data || []).map((s) => ({
      ...s,
      user: usersMap[s.user_id] || null,
    }));

    return NextResponse.json(enriched);
  }

  if (mine === "true") {
    // Get all my submissions across projects
    const { data, error } = await supabase
      .from("project_submissions")
      .select("*")
      .eq("user_id", session.user.id);

    if (error) {
      return NextResponse.json({ error: "Failed to load" }, { status: 500 });
    }

    return NextResponse.json(data || []);
  }

  return NextResponse.json({ error: "Missing params" }, { status: 400 });
}

// POST: submit final project
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId, deliverables } = await request.json();

  if (!projectId) {
    return NextResponse.json({ error: "projectId is required" }, { status: 400 });
  }

  const id = crypto.randomUUID();

  const { error } = await supabase.from("project_submissions").upsert(
    {
      id,
      project_id: projectId,
      user_id: session.user.id,
      deliverables: deliverables || [],
      status: "pending",
      feedback: null,
    },
    { onConflict: "project_id,user_id" }
  );

  if (error) {
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }

  return NextResponse.json({ message: "Submitted" }, { status: 201 });
}

// PUT: creator reviews a submission
export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { submissionId, status, feedback } = await request.json();

  if (!submissionId || !["approved", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid params" }, { status: 400 });
  }

  // Get submission to find project
  const { data: submission } = await supabase
    .from("project_submissions")
    .select("project_id")
    .eq("id", submissionId)
    .single();

  if (!submission) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Verify creator
  const { data: project } = await supabase
    .from("projects")
    .select("creator_id")
    .eq("id", submission.project_id)
    .single();

  if (!project || project.creator_id !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error } = await supabase
    .from("project_submissions")
    .update({ status, feedback: feedback || null, updated_at: new Date().toISOString() })
    .eq("id", submissionId);

  if (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }

  return NextResponse.json({ message: "Review saved" });
}
