import Image from "next/image";

import { cn } from "@/lib/utils";

export function ArtworkImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
  sizes = "(max-width: 1024px) 100vw, 60vw",
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      sizes={sizes}
      className={cn("h-auto max-h-full w-auto max-w-full object-contain", className)}
    />
  );
}

export function ArtworkThumb({
  src,
  alt,
  priority = false,
  className,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={cn("object-cover", className)}
    />
  );
}
