import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  ...timestamps,
});

/** Key/value store for site-wide settings. Values are JSON-encoded. */
export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export const pages = pgTable("pages", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull().default(""),
  heroImage: text("hero_image").notNull().default(""),
  body: text("body").notNull().default(""),
  navLabel: text("nav_label").notNull().default(""),
  navGroup: text("nav_group").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  showInNav: boolean("show_in_nav").notNull().default(true),
  published: boolean("published").notNull().default(true),
  /** System pages back a built-in route (e.g. /contact) and can't be deleted or re-slugged. */
  system: boolean("system").notNull().default(false),
  ...timestamps,
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull().default(""),
  coverImage: text("cover_image").notNull().default(""),
  category: text("category").notNull().default(""),
  body: text("body").notNull().default(""),
  /** JSON array of image URLs shown as a photo grid under the article. */
  photos: text("photos").notNull().default("[]"),
  videoUrl: text("video_url").notNull().default(""),
  published: boolean("published").notNull().default(false),
  publishedAt: text("published_at").notNull().default(""),
  ...timestamps,
});

export const heroSlides = pgTable("hero_slides", {
  id: serial("id").primaryKey(),
  eyebrow: text("eyebrow").notNull().default(""),
  title: text("title").notNull(),
  text: text("text").notNull().default(""),
  image: text("image").notNull().default(""),
  ctaLabel: text("cta_label").notNull().default(""),
  ctaHref: text("cta_href").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
});

export const coreValues = pgTable("core_values", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
});

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull().default(""),
  bio: text("bio").notNull().default(""),
  photo: text("photo").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
});

export const milestones = pgTable("milestones", {
  id: serial("id").primaryKey(),
  date: text("date").notNull().default(""),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  image: text("image").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
});

export const galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  src: text("src").notNull(),
  caption: text("caption").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull().default(""),
  subject: text("subject").notNull().default(""),
  body: text("body").notNull(),
  read: boolean("read").notNull().default(false),
  ...timestamps,
});

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
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
