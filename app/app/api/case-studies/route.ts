import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { db } from "@/app/lib/db";
import crypto from "crypto";

interface CaseStudyRow {
  id: string;
  project_id: string;
  project_title: string;
  company_name: string;
  sections: string;
  created_at: string;
}

// GET: list all case studies for the logged-in user
export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const caseStudyId = searchParams.get("id");

  if (caseStudyId) {
    // Get a single case study
    const row = db
      .prepare(
        "SELECT id, project_id, project_title, company_name, sections, created_at FROM case_studies WHERE id = ? AND user_id = ?"
      )
      .get(caseStudyId, session.user.id) as CaseStudyRow | undefined;

    if (!row) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ...row, sections: JSON.parse(row.sections) });
  }

  // List all
  const rows = db
    .prepare(
      "SELECT id, project_id, project_title, company_name, sections, created_at FROM case_studies WHERE user_id = ? ORDER BY created_at DESC"
    )
    .all(session.user.id) as CaseStudyRow[];

  const parsed = rows.map((r) => ({
    ...r,
    sections: JSON.parse(r.sections),
  }));

  return NextResponse.json(parsed);
}

// POST: publish a case study
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId, projectTitle, companyName, sections } =
    await request.json();

  if (!projectId || !projectTitle || !sections?.length) {
    return NextResponse.json(
      { error: "projectId, projectTitle, and sections are required" },
      { status: 400 }
    );
  }

  const id = crypto.randomUUID();

  db.prepare(
    `INSERT INTO case_studies (id, user_id, project_id, project_title, company_name, sections)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(project_id)
     DO UPDATE SET sections = excluded.sections, project_title = excluded.project_title, company_name = excluded.company_name`
  ).run(id, session.user.id, projectId, projectTitle, companyName || "", JSON.stringify(sections));

  // Get the actual ID (might be existing row on conflict)
  const row = db
    .prepare("SELECT id FROM case_studies WHERE user_id = ? AND project_id = ?")
    .get(session.user.id, projectId) as { id: string };

  return NextResponse.json({ id: row.id, message: "Case study published" }, { status: 201 });
}
