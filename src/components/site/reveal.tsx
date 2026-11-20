"use client";

import { useEffect, useRef } from "react";

/**
 * Fades its children in when they scroll into view. Content is visible without JS,
 * and anything already on screen at load is never hidden.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li";
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || el.getBoundingClientRect().top < window.innerHeight) return;
    el.classList.add("reveal");
    let frame = 0;
    const check = () => {
      frame = 0;
      // Reveal once the element's top enters the lower part of the screen, or has been scrolled past.
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
        el.classList.add("is-visible");
        stop();
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    const stop = () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return stop;
  }, []);
  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={className}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
