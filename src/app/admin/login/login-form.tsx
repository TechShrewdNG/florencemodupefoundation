"use client";

import { useActionState } from "react";
import { login, type ActionState } from "../actions";
import { btn, inputClass } from "@/components/admin/ui";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(login, null);
  return (
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="next" value={next} />
      <label className="block space-y-1.5 text-sm font-medium">
        Email
        <input name="email" type="email" required autoComplete="username" className={inputClass} />
      </label>
      <label className="block space-y-1.5 text-sm font-medium">
        Password
        <input name="password" type="password" required autoComplete="current-password" className={inputClass} />
      </label>
      {state && !state.ok && (
        <p className="text-sm text-red-600" role="alert">
          {state.message}
        </p>
      )}
      <button className={`${btn.primary} w-full py-2.5`} disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
