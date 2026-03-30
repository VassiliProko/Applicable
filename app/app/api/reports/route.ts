import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { db } from "@/app/lib/db";
import crypto from "crypto";

interface ReportRow {
  id: string;
  milestone_id: string;
  summary: string;
  details: string | null;
  files: string;
  link: string | null;
  created_at: string;
}

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

  const reports = db
    .prepare(
      "SELECT id, milestone_id, summary, details, files, link, created_at FROM milestone_reports WHERE user_id = ? AND project_id = ?"
    )
    .all(session.user.id, projectId) as ReportRow[];

  const parsed = reports.map((r) => ({
    ...r,
    files: JSON.parse(r.files),
  }));

  return NextResponse.json(parsed);
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

  db.prepare(
    `INSERT INTO milestone_reports (id, user_id, project_id, milestone_id, summary, details, files, link)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(user_id, project_id, milestone_id)
     DO UPDATE SET summary = excluded.summary, details = excluded.details, files = excluded.files, link = excluded.link`
  ).run(
    id,
    session.user.id,
    projectId,
    milestoneId,
    summary,
    details || "",
    JSON.stringify(files || []),
    link || null
  );

  return NextResponse.json({ message: "Report saved" }, { status: 201 });
}
