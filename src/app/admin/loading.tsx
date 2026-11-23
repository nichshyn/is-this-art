export default function Loading() {
  return (
    <div className="container-page py-8 sm:py-10">
      <div className="skeleton h-10 w-80 max-w-full rounded-xl" />
      <div className="mt-6 skeleton h-10 w-full rounded-full" />
      <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="skeleton h-28 rounded-2xl" />
        ))}
      </div>
      <div className="mt-4 skeleton h-64 rounded-2xl" />
    </div>
  );
}
