import { supabase } from "./db";
import crypto from "crypto";

export async function sendNotification({
  userId,
  type,
  title,
  message,
  link,
}: {
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
}) {
  await supabase.from("notifications").insert({
    id: crypto.randomUUID(),
    user_id: userId,
    type,
    title,
    message,
    link: link || null,
  });
}
