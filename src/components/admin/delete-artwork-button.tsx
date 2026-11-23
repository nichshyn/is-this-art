"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { adminDeleteArtworkAction } from "@/app/actions/admin";

export function DeleteArtworkButton({
  artworkId,
  title,
}: {
  artworkId: string;
  title: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onClick() {
    if (
      !window.confirm(
        `Delete “${title}”? Votes, comments and likes for this work will also be removed.`,
      )
    ) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await adminDeleteArtworkAction(artworkId);
      if (!result.ok) {
        setError(result.error ?? "Could not delete.");
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
        className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10.5px] text-muted transition-colors hover:bg-red-500/10 hover:text-red-600 disabled:opacity-50"
      >
        <Trash2 size={11} />
        {pending ? "Deleting…" : "Delete"}
      </button>
      {error && <span className="text-[9.5px] text-red-500">{error}</span>}
    </span>
  );
}
