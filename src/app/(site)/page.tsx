import Link from "next/link";
import { ArrowRight, Eye, HandHeart, Target } from "lucide-react";
import { getCoreValues, getGallery, getHeroSlides, getPosts, getSettings } from "@/lib/data";
import { HeroCarousel } from "@/components/site/hero-carousel";
import { Img } from "@/components/site/img";
import { SectionHeading } from "@/components/site/page-hero";
import { PostCard } from "@/components/site/post-card";
import { ValueCard } from "@/components/site/value-card";

export default async function HomePage() {
  const [s, slides, values, gallery, posts] = await Promise.all([
    getSettings(),
    getHeroSlides(),
    getCoreValues(),
    getGallery(),
    getPosts(3),
  ]);

  return (
    <>
      <HeroCarousel slides={slides} />

      {values.length > 0 && (
        <section className="relative z-10 mx-auto -mt-16 max-w-7xl px-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <ValueCard key={v.id} value={v} index={i} />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-24 lg:grid-cols-2">
        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
            <Img src={s.aboutImage} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="absolute -bottom-6 -right-2 hidden rounded-2xl bg-accent-500 px-6 py-5 text-white shadow-lg sm:block">
            <HandHeart className="size-8" />
            <p className="mt-2 font-display text-xl">Every child matters</p>
          </div>
        </div>
        <div>
          <SectionHeading eyebrow={s.aboutEyebrow} title={s.aboutHeading} center={false} />
          <p className="mt-6 text-lg leading-relaxed text-muted">{s.aboutText}</p>
          {s.stats.length > 0 && (
            <dl className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3">
              {s.stats.map((st) => (
                <div key={st.label}>
                  <dt className="text-sm text-muted">{st.label}</dt>
                  <dd className="font-display text-3xl font-semibold text-brand-700">{st.value}</dd>
                </div>
              ))}
            </dl>
          )}
          <Link
            href="/who-we-are"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-600 px-7 py-3 font-semibold text-white transition hover:bg-brand-700"
          >
            Learn more about us <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <section className="bg-brand-800 py-24">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading eyebrow="Our" title="Statements" light />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              { icon: Eye, title: "Vision Statement", text: s.vision },
              { icon: Target, title: "Mission Statement", text: s.mission },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-3xl bg-white/5 p-8 ring-1 ring-white/10 sm:p-10">
                <div className="grid size-14 place-items-center rounded-2xl bg-accent-500 text-white">
                  <Icon className="size-7" />
                </div>
                <h3 className="mt-6 font-display text-2xl text-white">{title}</h3>
                <p className="mt-3 text-lg leading-relaxed text-brand-100">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-24">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Gallery" title="Moments from our outreaches" center={false} />
            <Link href="/gallery" className="inline-flex items-center gap-2 font-semibold text-brand-600 hover:text-accent-600">
              View all <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-10 grid auto-rows-[160px] grid-cols-2 gap-3 sm:auto-rows-[200px] md:grid-cols-4">
            {gallery.slice(0, 5).map((g, i) => (
              <div
                key={g.id}
                className={`relative overflow-hidden rounded-2xl ${i === 0 ? "col-span-2 row-span-2" : ""}`}
              >
                <Img
                  src={g.src}
                  alt={g.caption || ""}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover transition duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {posts.length > 0 && (
        <section className="bg-cream py-24">
          <div className="mx-auto max-w-7xl px-4">
            <SectionHeading eyebrow="Latest" title="News & Updates" />
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-24">
        <div className="relative isolate overflow-hidden rounded-3xl bg-accent-500 px-6 py-16 text-center sm:px-16">
          <h2 className="font-display text-3xl font-semibold text-white sm:text-5xl">{s.ctaHeading}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">{s.ctaText}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={s.ctaButtonHref} className="rounded-full bg-white px-8 py-3.5 font-semibold text-accent-600 transition hover:bg-brand-50">
              {s.ctaButtonLabel}
            </Link>
            <Link href="/contact" className="rounded-full px-8 py-3.5 font-semibold text-white ring-2 ring-white/70 transition hover:bg-white/10">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
