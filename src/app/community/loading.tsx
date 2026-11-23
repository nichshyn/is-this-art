export default function Loading() {
  return (
    <div className="container-page py-10 sm:py-14">
      <div className="max-w-2xl space-y-4">
        <div className="skeleton h-3 w-24 rounded" />
        <div className="skeleton h-16 w-3/4 rounded-2xl" />
        <div className="skeleton h-4 w-1/2 rounded" />
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <div className="skeleton aspect-[4/5] rounded-2xl" />
            <div className="skeleton h-4 w-2/3 rounded" />
            <div className="skeleton h-3 w-1/3 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
