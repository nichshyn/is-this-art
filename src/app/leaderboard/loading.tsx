export default function Loading() {
  return (
    <div className="container-page py-10 sm:py-14">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-4">
          <div className="skeleton h-3 w-24 rounded" />
          <div className="skeleton h-16 w-[28rem] max-w-full rounded-2xl" />
        </div>
        <div className="skeleton h-10 w-64 rounded-full" />
      </div>
      <div className="mt-9 grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="skeleton h-52 rounded-3xl" />
        ))}
      </div>
      <div className="mt-4 space-y-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="skeleton h-14 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
