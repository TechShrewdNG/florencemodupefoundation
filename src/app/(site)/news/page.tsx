import type { Metadata } from "next";
import { getPosts } from "@/lib/data";
import { PostCard } from "@/components/site/post-card";
import { EmptyState, SystemPageHeader } from "@/components/site/system-page";

export const metadata: Metadata = { title: "News" };

export default async function NewsPage() {
  const posts = await getPosts();
  return (
    <>
      <SystemPageHeader slug="news" fallbackTitle="News" />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        {posts.length ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        ) : (
          <EmptyState>No news yet. Check back soon!</EmptyState>
        )}
      </section>
    </>
  );
}
