"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  FileText, GalleryHorizontalEnd, Gem, Images, LayoutDashboard, LogOut, Mail, Menu, Milestone, Newspaper,
  Settings, ExternalLink, UserCog, Users, X, AtSign,
} from "lucide-react";
import { logout } from "@/app/admin/actions";

const groups = [
  {
    label: "",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/pages", label: "Pages", icon: FileText },
      { href: "/admin/posts", label: "News", icon: Newspaper },
      { href: "/admin/slides", label: "Home Slides", icon: GalleryHorizontalEnd },
      { href: "/admin/values", label: "Core Values", icon: Gem },
      { href: "/admin/team", label: "Team", icon: Users },
      { href: "/admin/milestones", label: "Milestones", icon: Milestone },
      { href: "/admin/gallery", label: "Gallery", icon: Images },
    ],
  },
  {
    label: "Audience",
    items: [
      { href: "/admin/messages", label: "Messages", icon: Mail },
      { href: "/admin/subscribers", label: "Subscribers", icon: AtSign },
    ],
  },
  {
    label: "Admin",
    items: [
      { href: "/admin/settings", label: "Site Settings", icon: Settings },
      { href: "/admin/users", label: "Users", icon: UserCog },
    ],
  },
];

export function Sidebar({ user, unread }: { user: { name: string; email: string }; unread: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const active = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));

  const nav = (
    <nav className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-5">
        <Link href="/admin" className="font-bold leading-tight text-white">
          Florence Modupe
          <span className="block text-xs font-medium uppercase tracking-widest text-brand-200">Admin</span>
        </Link>
        <button className="text-brand-100 lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
          <X className="size-5" />
        </button>
      </div>
      <div className="flex-1 space-y-6 overflow-y-auto px-3 pb-6">
        {groups.map((g) => (
          <div key={g.label || "main"}>
            {g.label && <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-brand-300/80">{g.label}</p>}
            <ul className="space-y-0.5">
              {g.items.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${active(href) ? "bg-white/15 text-white" : "text-brand-100 hover:bg-white/10 hover:text-white"}`}
                  >
                    <Icon className="size-4" />
                    <span className="flex-1">{label}</span>
                    {href === "/admin/messages" && unread > 0 && (
                      <span className="rounded-full bg-accent-500 px-2 py-0.5 text-xs font-bold text-white">{unread}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 p-4">
        <Link href="/" target="_blank" className="mb-3 flex items-center gap-2 text-sm text-brand-100 hover:text-white">
          <ExternalLink className="size-4" /> View website
        </Link>
        <p className="truncate text-sm font-medium text-white">{user.name}</p>
        <p className="truncate text-xs text-brand-200">{user.email}</p>
        <form action={logout} className="mt-3">
          <button className="flex items-center gap-2 text-sm text-brand-100 hover:text-white">
            <LogOut className="size-4" /> Sign out
          </button>
        </form>
      </div>
    </nav>
  );

  return (
    <>
      <div className="sticky top-0 z-30 flex items-center justify-between bg-brand-900 px-4 py-3 lg:hidden">
        <span className="font-bold text-white">FMF Admin</span>
        <button className="text-white" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu className="size-6" />
        </button>
      </div>
      <aside className="fixed inset-y-0 left-0 hidden w-64 bg-brand-900 lg:block">{nav}</aside>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-brand-900">{nav}</aside>
        </div>
      )}
    </>
  );
}
