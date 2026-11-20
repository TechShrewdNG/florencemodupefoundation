"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { HeroSlide } from "@/db/schema";
import { Img } from "./img";

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [i, setI] = useState(0);
  const n = slides.length;

  useEffect(() => {
    if (n < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 7000);
    return () => clearInterval(t);
  }, [n]);

  if (!n) return null;

  return (
    <section className="relative isolate h-[78vh] min-h-[520px] overflow-hidden bg-brand-900" aria-roledescription="carousel">
      {slides.map((s, idx) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${idx === i ? "opacity-100" : "pointer-events-none opacity-0"}`}
          aria-hidden={idx !== i}
        >
          {s.image && (
            <Img
              src={s.image}
              alt=""
              fill
              priority={idx === 0}
              sizes="100vw"
              className={`object-cover transition-transform duration-[8000ms] ${idx === i ? "scale-105" : "scale-100"}`}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-brand-900/50 via-brand-900/45 to-brand-900/80" />
          <div className="relative mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-4 text-center">
            {s.eyebrow && <p className="font-script text-3xl text-accent-400 sm:text-4xl">{s.eyebrow}</p>}
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-white sm:text-6xl lg:text-7xl">
              {s.title}
            </h1>
            {s.text && <p className="mt-5 max-w-2xl text-lg text-brand-50">{s.text}</p>}
            {s.ctaLabel && s.ctaHref && (
              <Link
                href={s.ctaHref}
                tabIndex={idx === i ? 0 : -1}
                className="mt-8 rounded-full bg-accent-500 px-8 py-3.5 font-semibold text-white shadow-lg transition hover:bg-accent-600"
              >
                {s.ctaLabel}
              </Link>
            )}
          </div>
        </div>
      ))}
      {n > 1 && (
        <>
          <button
            type="button"
            onClick={() => setI((i - 1 + n) % n)}
            className="absolute left-3 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/25 sm:grid"
            aria-label="Previous slide"
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            onClick={() => setI((i + 1) % n)}
            className="absolute right-3 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/25 sm:grid"
            aria-label="Next slide"
          >
            <ChevronRight />
          </button>
          <div className="absolute inset-x-0 bottom-6 flex justify-center gap-2">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setI(idx)}
                className={`h-2.5 rounded-full transition-all ${idx === i ? "w-8 bg-accent-500" : "w-2.5 bg-white/60"}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
