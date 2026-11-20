import { Img } from "./img";

export function PageHero({ title, subtitle, image }: { title: string; subtitle?: string; image?: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-800">
      {image && <Img src={image} alt="" fill priority sizes="100vw" className="-z-10 object-cover opacity-35" />}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-900/90 via-brand-900/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:py-28">
        <h1 className="font-display text-4xl font-semibold text-white sm:text-6xl">{title}</h1>
        {subtitle && <p className="mx-auto mt-4 max-w-2xl font-script text-2xl text-accent-400 sm:text-3xl">{subtitle}</p>}
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  center = true,
  light = false,
}: {
  eyebrow?: string;
  title: string;
  center?: boolean;
  light?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : ""}>
      {eyebrow && <p className="font-script text-2xl text-accent-500">{eyebrow}</p>}
      <h2 className={`mt-1 font-display text-3xl font-semibold sm:text-4xl ${light ? "text-white" : "text-brand-800"}`}>
        {title}
      </h2>
    </div>
  );
}

export function RichText({ html }: { html: string }) {
  if (!html) return null;
  return <div className="prose-content" dangerouslySetInnerHTML={{ __html: html }} />;
}
