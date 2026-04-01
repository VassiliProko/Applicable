import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { supabase } from "@/app/lib/db";

// GET: get notifications for current user
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }

  return NextResponse.json(data || []);
}

// PUT: mark notifications as read
export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { notificationIds, markAll } = await request.json();

  if (markAll) {
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", session.user.id)
      .eq("read", false);
  } else if (notificationIds?.length) {
    await supabase
      .from("notifications")
      .update({ read: true })
      .in("id", notificationIds)
      .eq("user_id", session.user.id);
  }

  return NextResponse.json({ message: "Updated" });
}
