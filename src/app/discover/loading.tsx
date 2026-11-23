export default function DiscoverLoading() {
  return (
    <div className="container-page py-10 sm:py-14">
      <div className="skeleton h-3 w-24 rounded" />
      <div className="mt-5 skeleton h-16 w-2/3 max-w-xl rounded-2xl" />
      <div className="mt-4 skeleton h-4 w-1/2 max-w-md rounded" />
      <div className="mt-8 skeleton h-11 w-full rounded-full" />
      <div className="mt-4 flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton h-8 w-24 rounded-full" />
        ))}
      </div>
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div className="skeleton aspect-[4/5] rounded-2xl" />
            <div className="mt-4 skeleton h-4 w-3/4 rounded" />
            <div className="mt-2 skeleton h-3 w-1/2 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
