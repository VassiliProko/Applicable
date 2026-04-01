import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { supabase } from "@/app/lib/db";
import crypto from "crypto";

// GET: get applications (for applicant or project creator)
export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");
  const mine = searchParams.get("mine");

  if (projectId) {
    // Creator viewing applications for their project
    // Verify they own the project
    const { data: project } = await supabase
      .from("projects")
      .select("creator_id")
      .eq("id", projectId)
      .single();

    if (!project || project.creator_id !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: "Failed to load" }, { status: 500 });
    }

    // Fetch user details for each applicant
    const userIds = (data || []).map((a) => a.user_id);
    const { data: users } = await supabase
      .from("users")
      .select("id, name, email, title, bio, skills")
      .in("id", userIds);

    const usersMap: Record<string, typeof users extends (infer T)[] | null ? T : never> = {};
    (users || []).forEach((u) => { usersMap[u.id] = u; });

    const enriched = (data || []).map((a) => ({
      ...a,
      user: usersMap[a.user_id] || null,
    }));

    return NextResponse.json(enriched);
  }

  if (mine === "true") {
    // Applicant viewing their own applications
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: "Failed to load" }, { status: 500 });
    }

    return NextResponse.json(data || []);
  }

  return NextResponse.json({ error: "Missing query params" }, { status: 400 });
}

// POST: submit an application
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId, answers } = await request.json();

  if (!projectId) {
    return NextResponse.json({ error: "projectId is required" }, { status: 400 });
  }

  // Check if already applied
  const { data: existing } = await supabase
    .from("applications")
    .select("id")
    .eq("project_id", projectId)
    .eq("user_id", session.user.id)
    .single();

  if (existing) {
    return NextResponse.json({ error: "Already applied" }, { status: 409 });
  }

  const id = crypto.randomUUID();

  const { error } = await supabase.from("applications").insert({
    id,
    project_id: projectId,
    user_id: session.user.id,
    answers: answers || [],
    status: "pending",
  });

  if (error) {
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }

  return NextResponse.json({ id, message: "Application submitted" }, { status: 201 });
}

// PUT: update application status (accept/reject) — creator only
export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { applicationId, status } = await request.json();

  if (!applicationId || !["accepted", "rejected", "pending"].includes(status)) {
    return NextResponse.json({ error: "Invalid params" }, { status: 400 });
  }

  // Get the application and verify the caller owns the project
  const { data: app } = await supabase
    .from("applications")
    .select("project_id")
    .eq("id", applicationId)
    .single();

  if (!app) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  const { data: project } = await supabase
    .from("projects")
    .select("creator_id")
    .eq("id", app.project_id)
    .single();

  if (!project || project.creator_id !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error } = await supabase
    .from("applications")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", applicationId);

  if (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }

  return NextResponse.json({ message: "Status updated" });
}
