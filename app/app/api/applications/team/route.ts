import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { supabase } from "@/app/lib/db";

// GET: get accepted team members for a project
export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");

  if (!projectId) {
    return NextResponse.json({ error: "projectId is required" }, { status: 400 });
  }

  // Get accepted applications for this project
  const { data: apps, error } = await supabase
    .from("applications")
    .select("user_id")
    .eq("project_id", projectId)
    .eq("status", "accepted");

  if (error) {
    return NextResponse.json({ error: "Failed to load team" }, { status: 500 });
  }

  const userIds = (apps || []).map((a) => a.user_id);

  if (userIds.length === 0) {
    return NextResponse.json([]);
  }

  // Fetch user details
  const { data: users } = await supabase
    .from("users")
    .select("id, name, email, title, bio, location, skills")
    .in("id", userIds);

  const team = (users || []).map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.title || "",
    location: u.location || "",
    bio: u.bio || "",
    skills: u.skills ? u.skills.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
    avatarSeed: u.name.split(" ").map((n: string) => n[0]).join(""),
  }));

  return NextResponse.json(team);
}
