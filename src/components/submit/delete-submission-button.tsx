"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { deleteOwnSubmissionAction } from "@/app/actions/artwork";

export function DeleteSubmissionButton({ artworkId }: { artworkId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onClick() {
    if (!window.confirm("Remove this pending submission? This cannot be undone.")) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteOwnSubmissionAction(artworkId);
      if (!result.ok) {
        setError(result.error ?? "Could not remove the submission.");
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10.5px] text-muted transition-colors hover:bg-subtle hover:text-ink disabled:opacity-50"
      >
        <Trash2 size={12} />
        {pending ? "Removing…" : "Remove"}
      </button>
      {error && <span className="text-[10px] text-red-500">{error}</span>}
    </div>
  );
}
