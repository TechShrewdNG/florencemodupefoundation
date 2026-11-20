/**
 * Creates/migrates the database and seeds starter content on first run.
 * Safe to run repeatedly: seeding only happens when tables are empty.
 *
 *   npm run db:setup
 */
import { migrate } from "drizzle-orm/libsql/migrator";
import { count } from "drizzle-orm";
import bcrypt from "bcryptjs";
import fs from "node:fs";
import { db, databaseUrl, schema } from "../src/db";
import { defaultSettings } from "../src/lib/site-settings";

async function main() {
  const url = databaseUrl();
  if (url.startsWith("file:")) {
    const file = url.slice("file:".length);
    const dir = file.split("/").slice(0, -1).join("/");
    if (dir) fs.mkdirSync(dir, { recursive: true });
  }

  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("✓ Database migrated");

  await seedAdmin();

  const [{ n }] = await db.select({ n: count() }).from(schema.pages);
  if (n > 0) {
    console.log("✓ Content already present, skipping seed");
    return;
  }
  await seedContent();
  console.log("✓ Starter content seeded");
}

async function seedAdmin() {
  const [{ n }] = await db.select({ n: count() }).from(schema.users);
  if (n > 0) return;
  const email = (process.env.ADMIN_EMAIL || "admin@example.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "changeme123";
  await db.insert(schema.users).values({
    email,
    name: process.env.ADMIN_NAME || "Administrator",
    passwordHash: await bcrypt.hash(password, 12),
  });
  console.log(`✓ Admin user created: ${email}`);
  if (!process.env.ADMIN_PASSWORD) {
    console.warn(
      "  ⚠ Using the default password 'changeme123'. Sign in and change it under Admin → Users, or set ADMIN_EMAIL/ADMIN_PASSWORD before first setup.",
    );
  }
}

const p = (...paras: string[]) => paras.map((t) => `<p>${t}</p>`).join("");

async function seedContent() {
  await db.insert(schema.settings).values({ key: "site", value: JSON.stringify(defaultSettings) });

  await db.insert(schema.pages).values([
    {
      slug: "who-we-are",
      title: "Who We Are",
      subtitle: "A building with four walls and tomorrow inside",
      heroImage: "/images/img_2316.jpg",
      navGroup: "About",
      sortOrder: 1,
      body: p(
        "The Florence Modupe Foundation is a non-profit organisation based in Lagos, Nigeria, committed to educational inclusion in Africa.",
        "We believe every child has a right to education. Through our outreaches and partnerships we support children and young people with access to quality learning and life-changing skills.",
      ),
    },
    {
      slug: "core-values",
      title: "Core Values",
      subtitle: "The principles that guide everything we do",
      heroImage: "/images/img_2380.jpg",
      navGroup: "About",
      sortOrder: 2,
      system: true,
      body: "",
    },
    {
      slug: "from-our-founder",
      title: "From Our Founder",
      subtitle: "Mrs. Bukola Abitoye, Founder",
      heroImage: "/images/img_2488.jpg",
      navGroup: "About",
      sortOrder: 3,
      body: p("A message from our founder will appear here. Edit this page in the admin dashboard."),
    },
    {
      slug: "the-team",
      title: "The Team",
      subtitle: "The people behind the foundation",
      heroImage: "/images/img_2427.jpg",
      navGroup: "About",
      sortOrder: 4,
      system: true,
      body: "",
    },
    {
      slug: "milestones",
      title: "Milestones",
      subtitle: "Our little steps of progress",
      heroImage: "/images/img_2452.jpg",
      navGroup: "About",
      sortOrder: 5,
      system: true,
      body: "",
    },
    {
      slug: "the-challenge",
      title: "The Challenge",
      subtitle: "Why educational inclusion matters",
      heroImage: "/images/img_1078.jpg",
      navGroup: "Our Work",
      sortOrder: 6,
      body: p("Describe the challenge the foundation exists to address. Edit this page in the admin dashboard."),
    },
    {
      slug: "our-approach",
      title: "Our Approach",
      subtitle: "How we work",
      heroImage: "/images/img_2328.jpg",
      navGroup: "Our Work",
      sortOrder: 7,
      body: p("Describe how the foundation works towards its mission. Edit this page in the admin dashboard."),
    },
    {
      slug: "outreach",
      title: "Outreach",
      subtitle: "Out in the community",
      heroImage: "/images/img_1111.jpg",
      navGroup: "Our Work",
      sortOrder: 8,
      body: p("Share stories from the foundation's outreaches. Edit this page in the admin dashboard."),
    },
    {
      slug: "gallery",
      title: "Gallery",
      subtitle: "Moments from our outreaches",
      heroImage: "/images/img_1019.jpg",
      navGroup: "Our Work",
      sortOrder: 9,
      system: true,
      body: "",
    },
    {
      slug: "news",
      title: "News",
      subtitle: "Updates from the foundation",
      heroImage: "/images/img_2262.jpg",
      sortOrder: 10,
      system: true,
      body: "",
    },
    {
      slug: "contact",
      title: "Contact",
      subtitle: "Get in touch",
      heroImage: "/images/img_2471.jpg",
      sortOrder: 11,
      system: true,
      body: p("We'd love to hear from you. Send us a message and we'll get back to you as soon as we can."),
    },
    {
      slug: "support-us",
      title: "Support Us",
      subtitle: "Help a child learn",
      heroImage: "/images/img_1097.jpg",
      showInNav: false,
      sortOrder: 12,
      body: p(
        "Your support helps us provide access to quality education and life-changing skills.",
        "Add donation details (bank account, payment link) here from the admin dashboard.",
      ),
    },
  ]);

  await db.insert(schema.heroSlides).values([
    {
      eyebrow: "Building a Better Tomorrow, Today",
      title: "Educational Inclusion In Africa",
      image: "/images/img_2380.jpg",
      ctaLabel: "Who We Are",
      ctaHref: "/who-we-are",
      sortOrder: 1,
    },
    {
      eyebrow: "Building a Better Tomorrow, Today",
      title: "Every Child Has A Right To Education",
      image: "/images/img_1078.jpg",
      ctaLabel: "Support Us",
      ctaHref: "/support-us",
      sortOrder: 2,
    },
    {
      eyebrow: "Building a Better Tomorrow, Today",
      title: "Life-Changing Skills For Future Leaders",
      image: "/images/img_2471.jpg",
      ctaLabel: "Our Approach",
      ctaHref: "/our-approach",
      sortOrder: 3,
    },
  ]);

  await db.insert(schema.coreValues).values([
    { title: "Integrity", description: "We are honest and transparent in everything we do.", sortOrder: 1 },
    { title: "Excellence", description: "We hold ourselves to high standards in our work.", sortOrder: 2 },
    { title: "Collaboration", description: "We work together with communities and partners.", sortOrder: 3 },
    { title: "Care", description: "We put the wellbeing of every child at the centre.", sortOrder: 4 },
  ]);

  await db.insert(schema.teamMembers).values([
    { name: "Mrs. Bukola Abitoye", role: "Founder", photo: "", sortOrder: 1 },
  ]);

  const gallery = [
    "img_1019", "img_1024", "img_1078", "img_1097", "img_1111", "img_1236", "img_2252", "img_2262",
    "img_2306", "img_2316", "img_2328", "img_2380", "img_2427", "img_2452", "img_2471",
  ];
  await db
    .insert(schema.galleryImages)
    .values(gallery.map((g, i) => ({ src: `/images/${g}.jpg`, sortOrder: i + 1 })));

  await db.insert(schema.posts).values({
    slug: "welcome-to-our-new-website",
    title: "Welcome to our new website",
    excerpt: "We've launched a new home for news and updates from the Florence Modupe Foundation.",
    coverImage: "/images/img_2252.jpg",
    category: "News",
    published: true,
    publishedAt: new Date().toISOString().slice(0, 10),
    body: p(
      "Welcome to the new website of the Florence Modupe Foundation. This is where we'll share news from our outreaches, milestones and ways you can get involved.",
    ),
  });
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  },
);
