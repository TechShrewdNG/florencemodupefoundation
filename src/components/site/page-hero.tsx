import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Img } from "./img";

export function PageHero({
  title,
  subtitle,
  image,
  crumb,
}: {
  title: string;
  subtitle?: string;
  image?: string;
  /** Parent section label for the breadcrumb, e.g. "About". */
  crumb?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-900">
      {image && (
        <Img src={image} alt="" fill priority sizes="100vw" className="-z-20 object-cover object-center" />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-900 via-brand-900/85 to-brand-900/25" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-brand-900/60 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-brand-200">
          <Link href="/" className="transition hover:text-white">
            Home
          </Link>
          <ChevronRight className="size-3.5 opacity-60" />
          {crumb && (
            <>
              <span>{crumb}</span>
              <ChevronRight className="size-3.5 opacity-60" />
            </>
          )}
          <span className="text-white" aria-current="page">
            {title}
          </span>
        </nav>
        <h1 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-[1.05] text-white sm:text-6xl">
          {title}
        </h1>
        {subtitle && <p className="mt-4 max-w-2xl text-lg text-brand-100 sm:text-xl">{subtitle}</p>}
        <div className="mt-8 h-1 w-16 rounded-full bg-accent-500" />
      </div>
    </section>
  );
}

export function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p
      className={`inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] ${light ? "text-accent-400" : "text-accent-600"}`}
    >
      <span className="h-px w-8 bg-current" />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  center = true,
  light = false,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  center?: boolean;
  light?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <Eyebrow light={light}>{eyebrow}</Eyebrow>}
      <h2
        className={`mt-3 font-display text-3xl font-semibold leading-tight sm:text-5xl ${light ? "text-white" : "text-brand-800"}`}
      >
        {title}
      </h2>
      {intro && <p className={`mt-4 text-lg leading-relaxed ${light ? "text-brand-100" : "text-muted"}`}>{intro}</p>}
    </div>
  );
}

export function RichText({ html }: { html: string }) {
  if (!html) return null;
  return <div className="prose-content" dangerouslySetInnerHTML={{ __html: html }} />;
}
