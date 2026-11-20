"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import type { NavEntry } from "@/lib/data";

export function NavMenu({ nav, cta }: { nav: NavEntry[]; cta: { label: string; href: string } }) {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  // Close the mobile menu when a link inside it is followed.
  const closeOnLink = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("a")) {
      setOpen(false);
      setOpenGroup(null);
    }
  };

  return (
    <>
      <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
        <Link
          href="/"
          className="rounded-md px-3 py-2 text-[15px] font-medium transition hover:text-brand-600"
        >
          Home
        </Link>
        {nav.map((entry) =>
          "children" in entry ? (
            <div key={entry.label} className="group relative">
              <button
                type="button"
                className="flex items-center gap-1 rounded-md px-3 py-2 text-[15px] font-medium transition hover:text-brand-600"
                aria-haspopup="true"
              >
                {entry.label} <ChevronDown className="size-4 transition group-hover:rotate-180" />
              </button>
              <div className="invisible absolute left-0 top-full z-50 min-w-56 translate-y-1 pt-2 opacity-0 transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <div className="overflow-hidden rounded-xl border border-gray-100 bg-white py-2 shadow-xl">
                  {entry.children.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      className="block px-4 py-2 text-[15px] transition hover:bg-brand-50 hover:text-brand-700"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <Link
              key={entry.href}
              href={entry.href}
              className="rounded-md px-3 py-2 text-[15px] font-medium transition hover:text-brand-600"
            >
              {entry.label}
            </Link>
          ),
        )}
        {cta.label && (
          <Link
            href={cta.href}
            className="ml-3 rounded-full bg-accent-500 px-5 py-2.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-accent-600"
          >
            {cta.label}
          </Link>
        )}
      </nav>

      <button
        type="button"
        className="grid size-11 place-items-center rounded-md text-brand-800 lg:hidden"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>

      {open && (
        <div onClick={closeOnLink} className="absolute inset-x-0 top-full max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-gray-100 bg-white px-4 pb-6 shadow-lg lg:hidden">
          <Link href="/" className="block border-b border-gray-100 py-3 font-medium">
            Home
          </Link>
          {nav.map((entry) =>
            "children" in entry ? (
              <div key={entry.label} className="border-b border-gray-100">
                <button
                  type="button"
                  className="flex w-full items-center justify-between py-3 font-medium"
                  onClick={() => setOpenGroup((g) => (g === entry.label ? null : entry.label))}
                  aria-expanded={openGroup === entry.label}
                >
                  {entry.label}
                  <ChevronDown className={`size-4 transition ${openGroup === entry.label ? "rotate-180" : ""}`} />
                </button>
                {openGroup === entry.label && (
                  <div className="pb-2 pl-4">
                    {entry.children.map((c) => (
                      <Link key={c.href} href={c.href} className="block py-2 text-muted">
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={entry.href} href={entry.href} className="block border-b border-gray-100 py-3 font-medium">
                {entry.label}
              </Link>
            ),
          )}
          {cta.label && (
            <Link
              href={cta.href}
              className="mt-5 block rounded-full bg-accent-500 px-5 py-3 text-center font-semibold text-white"
            >
              {cta.label}
            </Link>
          )}
        </div>
      )}
    </>
  );
}
