"use client";

import { Heart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { toggleLikeAction } from "@/app/actions/artwork";
import { cn } from "@/lib/utils";

export function LikeButton({
  artworkId,
  initialLiked,
  initialCount,
  signedIn,
  compact = false,
}: {
  artworkId: string;
  initialLiked: boolean;
  initialCount: number;
  signedIn: boolean;
  compact?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onClick() {
    if (!signedIn) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    setError(null);
    const next = !liked;
    setLiked(next);
    setCount((c) => Math.max(0, c + (next ? 1 : -1)));
    startTransition(async () => {
      const result = await toggleLikeAction(artworkId);
      if (!result.ok) {
        setLiked(!next);
        setCount((c) => Math.max(0, c + (next ? -1 : 1)));
        setError(result.error ?? "Could not update.");
      }
    });
  }

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        aria-pressed={liked}
        aria-label={liked ? "Remove like" : "Like this artwork"}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-2 text-[12.5px] transition-all hover:bg-subtle disabled:opacity-60",
          liked && "border-ink/20 bg-subtle",
        )}
      >
        <Heart
          size={15}
          strokeWidth={1.8}
          className={cn("transition-colors", liked && "fill-ink text-ink")}
        />
        <span className="tabular-nums">{count}</span>
        {!compact && <span className="text-muted">{liked ? "Liked" : "Like"}</span>}
      </button>
      {error && <span className="text-[10.5px] text-red-500">{error}</span>}
    </div>
  );
}
