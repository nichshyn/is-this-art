"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Ban, Loader2, ShieldCheck } from "lucide-react";

import { adminToggleBlockAction } from "@/app/actions/admin";

export function BlockUserButton({
  userId,
  username,
  blocked,
  disabled,
}: {
  userId: string;
  username: string;
  blocked: boolean;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onClick() {
    if (
      !blocked &&
      !window.confirm(`Suspend @${username}? They will not be able to vote or comment.`)
    ) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await adminToggleBlockAction(userId);
      if (!result.ok) {
        setError(result.error ?? "Could not update.");
        return;
      }
      router.refresh();
    });
  }

  if (disabled) {
    return <span className="text-[10px] text-muted">—</span>;
  }

  return (
    <span className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] transition-colors disabled:opacity-50 ${
          blocked
            ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/15 dark:text-emerald-400"
            : "text-muted hover:bg-red-500/10 hover:text-red-600"
        }`}
      >
        {pending ? (
          <Loader2 size={11} className="animate-spin" />
        ) : blocked ? (
          <ShieldCheck size={11} />
        ) : (
          <Ban size={11} />
        )}
        {blocked ? "Restore" : "Suspend"}
      </button>
      {error && <span className="text-[9.5px] text-red-500">{error}</span>}
    </span>
  );
}
