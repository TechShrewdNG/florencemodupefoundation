import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const timestamps = {
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
};

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  ...timestamps,
});

/** Key/value store for site-wide settings. Values are JSON-encoded. */
export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export const pages = sqliteTable("pages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull().default(""),
  heroImage: text("hero_image").notNull().default(""),
  body: text("body").notNull().default(""),
  navLabel: text("nav_label").notNull().default(""),
  navGroup: text("nav_group").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  showInNav: integer("show_in_nav", { mode: "boolean" }).notNull().default(true),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  /** System pages back a built-in route (e.g. /contact) and can't be deleted or re-slugged. */
  system: integer("system", { mode: "boolean" }).notNull().default(false),
  ...timestamps,
});

export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull().default(""),
  coverImage: text("cover_image").notNull().default(""),
  category: text("category").notNull().default(""),
  body: text("body").notNull().default(""),
  published: integer("published", { mode: "boolean" }).notNull().default(false),
  publishedAt: text("published_at").notNull().default(""),
  ...timestamps,
});

export const heroSlides = sqliteTable("hero_slides", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  eyebrow: text("eyebrow").notNull().default(""),
  title: text("title").notNull(),
  text: text("text").notNull().default(""),
  image: text("image").notNull().default(""),
  ctaLabel: text("cta_label").notNull().default(""),
  ctaHref: text("cta_href").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
});

export const coreValues = sqliteTable("core_values", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
});

export const teamMembers = sqliteTable("team_members", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  role: text("role").notNull().default(""),
  bio: text("bio").notNull().default(""),
  photo: text("photo").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
});

export const milestones = sqliteTable("milestones", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull().default(""),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  image: text("image").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
});

export const galleryImages = sqliteTable("gallery_images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  src: text("src").notNull(),
  caption: text("caption").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
});

export const messages = sqliteTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull().default(""),
  subject: text("subject").notNull().default(""),
  body: text("body").notNull(),
  read: integer("read", { mode: "boolean" }).notNull().default(false),
  ...timestamps,
});

export const subscribers = sqliteTable("subscribers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  ...timestamps,
});

export type Page = typeof pages.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type HeroSlide = typeof heroSlides.$inferSelect;
export type CoreValue = typeof coreValues.$inferSelect;
export type TeamMember = typeof teamMembers.$inferSelect;
export type Milestone = typeof milestones.$inferSelect;
export type GalleryImage = typeof galleryImages.$inferSelect;
