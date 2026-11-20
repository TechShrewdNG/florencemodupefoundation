"use server";

import { z } from "zod";
import { db, schema } from "@/db";

export type FormState = { ok: boolean; message: string } | null;

const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(120),
  email: z.email("Please enter a valid email").max(200),
  phone: z.string().trim().max(40).optional().default(""),
  subject: z.string().trim().max(200).optional().default(""),
  body: z.string().trim().min(5, "Please write a message").max(5000),
});

export async function sendMessage(_prev: FormState, formData: FormData): Promise<FormState> {
  // Honeypot: bots fill every field.
  if (formData.get("website")) return { ok: true, message: "Thank you! We'll be in touch." };
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  await db.insert(schema.messages).values(parsed.data);
  return { ok: true, message: "Thank you for reaching out! We'll get back to you soon." };
}

export async function subscribe(_prev: FormState, formData: FormData): Promise<FormState> {
  if (formData.get("website")) return { ok: true, message: "You're subscribed!" };
  const parsed = z.email().max(200).safeParse(String(formData.get("email") ?? "").trim().toLowerCase());
  if (!parsed.success) return { ok: false, message: "Please enter a valid email address." };
  await db.insert(schema.subscribers).values({ email: parsed.data }).onConflictDoNothing();
  return { ok: true, message: "Thanks for subscribing!" };
}
