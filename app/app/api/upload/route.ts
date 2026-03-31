import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { supabase } from "@/app/lib/db";
import crypto from "crypto";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate unique filename
  const ext = file.name.includes(".") ? file.name.substring(file.name.lastIndexOf(".")) : "";
  const uniqueName = `${crypto.randomUUID()}${ext}`;

  const { error } = await supabase.storage
    .from("uploads")
    .upload(uniqueName, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  const { data: urlData } = supabase.storage
    .from("uploads")
    .getPublicUrl(uniqueName);

  const fileType = file.type.startsWith("video/")
    ? "video"
    : file.type.startsWith("image/")
      ? "image"
      : "file";

  return NextResponse.json({
    name: file.name,
    type: fileType,
    url: urlData.publicUrl,
  });
}
