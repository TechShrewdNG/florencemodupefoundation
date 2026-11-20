import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center px-4 text-center">
      <div>
        <p className="font-script text-3xl text-accent-500">Oops!</p>
        <h1 className="mt-2 font-display text-4xl text-brand-800">Page not found</h1>
        <p className="mt-3 text-muted">The page you’re looking for doesn’t exist or has moved.</p>
        <Link href="/" className="mt-8 inline-block rounded-full bg-brand-600 px-7 py-3 font-semibold text-white hover:bg-brand-700">
          Back home
        </Link>
      </div>
    </div>
  );
}
