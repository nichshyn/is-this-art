"use client";

import { Check, Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { toggleFollowAction } from "@/app/actions/artwork";
import { cn } from "@/lib/utils";

export function FollowButton({
  username,
  initialFollowing,
  signedIn,
  className,
}: {
  username: string;
  initialFollowing: boolean;
  signedIn: boolean;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [following, setFollowing] = useState(initialFollowing);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onClick() {
    if (!signedIn) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    setError(null);
    const next = !following;
    setFollowing(next);
    startTransition(async () => {
      const result = await toggleFollowAction(username);
      if (!result.ok) {
        setFollowing(!next);
        setError(result.error ?? "Не удалось обновить.");
      }
    });
  }

  return (
    <div className={cn("inline-flex flex-col items-start gap-1", className)}>
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className={cn(
          "inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-[12.5px] font-medium transition-all",
          following
            ? "border border-line bg-surface text-ink hover:bg-subtle"
            : "bg-accent text-accent-ink hover:opacity-90",
        )}
      >
        {following ? <Check size={14} /> : <Plus size={14} />}
        {following ? "Вы подписаны" : "Подписаться"}
      </button>
      {error && <span className="text-[10.5px] text-red-500">{error}</span>}
    </div>
  );
}
