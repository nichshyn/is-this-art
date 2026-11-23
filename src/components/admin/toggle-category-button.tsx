"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { adminToggleCategoryAction } from "@/app/actions/admin";

export function ToggleCategoryButton({
  slug,
  active,
}: {
  slug: string;
  active: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onClick() {
    setError(null);
    startTransition(async () => {
      const result = await adminToggleCategoryAction(slug);
      if (!result.ok) {
        setError("Could not update.");
        return;
      }
      router.refresh();
    });
  }

  return (
    <span className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] text-muted transition-colors hover:bg-subtle hover:text-ink disabled:opacity-50"
      >
        {pending ? (
          <Loader2 size={11} className="animate-spin" />
        ) : active ? (
          <EyeOff size={11} />
        ) : (
          <Eye size={11} />
        )}
        {active ? "Hide" : "Show"}
      </button>
      {error && <span className="text-[9.5px] text-red-500">{error}</span>}
    </span>
  );
}
