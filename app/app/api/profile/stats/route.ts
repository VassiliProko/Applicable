import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { supabase } from "@/app/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // Projects completed: approved final submissions
  const { data: completedData } = await supabase
    .from("project_submissions")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "approved");

  const projectsCompleted = completedData?.length || 0;

  // Projects created
  const { data: createdData } = await supabase
    .from("projects")
    .select("id")
    .eq("creator_id", userId);

  const projectsCreated = createdData?.length || 0;

  // Unique companies/users worked with:
  // Get all projects where user has an accepted application
  const { data: acceptedApps } = await supabase
    .from("applications")
    .select("project_id")
    .eq("user_id", userId)
    .eq("status", "accepted");

  let companiesWorkedWith = 0;
  if (acceptedApps && acceptedApps.length > 0) {
    const projectIds = acceptedApps.map((a) => a.project_id);

    // Get distinct creator_ids from those projects
    const { data: projects } = await supabase
      .from("projects")
      .select("creator_id")
      .in("id", projectIds);

    if (projects) {
      const uniqueCreators = new Set(projects.map((p) => p.creator_id));
      companiesWorkedWith = uniqueCreators.size;
    }
  }

  return NextResponse.json({
    projectsCompleted,
    projectsCreated,
    companiesWorkedWith,
  });
}
