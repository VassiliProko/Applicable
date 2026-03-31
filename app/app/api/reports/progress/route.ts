import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { supabase } from "@/app/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: reports, error } = await supabase
    .from("milestone_reports")
    .select("project_id")
    .eq("user_id", session.user.id);

  if (error) {
    return NextResponse.json({ error: "Failed to load progress" }, { status: 500 });
  }

  const progress: Record<string, number> = {};
  for (const row of reports || []) {
    progress[row.project_id] = (progress[row.project_id] || 0) + 1;
  }

  return NextResponse.json(progress);
}
