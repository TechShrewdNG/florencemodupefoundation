import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getPost, getPosts } from "@/lib/data";
import { Img } from "@/components/site/img";
import { RichText } from "@/components/site/page-hero";
import { formatDate } from "@/components/site/post-card";
import { PageSkeleton } from "@/components/site/skeleton";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/news/[slug]">): Promise<Metadata> {
  const post = await getPost((await params).slug);
  return post
    ? { title: post.title, description: post.excerpt || undefined, openGraph: post.coverImage ? { images: [post.coverImage] } : undefined }
    : {};
}

async function Article({ params }: { params: PageProps<"/news/[slug]">["params"] }) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  return (
    <article>
      <header className="bg-brand-800 px-4 pb-32 pt-16 text-center sm:pt-20">
        <p className="text-brand-200">
          {post.category && <span className="font-semibold text-accent-400">{post.category} · </span>}
          {formatDate(post.publishedAt)}
        </p>
        <h1 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-semibold text-white sm:text-5xl">{post.title}</h1>
      </header>
      <div className="mx-auto -mt-24 max-w-4xl px-4">
        {post.coverImage && (
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl shadow-xl">
            <Img src={post.coverImage} alt="" fill priority sizes="(min-width: 896px) 896px, 100vw" className="object-cover" />
          </div>
        )}
      </div>
      <div className="mx-auto max-w-3xl px-4 py-14">
        <RichText html={post.body} />
        <Link href="/news" className="mt-12 inline-block font-semibold text-brand-600 hover:text-accent-600">
          ← All news
        </Link>
      </div>
    </article>
  );
}

export default function Page(props: PageProps<"/news/[slug]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Article params={props.params} />
    </Suspense>
  );
}
