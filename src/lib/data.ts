import "server-only";
import { and, asc, desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db, schema } from "@/db";
import { mergeSettings, type SiteSettings } from "./site-settings";

/** Every public read is tagged "content"; admin mutations call updateTag("content"). */
export const CONTENT_TAG = "content";

function tagContent() {
  cacheTag(CONTENT_TAG);
  cacheLife("max");
}

export async function getSettings(): Promise<SiteSettings> {
  "use cache";
  tagContent();
  const [row] = await db.select().from(schema.settings).where(eq(schema.settings.key, "site"));
  return mergeSettings(row ? JSON.parse(row.value) : null);
}

export type NavItem = { label: string; href: string };
export type NavEntry = NavItem | { label: string; children: NavItem[] };

export async function getNavigation(): Promise<NavEntry[]> {
  "use cache";
  tagContent();
  const rows = await db
    .select()
    .from(schema.pages)
    .where(and(eq(schema.pages.published, true), eq(schema.pages.showInNav, true)))
    .orderBy(asc(schema.pages.sortOrder));
  const nav: NavEntry[] = [];
  const groups = new Map<string, NavItem[]>();
  for (const r of rows) {
    const item = { label: r.navLabel || r.title, href: `/${r.slug}` };
    if (!r.navGroup) {
      nav.push(item);
      continue;
    }
    let group = groups.get(r.navGroup);
    if (!group) {
      group = [];
      groups.set(r.navGroup, group);
      nav.push({ label: r.navGroup, children: group });
    }
    group.push(item);
  }
  return nav;
}

export async function getPage(slug: string) {
  "use cache";
  tagContent();
  const [page] = await db
    .select()
    .from(schema.pages)
    .where(and(eq(schema.pages.slug, slug), eq(schema.pages.published, true)));
  return page ?? null;
}

export async function getContentPageSlugs() {
  "use cache";
  tagContent();
  const rows = await db
    .select({ slug: schema.pages.slug })
    .from(schema.pages)
    .where(and(eq(schema.pages.published, true), eq(schema.pages.system, false)));
  return rows.map((r) => r.slug);
}

export async function getHeroSlides() {
  "use cache";
  tagContent();
  return db.select().from(schema.heroSlides).orderBy(asc(schema.heroSlides.sortOrder));
}

export async function getCoreValues() {
  "use cache";
  tagContent();
  return db.select().from(schema.coreValues).orderBy(asc(schema.coreValues.sortOrder));
}

export async function getTeam() {
  "use cache";
  tagContent();
  return db.select().from(schema.teamMembers).orderBy(asc(schema.teamMembers.sortOrder));
}

export async function getMilestones() {
  "use cache";
  tagContent();
  return db.select().from(schema.milestones).orderBy(asc(schema.milestones.sortOrder));
}

export async function getGallery() {
  "use cache";
  tagContent();
  return db.select().from(schema.galleryImages).orderBy(asc(schema.galleryImages.sortOrder));
}

export async function getPosts(limit?: number) {
  "use cache";
  tagContent();
  const q = db
    .select()
    .from(schema.posts)
    .where(eq(schema.posts.published, true))
    .orderBy(desc(schema.posts.publishedAt), desc(schema.posts.id));
  return limit ? q.limit(limit) : q;
}

export async function getPost(slug: string) {
  "use cache";
  tagContent();
  const [post] = await db
    .select()
    .from(schema.posts)
    .where(and(eq(schema.posts.slug, slug), eq(schema.posts.published, true)));
  return post ?? null;
}
