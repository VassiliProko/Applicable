import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { supabase } from "@/app/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: user, error } = await supabase
    .from("users")
    .select("id, name, email, title, bio, location, website, skills")
    .eq("id", session.user.id)
    .single();

  if (error || !user) {
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

  const { data: user, error } = await supabase
    .from("users")
    .update({
      name,
      title,
      bio,
      location,
      website,
      skills,
      updated_at: new Date().toISOString(),
    })
    .eq("id", session.user.id)
    .select("id, name, email, title, bio, location, website, skills")
    .single();

  if (error || !user) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }

  return NextResponse.json(user);
}
