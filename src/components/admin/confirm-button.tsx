"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";

/** Runs a server action after a confirm() prompt. */
export function ConfirmButton({
  action,
  confirm,
  children,
  className,
}: {
  action: () => Promise<unknown>;
  confirm: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      className={className}
      disabled={pending}
      onClick={() => {
        if (window.confirm(confirm)) start(async () => void (await action()));
      }}
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : null}
      {children}
    </button>
  );
}
