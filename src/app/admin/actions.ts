"use server";

import bcrypt from "bcryptjs";
import { and, count, eq, ne } from "drizzle-orm";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/auth";
import { CONTENT_TAG } from "@/lib/data";
import { getCollection } from "@/lib/admin/collections";
import { cleanHtml, slugify } from "@/lib/sanitize";
import { createSession, destroySession } from "@/lib/session";
import { mergeSettings, type SiteSettings } from "@/lib/site-settings";
import { storeImage } from "@/lib/uploads";

export type ActionState = { ok: boolean; message: string } | null;

// Compared against when the email is unknown, so timing doesn't reveal which emails exist.
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 12);

function contentChanged() {
  updateTag(CONTENT_TAG);
}

/* ───────────────────────── Auth ───────────────────────── */

export async function login(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const [user] = await db.select().from(schema.users).where(eq(schema.users.email, email));
  const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !ok) return { ok: false, message: "Incorrect email or password." };
  await createSession(user.id);
  const next = String(formData.get("next") ?? "");
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

/* ───────────────────── Collections (generic CRUD) ───────────────────── */

export async function saveItem(
  collectionKey: string,
  id: number | null,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUser();
  const c = getCollection(collectionKey);
  if (!c) return { ok: false, message: "Unknown collection." };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const table = c.table as any;

  let existing: Record<string, unknown> | undefined;
  if (id !== null) {
    [existing] = await db.select().from(table).where(eq(table.id, id));
    if (!existing) return { ok: false, message: "This item no longer exists." };
  }

  const values: Record<string, unknown> = {};
  for (const f of c.fields) {
    const raw = formData.get(f.name);
    switch (f.type) {
      case "checkbox":
        values[f.name] = raw === "on";
        break;
      case "number":
        values[f.name] = Number.parseInt(String(raw ?? "0"), 10) || 0;
        break;
      case "richtext":
        values[f.name] = cleanHtml(String(raw ?? ""));
        break;
      case "images": {
        let list: unknown = [];
        try {
          list = JSON.parse(String(raw ?? "[]"));
        } catch {}
        values[f.name] = JSON.stringify(
          Array.isArray(list) ? list.filter((u): u is string => typeof u === "string" && u.length > 0) : [],
        );
        break;
      }
      case "slug": {
        const source = String(formData.get(f.from ?? "title") ?? "");
        values[f.name] = slugify(String(raw ?? "")) || slugify(source);
        break;
      }
      default:
        values[f.name] = String(raw ?? "").trim();
    }
    if (f.required && !values[f.name]) return { ok: false, message: `${f.label} is required.` };
  }

  // System pages back built-in routes: keep their slug fixed.
  if (existing?.system) values.slug = existing.slug;

  if ("slug" in values) {
    if (!values.slug) return { ok: false, message: "URL slug is required." };
    const reserved = ["admin", "uploads", "api", "news", "_next"];
    if (collectionKey === "pages" && !existing?.system && reserved.includes(String(values.slug))) {
      return { ok: false, message: `“${values.slug}” is reserved. Please choose another URL.` };
    }
    const clash = await db
      .select({ id: table.id })
      .from(table)
      .where(id === null ? eq(table.slug, values.slug) : and(eq(table.slug, values.slug), ne(table.id, id)));
    if (clash.length) return { ok: false, message: `Another item already uses the URL “${values.slug}”.` };
  }

  if (collectionKey === "posts" && values.published && !values.publishedAt) {
    values.publishedAt = new Date().toISOString().slice(0, 10);
  }

  if (id === null) {
    await db.insert(table).values(values);
  } else {
    await db.update(table).set({ ...values, updatedAt: new Date() }).where(eq(table.id, id));
  }
  contentChanged();
  redirect(`/admin/${collectionKey}?saved=1`);
}

export async function deleteItem(collectionKey: string, id: number) {
  await requireUser();
  const c = getCollection(collectionKey);
  if (!c) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const table = c.table as any;
  if (collectionKey === "pages") {
    const [page] = await db.select().from(schema.pages).where(eq(schema.pages.id, id));
    if (page?.system) return;
  }
  await db.delete(table).where(eq(table.id, id));
  contentChanged();
  redirect(`/admin/${collectionKey}?deleted=1`);
}

/* ───────────────────────── Settings ───────────────────────── */

export async function saveSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireUser();
  const g = (k: string) => String(formData.get(k) ?? "").trim();
  const statValues = formData.getAll("statValue").map(String);
  const statLabels = formData.getAll("statLabel").map(String);
  const next: SiteSettings = mergeSettings({
    siteName: g("siteName"),
    tagline: g("tagline"),
    logo: g("logo"),
    email: g("email"),
    phone: g("phone"),
    address: g("address"),
    socials: {
      facebook: g("facebook"),
      twitter: g("twitter"),
      instagram: g("instagram"),
      youtube: g("youtube"),
      linkedin: g("linkedin"),
    },
    aboutEyebrow: g("aboutEyebrow"),
    aboutHeading: g("aboutHeading"),
    aboutText: g("aboutText"),
    aboutImage: g("aboutImage"),
    vision: g("vision"),
    mission: g("mission"),
    stats: statValues
      .map((value, i) => ({ value: value.trim(), label: (statLabels[i] ?? "").trim() }))
      .filter((s) => s.value && s.label),
    founderQuote: g("founderQuote"),
    founderName: g("founderName"),
    ctaHeading: g("ctaHeading"),
    ctaText: g("ctaText"),
    ctaButtonLabel: g("ctaButtonLabel"),
    ctaButtonHref: g("ctaButtonHref"),
    newsletterHeading: g("newsletterHeading"),
    newsletterText: g("newsletterText"),
    footerText: g("footerText"),
  });
  if (!next.siteName) return { ok: false, message: "Site name is required." };
  await db
    .insert(schema.settings)
    .values({ key: "site", value: JSON.stringify(next) })
    .onConflictDoUpdate({ target: schema.settings.key, set: { value: JSON.stringify(next) } });
  contentChanged();
  return { ok: true, message: "Settings saved." };
}

/* ───────────────────────── Uploads & gallery ───────────────────────── */

export async function uploadImage(formData: FormData): Promise<{ url?: string; error?: string }> {
  await requireUser();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "No file selected." };
  try {
    return { url: await storeImage(file) };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Upload failed." };
  }
}

export async function addGalleryImage(src: string, caption = "") {
  await requireUser();
  const [{ n }] = await db.select({ n: count() }).from(schema.galleryImages);
  await db.insert(schema.galleryImages).values({ src, caption, sortOrder: n + 1 });
  contentChanged();
}

export async function updateGalleryImage(id: number, formData: FormData) {
  await requireUser();
  await db
    .update(schema.galleryImages)
    .set({
      caption: String(formData.get("caption") ?? "").trim(),
      sortOrder: Number.parseInt(String(formData.get("sortOrder") ?? "0"), 10) || 0,
      updatedAt: new Date(),
    })
    .where(eq(schema.galleryImages.id, id));
  contentChanged();
}

export async function deleteGalleryImage(id: number) {
  await requireUser();
  await db.delete(schema.galleryImages).where(eq(schema.galleryImages.id, id));
  contentChanged();
}

/* ───────────────────────── Inbox ───────────────────────── */

export async function setMessageRead(id: number, read: boolean) {
  await requireUser();
  await db.update(schema.messages).set({ read }).where(eq(schema.messages.id, id));
}

export async function deleteMessage(id: number) {
  await requireUser();
  await db.delete(schema.messages).where(eq(schema.messages.id, id));
  redirect("/admin/messages");
}

export async function deleteSubscriber(id: number) {
  await requireUser();
  await db.delete(schema.subscribers).where(eq(schema.subscribers.id, id));
}

/* ───────────────────────── Users ───────────────────────── */

const newUserSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.email("Enter a valid email"),
  password: z.string().min(10, "Password must be at least 10 characters"),
});

export async function createUser(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireUser();
  const parsed = newUserSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  const email = parsed.data.email.toLowerCase();
  const [exists] = await db.select().from(schema.users).where(eq(schema.users.email, email));
  if (exists) return { ok: false, message: "A user with that email already exists." };
  await db.insert(schema.users).values({
    name: parsed.data.name,
    email,
    passwordHash: await bcrypt.hash(parsed.data.password, 12),
  });
  return { ok: true, message: `Added ${parsed.data.name}.` };
}

export async function deleteUser(id: number) {
  const me = await requireUser();
  if (me.id === id) return;
  await db.delete(schema.users).where(eq(schema.users.id, id));
}

export async function changePassword(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const me = await requireUser();
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (next.length < 10) return { ok: false, message: "New password must be at least 10 characters." };
  if (next !== confirm) return { ok: false, message: "New passwords don't match." };
  const [user] = await db.select().from(schema.users).where(eq(schema.users.id, me.id));
  if (!user || !(await bcrypt.compare(current, user.passwordHash))) {
    return { ok: false, message: "Current password is incorrect." };
  }
  await db
    .update(schema.users)
    .set({ passwordHash: await bcrypt.hash(next, 12), updatedAt: new Date() })
    .where(eq(schema.users.id, me.id));
  return { ok: true, message: "Password updated." };
}
