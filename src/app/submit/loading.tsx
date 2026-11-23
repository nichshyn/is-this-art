export default function Loading() {
  return (
    <div className="container-page py-10 sm:py-14">
      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <div className="skeleton h-3 w-20 rounded" />
          <div className="skeleton h-20 w-2/3 rounded-2xl" />
          <div className="skeleton h-4 w-1/2 rounded" />
          <div className="skeleton h-24 rounded-2xl" />
          <div className="skeleton h-24 rounded-2xl" />
          <div className="skeleton h-24 rounded-2xl" />
        </div>
        <div className="skeleton h-96 rounded-2xl" />
      </div>
    </div>
  );
}
