import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  return (
    <div className="grid min-h-screen place-items-center bg-brand-900 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <h1 className="font-display text-2xl text-brand-800">Florence Modupe Foundation</h1>
        <p className="mt-1 text-sm text-gray-500">Sign in to manage the website.</p>
        <Suspense>
          <NextParam searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

async function NextParam({ searchParams }: { searchParams: PageProps<"/admin/login">["searchParams"] }) {
  const next = (await searchParams).next;
  return <LoginForm next={typeof next === "string" ? next : ""} />;
}
