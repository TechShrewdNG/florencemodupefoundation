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
  const date = formatDate(post.publishedAt);
  return (
    <Link
      href={`/news/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-brand-100">
        {post.coverImage && (
          <Img
            src={post.coverImage}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        )}
        {post.category && (
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700 backdrop-blur">
            {post.category}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        {date && <p className="mb-2 text-sm text-muted">{date}</p>}
        <h3 className="font-display text-xl font-semibold leading-snug text-brand-800 transition group-hover:text-brand-600">
          {post.title}
        </h3>
        {post.excerpt && <p className="mt-3 line-clamp-3 leading-relaxed text-muted">{post.excerpt}</p>}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-accent-600">
          Read more <span className="transition group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  );
}
