import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/app/lib/db";
import crypto from "crypto";

export async function POST(request: Request) {
  const { name, email, password } = await request.json();

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Name, email, and password are required" },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters" },
      { status: 400 }
    );
  }

  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists" },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const id = crypto.randomUUID();

  const { error } = await supabase
    .from("users")
    .insert({ id, name, email, password: hashedPassword });

  if (error) {
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }

  return NextResponse.json({ message: "Account created" }, { status: 201 });
}
