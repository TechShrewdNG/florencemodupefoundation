import "server-only";
import { schema } from "@/db";
import type { CollectionMeta } from "./fields";

export type ContentTable =
  | typeof schema.pages
  | typeof schema.posts
  | typeof schema.heroSlides
  | typeof schema.coreValues
  | typeof schema.teamMembers
  | typeof schema.milestones;

type Collection = CollectionMeta & { table: ContentTable; orderBy: "sortOrder" | "publishedAt" };

export const NAV_GROUP_OPTIONS = [
  { value: "", label: "Top level" },
  { value: "About", label: "About (dropdown)" },
  { value: "Our Work", label: "Our Work (dropdown)" },
];

export const collections: Record<string, Collection> = {
  pages: {
    key: "pages",
    label: "Pages",
    singular: "Page",
    description: "Website pages and the main navigation menu.",
    table: schema.pages,
    orderBy: "sortOrder",
    titleField: "title",
    columns: [
      { name: "slug", label: "URL" },
      { name: "navGroup", label: "Menu" },
      { name: "published", label: "Published", type: "boolean" },
    ],
    publicPath: (i) => (i.published ? `/${i.slug}` : null),
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "subtitle", label: "Subtitle", type: "text", help: "Shown under the title in the page banner." },
      { name: "body", label: "Content", type: "richtext" },
      { name: "published", label: "Published", type: "checkbox", side: true },
      { name: "slug", label: "URL slug", type: "slug", from: "title", side: true, help: "e.g. who-we-are → /who-we-are" },
      { name: "heroImage", label: "Banner image", type: "image", side: true },
      { name: "showInNav", label: "Show in menu", type: "checkbox", side: true },
      { name: "navLabel", label: "Menu label", type: "text", side: true, help: "Defaults to the title." },
      { name: "navGroup", label: "Menu group", type: "select", options: NAV_GROUP_OPTIONS, side: true },
      { name: "sortOrder", label: "Menu order", type: "number", side: true },
    ],
  },
  posts: {
    key: "posts",
    label: "News",
    singular: "Post",
    description: "News articles and updates.",
    table: schema.posts,
    orderBy: "publishedAt",
    titleField: "title",
    columns: [
      { name: "coverImage", label: "", type: "image" },
      { name: "publishedAt", label: "Date" },
      { name: "published", label: "Published", type: "boolean" },
    ],
    publicPath: (i) => (i.published ? `/news/${i.slug}` : null),
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "excerpt", label: "Summary", type: "textarea", help: "A short teaser shown on news cards." },
      { name: "body", label: "Article", type: "richtext" },
      { name: "photos", label: "Photo gallery", type: "images", help: "Shown as a photo grid under the article." },
      { name: "videoUrl", label: "Video URL", type: "text", help: "Optional link to an .mp4 file, shown under the article." },
      { name: "published", label: "Published", type: "checkbox", side: true },
      { name: "publishedAt", label: "Date", type: "date", side: true },
      { name: "slug", label: "URL slug", type: "slug", from: "title", side: true },
      { name: "category", label: "Category", type: "text", side: true },
      { name: "coverImage", label: "Cover image", type: "image", side: true },
    ],
  },
  slides: {
    key: "slides",
    label: "Home Slides",
    singular: "Slide",
    description: "The rotating banner at the top of the home page.",
    table: schema.heroSlides,
    orderBy: "sortOrder",
    titleField: "title",
    columns: [
      { name: "image", label: "", type: "image" },
      { name: "eyebrow", label: "Small heading" },
    ],
    fields: [
      { name: "eyebrow", label: "Small heading", type: "text" },
      { name: "title", label: "Big heading", type: "text", required: true },
      { name: "text", label: "Text", type: "textarea" },
      { name: "ctaLabel", label: "Button label", type: "text" },
      { name: "ctaHref", label: "Button link", type: "text", help: "e.g. /donate or https://…" },
      { name: "image", label: "Background image", type: "image", side: true },
      { name: "sortOrder", label: "Order", type: "number", side: true },
    ],
  },
  values: {
    key: "values",
    label: "Core Values",
    singular: "Core value",
    description: "Shown on the home page and the Core Values page.",
    table: schema.coreValues,
    orderBy: "sortOrder",
    titleField: "title",
    columns: [{ name: "description", label: "Description" }],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "sortOrder", label: "Order", type: "number", side: true },
    ],
  },
  team: {
    key: "team",
    label: "Team",
    singular: "Team member",
    description: "People shown on The Team page.",
    table: schema.teamMembers,
    orderBy: "sortOrder",
    titleField: "name",
    columns: [
      { name: "photo", label: "", type: "image" },
      { name: "role", label: "Role" },
    ],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "role", label: "Role", type: "text" },
      { name: "bio", label: "Short bio", type: "textarea" },
      { name: "photo", label: "Photo", type: "image", side: true },
      { name: "sortOrder", label: "Order", type: "number", side: true },
    ],
  },
  milestones: {
    key: "milestones",
    label: "Milestones",
    singular: "Milestone",
    description: "Timeline entries on the Milestones page.",
    table: schema.milestones,
    orderBy: "sortOrder",
    titleField: "title",
    columns: [{ name: "date", label: "Date" }],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "date", label: "Date / year", type: "text", help: "Free text, e.g. “March 2023”." },
      { name: "description", label: "Description", type: "textarea" },
      { name: "image", label: "Image", type: "image", side: true },
      { name: "sortOrder", label: "Order", type: "number", side: true },
    ],
  },
};

export function getCollection(key: string) {
  return Object.hasOwn(collections, key) ? collections[key] : null;
}

/** Strip server-only bits so the definition can cross into client components. */
export function toMeta(c: Collection): Omit<CollectionMeta, "publicPath"> {
  const { key, label, singular, description, titleField, columns, fields } = c;
  return { key, label, singular, description, titleField, columns, fields };
}
