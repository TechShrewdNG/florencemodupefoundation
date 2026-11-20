"use client";

import { useActionState } from "react";
import { subscribe, type FormState } from "@/app/(site)/actions";

export function NewsletterForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(subscribe, null);
  return (
    <form action={action} className="mt-5">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="flex overflow-hidden rounded-full bg-white/10 ring-1 ring-white/15 focus-within:ring-accent-400">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          name="email"
          required
          placeholder="Your email"
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-white placeholder:text-brand-200 focus:outline-none"
        />
        <button
          disabled={pending}
          className="bg-accent-500 px-5 font-semibold text-white transition hover:bg-accent-600 disabled:opacity-60"
        >
          {pending ? "…" : "Join"}
        </button>
      </div>
      {state && (
        <p className={`mt-2 text-sm ${state.ok ? "text-brand-200" : "text-accent-400"}`} role="status">
          {state.message}
        </p>
      )}
    </form>
  );
}
