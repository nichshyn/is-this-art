export default function Loading() {
  return (
    <div className="container-page py-10 sm:py-12">
      <div className="grid gap-10 lg:grid-cols-[340px_minmax(0,1fr)]">
        <div className="skeleton h-96 rounded-3xl" />
        <div className="space-y-4">
          <div className="skeleton h-10 w-1/2 rounded-xl" />
          <div className="grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="skeleton aspect-[4/5] rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
