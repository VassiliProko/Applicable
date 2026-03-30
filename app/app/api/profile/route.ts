import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { db } from "@/app/lib/db";

interface UserRow {
  id: string;
  name: string;
  email: string;
  title: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  skills: string | null;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = db
    .prepare(
      "SELECT id, name, email, title, bio, location, website, skills FROM users WHERE id = ?"
    )
    .get(session.user.id) as UserRow | undefined;

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, title, bio, location, website, skills } = await request.json();

  db.prepare(
    `UPDATE users SET name = ?, title = ?, bio = ?, location = ?, website = ?, skills = ?, updated_at = datetime('now') WHERE id = ?`
  ).run(name, title, bio, location, website, skills, session.user.id);

  const user = db
    .prepare(
      "SELECT id, name, email, title, bio, location, website, skills FROM users WHERE id = ?"
    )
    .get(session.user.id) as UserRow;

  return NextResponse.json(user);
}
