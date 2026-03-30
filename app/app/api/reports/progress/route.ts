import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { db } from "@/app/lib/db";

interface CountRow {
  project_id: string;
  completed: number;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = db
    .prepare(
      "SELECT project_id, COUNT(*) as completed FROM milestone_reports WHERE user_id = ? GROUP BY project_id"
    )
    .all(session.user.id) as CountRow[];

  const progress: Record<string, number> = {};
  for (const row of rows) {
    progress[row.project_id] = row.completed;
  }

  return NextResponse.json(progress);
}
