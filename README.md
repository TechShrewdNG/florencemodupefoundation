# Florence Modupe Foundation website

The foundation's website, rebuilt with [Next.js](https://nextjs.org) and an admin dashboard for editing content.
It replaces the old static WordPress export, which is kept for reference in [`legacy-wordpress/`](legacy-wordpress/).

## What you can edit in the admin

Go to **`/admin`** and sign in. From there you can manage:

| Section | What it controls |
| --- | --- |
| **Pages** | Page title, banner, rich-text content, and the main menu (label, dropdown group, order, show/hide). You can add new pages too. |
| **News** | Articles with cover image, category, date, and draft/published state. |
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

`npm run dev` and `npm run build` run `npm run db:setup` first. It creates the SQLite database in `data/`,
applies migrations, creates the first admin user from `ADMIN_EMAIL`/`ADMIN_PASSWORD` and loads starter content.
It is safe to run repeatedly: it only seeds content into an empty database.

> If `ADMIN_PASSWORD` isn't set, the first admin is `admin@example.com` / `changeme123`. Change it right away under **Admin → Users**.

## Tech stack

- **Next.js 16** (App Router, Cache Components). Public pages are prerendered and cached under the `content` tag.
  Every admin save calls `updateTag("content")`, so the site updates immediately.
- **Drizzle ORM + libSQL**: a local SQLite file in development, [Turso](https://turso.tech) (hosted libSQL) in production.
- **Auth**: email and password (bcrypt), with a signed, HTTP-only JWT session cookie. Every admin page and server action checks the session.
- **TipTap** rich-text editor. Its HTML is sanitized on save.
- **Uploads**: stored in [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) when `BLOB_READ_WRITE_TOKEN` is set,
  otherwise on local disk in `UPLOAD_DIR` (served from `/uploads/...`).
- **Tailwind CSS 4**.

Useful scripts: `npm run lint`, `npm run typecheck`, `npm run db:generate` (after editing `src/db/schema.ts`), `npm run db:studio`.

## Deploying

### Vercel (recommended)

1. Create a Turso database. Set `DATABASE_URL` (`libsql://…`) and `DATABASE_AUTH_TOKEN`.
2. Create a Vercel Blob store and connect it to the project. This sets `BLOB_READ_WRITE_TOKEN`.
3. Set `SESSION_SECRET` (at least 32 random characters, e.g. `openssl rand -base64 48`), `ADMIN_EMAIL`, `ADMIN_PASSWORD` and `SITE_URL`.
4. Import the repo in Vercel and deploy. The build migrates and seeds the database.

The site can't stay on GitHub Pages: the admin panel needs a server.

### Your own server / VPS

Run `npm run build && npm start`, with `SESSION_SECRET` set. Keep `data/` on persistent storage: it holds the
SQLite database and uploaded images.

## Project layout

```
src/app/(site)/        public pages (home, [slug] pages, news, gallery, team, contact…)
src/app/admin/         admin dashboard, login and server actions
src/lib/data.ts        cached public data access
src/lib/admin/         admin collection definitions (fields shown in the editor)
src/db/schema.ts       database schema
scripts/setup-db.ts    migrations, first admin and starter content
drizzle/               SQL migrations
legacy-wordpress/      the previous static WordPress export (reference only)
```
