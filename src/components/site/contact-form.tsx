"use client";

import { useActionState } from "react";
import { sendMessage, type FormState } from "@/app/(site)/actions";

const input =
  "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100";

export function ContactForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(sendMessage, null);
  if (state?.ok) {
    return (
      <div className="rounded-2xl bg-brand-50 p-8 text-center">
        <p className="font-display text-2xl text-brand-800">Message sent</p>
        <p className="mt-2 text-muted">{state.message}</p>
      </div>
    );
  }
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <label className="grid gap-1.5 text-sm font-medium">
        Name *
        <input name="name" required className={input} />
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        Email *
        <input name="email" type="email" required className={input} />
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        Phone
        <input name="phone" type="tel" className={input} />
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        Subject
        <input name="subject" className={input} />
      </label>
      <label className="grid gap-1.5 text-sm font-medium sm:col-span-2">
        Message *
        <textarea name="body" required rows={6} className={input} />
      </label>
      {state && !state.ok && (
        <p className="text-sm text-red-600 sm:col-span-2" role="alert">
          {state.message}
        </p>
      )}
      <div className="sm:col-span-2">
        <button
          disabled={pending}
          className="rounded-full bg-brand-600 px-8 py-3 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
