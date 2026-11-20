export function PageSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-72 bg-brand-800/80" />
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-16">
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-5/6 rounded bg-gray-200" />
        <div className="h-4 w-4/6 rounded bg-gray-200" />
      </div>
    </div>
  );
}
