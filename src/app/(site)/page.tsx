import Link from "next/link";
import {
  ArrowRight, BookOpen, Eye, GraduationCap, HandHeart, School, Sparkles, Target,
} from "lucide-react";
import { getCoreValues, getGallery, getHeroSlides, getMilestones, getPage, getPosts, getSettings } from "@/lib/data";
import { HeroCarousel } from "@/components/site/hero-carousel";
import { Img } from "@/components/site/img";
import { Eyebrow, SectionHeading } from "@/components/site/page-hero";
import { PostCard } from "@/components/site/post-card";
import { Reveal } from "@/components/site/reveal";
import { ValueCard } from "@/components/site/value-card";

const programmeIcons = [GraduationCap, School, BookOpen, Sparkles];

export default async function HomePage() {
  const [s, slides, values, programmes, gallery, posts, founderPage] = await Promise.all([
    getSettings(),
    getHeroSlides(),
    getCoreValues(),
    getMilestones(),
    getGallery(),
    getPosts(3),
    getPage("from-our-founder"),
  ]);

  return (
    <>
      <HeroCarousel slides={slides} />

      {values.length > 0 && (
        <section className="relative z-10 mx-auto -mt-20 max-w-7xl px-4">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {values.map((v, i) => (
              <ValueCard key={v.id} value={v} index={i} compact />
            ))}
          </div>
        </section>
      )}

      {/* About */}
      <section className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-24 sm:py-32 lg:grid-cols-2">
        <Reveal className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-2xl">
            <Img src={s.aboutImage} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="absolute -bottom-8 right-4 hidden max-w-[15rem] rounded-2xl bg-white p-5 shadow-xl ring-1 ring-gray-100 sm:block">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-accent-500 text-white">
                <HandHeart className="size-6" />
              </span>
              <p className="font-display text-lg leading-tight text-brand-800">Every child has a right to education</p>
            </div>
          </div>
          <div className="absolute -left-4 -top-4 -z-10 hidden size-40 rounded-[2rem] bg-brand-100 sm:block" />
        </Reveal>
        <Reveal delay={100}>
          <SectionHeading eyebrow={s.aboutEyebrow} title={s.aboutHeading} center={false} />
          <p className="mt-6 text-lg leading-relaxed text-muted">{s.aboutText}</p>
          {s.stats.length > 0 && (
            <dl className="mt-10 grid grid-cols-3 divide-x divide-gray-200 rounded-2xl bg-cream py-5">
              {s.stats.map((st) => (
                <div key={st.label} className="px-4 text-center sm:px-6">
                  <dd className="font-display text-3xl font-semibold text-brand-700 sm:text-4xl">{st.value}</dd>
                  <dt className="mt-1 text-xs leading-snug text-muted sm:text-sm">{st.label}</dt>
                </div>
              ))}
            </dl>
          )}
          <Link
            href="/who-we-are"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-brand-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700"
          >
            Learn more about us <ArrowRight className="size-4" />
          </Link>
        </Reveal>
      </section>

      {/* What we do */}
      {programmes.length > 0 && (
        <section className="bg-cream py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <SectionHeading
                eyebrow="What we do"
                title="Four ways we open doors"
                intro="Our approach combines education for children with skills and support for the women who raise them."
                center={false}
              />
              <Link href="/our-approach" className="inline-flex shrink-0 items-center gap-2 font-semibold text-brand-600 hover:text-accent-600">
                Our approach <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {programmes.map((m, i) => {
                const Icon = programmeIcons[i % programmeIcons.length];
                return (
                  <Reveal key={m.id} delay={i * 80} className="h-full">
                    <div className="group flex h-full flex-col rounded-3xl bg-white p-7 shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                      <span className="grid size-14 place-items-center rounded-2xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                        <Icon className="size-7" />
                      </span>
                      <h3 className="mt-6 font-display text-xl font-semibold leading-snug text-brand-800">{m.title}</h3>
                      <p className="mt-3 line-clamp-4 text-[15px] leading-relaxed text-muted">{m.description}</p>
                      {m.date && (
                        <p className="mt-auto pt-6">
                          <span className="inline-block rounded-full bg-accent-500/10 px-3 py-1 text-xs font-bold text-accent-600">
                            Goal: {m.date}
                          </span>
                        </p>
                      )}
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Vision & mission */}
      <section className="relative overflow-hidden bg-brand-800 py-24 sm:py-32">
        <div className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-brand-700/60" />
        <div className="pointer-events-none absolute -bottom-40 -left-20 size-80 rounded-full bg-brand-900/60" />
        <div className="relative mx-auto max-w-7xl px-4">
          <SectionHeading eyebrow="Our statements" title="Where we are going" light />
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {[
              { icon: Eye, title: "Our Vision", text: s.vision },
              { icon: Target, title: "Our Mission", text: s.mission },
            ].map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 100}>
                <div className="h-full rounded-3xl bg-white/[0.06] p-8 ring-1 ring-white/10 backdrop-blur sm:p-10">
                  <div className="grid size-14 place-items-center rounded-2xl bg-accent-500 text-white shadow-lg shadow-accent-500/30">
                    <Icon className="size-7" />
                  </div>
                  <h3 className="mt-6 font-display text-2xl text-white">{title}</h3>
                  <p className="mt-3 text-lg leading-relaxed text-brand-100">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Founder's quote */}
      {s.founderQuote && (
        <section className="mx-auto max-w-6xl px-4 py-24 sm:py-32">
          <Reveal className="grid items-center gap-10 md:grid-cols-[auto_1fr] md:gap-16">
            {founderPage?.portrait ? (
              <div className="relative mx-auto size-48 overflow-hidden rounded-full shadow-xl ring-8 ring-brand-50 md:size-60">
                <Img src={founderPage.portrait} alt={s.founderName} fill sizes="240px" className="object-cover" />
              </div>
            ) : (
              <div className="mx-auto font-display text-[10rem] leading-[0.6] text-accent-500 md:text-[14rem]" aria-hidden>
                “
              </div>
            )}
            <figure>
              <Eyebrow>From our founder</Eyebrow>
              <blockquote className="mt-5 font-display text-2xl leading-snug text-brand-800 sm:text-4xl">
                “{s.founderQuote}”
              </blockquote>
              <figcaption className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                <span className="font-semibold text-ink">{s.founderName}</span>
                <Link href="/from-our-founder" className="inline-flex items-center gap-1.5 font-semibold text-accent-600 hover:text-accent-500">
                  Read the full letter <ArrowRight className="size-4" />
                </Link>
              </figcaption>
            </figure>
          </Reveal>
        </section>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="bg-cream py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <SectionHeading eyebrow="Gallery" title="Moments from our outreaches" center={false} />
              <Link href="/gallery" className="inline-flex shrink-0 items-center gap-2 font-semibold text-brand-600 hover:text-accent-600">
                View all photos <ArrowRight className="size-4" />
              </Link>
            </div>
            <Reveal className="mt-12 grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[210px] md:grid-cols-4">
              {gallery.slice(0, 5).map((g, i) => (
                <Link
                  href="/gallery"
                  key={g.id}
                  className={`group relative overflow-hidden rounded-2xl ${i === 0 ? "col-span-2 row-span-2" : ""}`}
                >
                  <Img
                    src={g.src}
                    alt={g.caption || "Photo from a Florence Modupe Foundation outreach"}
                    fill
                    sizes={i === 0 ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </Link>
              ))}
            </Reveal>
          </div>
        </section>
      )}

      {/* News */}
      {posts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-24 sm:py-32">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Latest" title="News & outreach" center={false} />
            <Link href="/news" className="inline-flex shrink-0 items-center gap-2 font-semibold text-brand-600 hover:text-accent-600">
              All news <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <Reveal key={p.id} delay={i * 80} className="h-full">
                <PostCard post={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Call to action */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:pb-32">
        <Reveal className="relative isolate overflow-hidden rounded-[2rem] bg-accent-500 px-6 py-16 text-center sm:px-16 sm:py-20">
          <div className="pointer-events-none absolute -left-16 -top-16 -z-10 size-64 rounded-full bg-accent-400/60" />
          <div className="pointer-events-none absolute -bottom-24 -right-10 -z-10 size-80 rounded-full bg-accent-600/60" />
          <h2 className="font-display text-3xl font-semibold text-white sm:text-5xl">{s.ctaHeading}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">{s.ctaText}</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              href={s.ctaButtonHref}
              className="rounded-full bg-white px-8 py-3.5 font-semibold text-accent-600 shadow-lg transition hover:bg-brand-50"
            >
              {s.ctaButtonLabel}
            </Link>
            <Link href="/contact" className="rounded-full px-8 py-3.5 font-semibold text-white ring-2 ring-white/70 transition hover:bg-white/10">
              Contact us
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
