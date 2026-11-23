import Link from "next/link";

import { Avatar } from "@/components/ui/avatar";
import { CommentForm } from "./comment-form";
import { DeleteCommentButton } from "./delete-comment-button";
import type { Comment } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

export function CommentsSection({
  artworkId,
  comments,
  signedIn,
  currentUserId,
  isAdmin,
}: {
  artworkId: string;
  comments: Comment[];
  signedIn: boolean;
  currentUserId?: string | null;
  isAdmin?: boolean;
}) {
  return (
    <section className="mt-16 border-t border-line pt-10">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-[19px] font-semibold tracking-tight">
          Comments
          <span className="ml-2 text-[12px] font-normal text-muted">
            {comments.length}
          </span>
        </h2>
      </div>

      <div className="mt-5">
        <CommentForm artworkId={artworkId} signedIn={signedIn} />
      </div>

      {comments.length === 0 ? (
        <p className="mt-8 text-[13px] text-muted">
          No comments yet. Start the conversation.
        </p>
      ) : (
        <ul className="mt-8 space-y-6">
          {comments.map((comment) => (
            <li key={comment.id} className="group flex gap-3">
              <Avatar name={comment.username} src={comment.avatar_url} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <Link
                    href={`/u/${comment.username}`}
                    className="text-[12.5px] font-medium hover:underline"
                  >
                    @{comment.username}
                  </Link>
                  <span className="text-[10.5px] text-muted">{timeAgo(comment.created_at)}</span>
                </div>
                <p className="mt-1.5 whitespace-pre-wrap text-[13.5px] leading-relaxed text-ink/85">
                  {comment.content}
                </p>
                {(comment.user_id === currentUserId || isAdmin) && (
                  <div className="mt-1.5">
                    <DeleteCommentButton commentId={comment.id} />
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
