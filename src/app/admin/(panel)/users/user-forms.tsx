"use client";

import { useActionState, useEffect, useRef } from "react";
import { changePassword, createUser, type ActionState } from "@/app/admin/actions";
import { btn, inputClass } from "@/components/admin/ui";

function useResetOnSuccess(state: ActionState) {
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);
  return ref;
}

function Status({ state }: { state: ActionState }) {
  if (!state) return null;
  return <p className={`text-sm ${state.ok ? "text-emerald-700" : "text-red-600"}`}>{state.message}</p>;
}

export function AddUserForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(createUser, null);
  const ref = useResetOnSuccess(state);
  return (
    <form ref={ref} action={action} className="mt-4 space-y-3">
      <input name="name" placeholder="Name" required className={inputClass} />
      <input name="email" type="email" placeholder="Email" required className={inputClass} />
      <input name="password" type="password" placeholder="Temporary password (10+ characters)" required minLength={10} className={inputClass} autoComplete="new-password" />
      <Status state={state} />
      <button className={btn.primary} disabled={pending}>
        {pending ? "Adding…" : "Add user"}
      </button>
    </form>
  );
}

export function ChangePasswordForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(changePassword, null);
  const ref = useResetOnSuccess(state);
  return (
    <form ref={ref} action={action} className="mt-4 space-y-3">
      <input name="current" type="password" placeholder="Current password" required className={inputClass} autoComplete="current-password" />
      <input name="next" type="password" placeholder="New password (10+ characters)" required minLength={10} className={inputClass} autoComplete="new-password" />
      <input name="confirm" type="password" placeholder="Confirm new password" required className={inputClass} autoComplete="new-password" />
      <Status state={state} />
      <button className={btn.primary} disabled={pending}>
        {pending ? "Saving…" : "Update password"}
      </button>
    </form>
  );
}
