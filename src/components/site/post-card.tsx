import Link from "next/link";
import type { Post } from "@/db/schema";
import { Img } from "./img";

export function formatDate(d: string) {
  if (!d) return "";
  const date = new Date(d + "T00:00:00");
  return Number.isNaN(date.getTime())
    ? d
    : date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/news/${post.slug}`} className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[16/10] bg-brand-100">
        {post.coverImage && (
          <Img src={post.coverImage} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover" />
        )}
        {post.category && (
          <span className="absolute left-4 top-4 rounded-full bg-accent-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            {post.category}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm text-muted">{formatDate(post.publishedAt)}</p>
        <h3 className="mt-2 font-display text-xl font-semibold text-brand-800 group-hover:text-brand-600">{post.title}</h3>
        {post.excerpt && <p className="mt-3 line-clamp-3 text-muted">{post.excerpt}</p>}
        <span className="mt-auto pt-4 font-semibold text-accent-600">Read more →</span>
      </div>
    </Link>
  );
}
