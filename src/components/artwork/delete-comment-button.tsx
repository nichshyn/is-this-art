"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { deleteCommentAction } from "@/app/actions/artwork";

export function DeleteCommentButton({ commentId }: { commentId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await deleteCommentAction(commentId);
          router.refresh();
        })
      }
      className="inline-flex items-center gap-1 text-[10.5px] text-muted opacity-0 transition-opacity hover:text-red-500 focus:opacity-100 group-hover:opacity-100 disabled:opacity-50"
      aria-label="Удалить комментарий"
    >
      <Trash2 size={12} />
      Удалить
    </button>
  );
}
