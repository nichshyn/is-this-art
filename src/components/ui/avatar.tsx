import { avatarTone, cn, initials } from "@/lib/utils";

const sizeMap = {
  xs: "h-6 w-6 text-[9px]",
  sm: "h-8 w-8 text-[11px]",
  md: "h-10 w-10 text-[13px]",
  lg: "h-14 w-14 text-[17px]",
  xl: "h-24 w-24 text-[28px]",
};

export function Avatar({
  name,
  src,
  size = "md",
  className,
}: {
  name: string;
  src?: string | null;
  size?: keyof typeof sizeMap;
  className?: string;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        referrerPolicy="no-referrer"
        className={cn(
          "shrink-0 rounded-full object-cover ring-1 ring-black/5 dark:ring-white/10",
          sizeMap[size],
          className,
        )}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center rounded-full font-semibold tracking-wide",
        sizeMap[size],
        avatarTone(name),
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
