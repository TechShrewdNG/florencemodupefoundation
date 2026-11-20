# Florence Modupe Foundation website

The foundation's website, rebuilt with [Next.js](https://nextjs.org) and an admin dashboard for editing content.
It replaces the old static WordPress export, which is kept for reference in [`legacy-wordpress/`](legacy-wordpress/).

## What you can edit in the admin

Go to **`/admin`** and sign in. From there you can manage:

| Section | What it controls |
| --- | --- |
| **Pages** | Page title, banner, rich-text content, and the main menu (label, dropdown group, order, show/hide). You can add new pages too. |
| **News** | Articles with cover image, photo gallery, optional video, category, date, and draft/published state. Posts whose category matches a page title (e.g. “Outreach”) are listed on that page. |
| **Home Slides** | The rotating banner on the home page. |
| **Core Values**, **Team**, **Milestones** | The lists on those pages. |
| **Gallery** | Upload photos (several at once), add captions, and reorder them. |
| **Messages** | Contact-form submissions. |
| **Subscribers** | Newsletter sign-ups, with CSV export. |
| **Site Settings** | Logo, contact details, social links, and the home-page text (about, vision, mission, impact numbers, call-to-action). |
| **Users** | Add or remove admins and change your password. |

Changes go live as soon as you click **Save**.

## Running locally

Requires Node.js 20+.

```bash
npm install
cp .env.example .env.local   # then edit values
npm run dev                  # http://localhost:3000
```

You need a Postgres database. The easiest is a free [Neon](https://neon.tech) project; create a separate
Neon branch for development so you don't edit the live site's data. Put its connection string in `.env.local`
as `DATABASE_URL`.

`npm run dev` and `npm run build` run `npm run db:setup` first. It applies migrations, creates the first admin user from `ADMIN_EMAIL`/`ADMIN_PASSWORD` and loads starter content.
It is safe to run repeatedly: it only seeds content into an empty database.

> If `ADMIN_PASSWORD` isn't set, the first admin is `admin@example.com` / `changeme123`. Change it right away under **Admin → Users**.

## Tech stack

- **Next.js 16** (App Router, Cache Components). Public pages are prerendered and cached under the `content` tag.
  Every admin save calls `updateTag("content")`, so the site updates immediately.
- **Drizzle ORM + Postgres** ([Neon](https://neon.tech) recommended), via the standard `pg` driver, so any Postgres works.
- **Auth**: email and password (bcrypt), with a signed, HTTP-only JWT session cookie. Every admin page and server action checks the session.
- **TipTap** rich-text editor. Its HTML is sanitized on save.
- **Uploads**: stored in [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) when `BLOB_READ_WRITE_TOKEN` is set,
  otherwise on local disk in `UPLOAD_DIR` (served from `/uploads/...`).
- **Tailwind CSS 4**.

Useful scripts: `npm run lint`, `npm run typecheck`, `npm run db:generate` (after editing `src/db/schema.ts`), `npm run db:studio`.

## Deploying

### Vercel (recommended)

Vercel's file system is read-only and temporary, so uploaded images need hosted storage (Vercel Blob).
The build stops with a list of anything missing.

1. **Database:** in Vercel go to **Storage → Create → Neon** (Marketplace) and connect it to this project.
   This sets `DATABASE_URL` automatically. Alternatively, create a project at [neon.tech](https://neon.tech) and
   add its connection string as `DATABASE_URL` yourself.
2. **Image storage:** in Vercel go to **Storage → Create → Blob** and connect it to this project.
   This sets `BLOB_READ_WRITE_TOKEN` automatically.
3. **Environment variables:** in **Project → Settings → Environment Variables**, add:
   | Name | Value |
   | --- | --- |
   | `DATABASE_URL` | set by the Neon integration, or your Neon connection string |
   | `SESSION_SECRET` | 32+ random characters, e.g. from `openssl rand -base64 48` |
   | `ADMIN_EMAIL` / `ADMIN_PASSWORD` | the first admin login (used only when no users exist yet) |
   | `SITE_URL` | e.g. `https://theflorencemodupefoundation.com` |
4. **Redeploy.** The build creates the tables and loads the starter content into Neon.

The site can't stay on GitHub Pages: the admin panel needs a server.

### Your own server / VPS

Run `npm run build && npm start` with `DATABASE_URL` and `SESSION_SECRET` set. Without Vercel Blob, keep
`data/uploads` (or your `UPLOAD_DIR`) on persistent storage: it holds uploaded images.

## Project layout

```
src/app/(site)/        public pages (home, [slug] pages, news, gallery, team, contact…)
src/app/admin/         admin dashboard, login and server actions
src/lib/data.ts        cached public data access
src/lib/admin/         admin collection definitions (fields shown in the editor)
src/db/schema.ts       database schema
scripts/setup-db.ts    migrations, first admin and starter content
drizzle/               SQL migrations
scripts/seed-content.ts starter content imported from theflorencemodupefoundation.com
legacy-wordpress/      the previous static WordPress export (reference only)
```
