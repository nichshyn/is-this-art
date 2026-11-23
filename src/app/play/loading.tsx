export default function PlayLoading() {
  return (
    <div className="container-page pb-16 pt-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="skeleton h-3 w-24 rounded" />
        <div className="skeleton h-6 w-20 rounded-full" />
      </div>
      <div className="grid gap-8 lg:grid-cols-[1.12fr_0.88fr]">
        <div className="skeleton min-h-[48vh] rounded-3xl lg:min-h-[66vh]" />
        <div className="space-y-4 pt-4">
          <div className="skeleton h-3 w-20 rounded" />
          <div className="skeleton h-16 w-3/4 rounded-xl" />
          <div className="skeleton h-4 w-2/3 rounded" />
          <div className="mt-8 space-y-2.5">
            <div className="skeleton h-[60px] rounded-2xl" />
            <div className="skeleton h-[60px] rounded-2xl" />
            <div className="skeleton h-[60px] rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
