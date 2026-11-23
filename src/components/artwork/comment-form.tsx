"use client";

import { useActionState, useEffect, useRef } from "react";
import { Loader2, Send } from "lucide-react";

import { addCommentAction } from "@/app/actions/artwork";
import { Button } from "@/components/ui/button";
import { LIMITS } from "@/lib/constants";

export function CommentForm({
  artworkId,
  signedIn,
}: {
  artworkId: string;
  signedIn: boolean;
}) {
  const [state, action, pending] = useActionState(addCommentAction, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state]);

  if (!signedIn) {
    return (
      <div className="rounded-2xl border border-line bg-subtle p-5">
        <p className="text-[13px] font-medium">Join the conversation</p>
        <p className="mt-1 text-[12px] leading-relaxed text-muted">
          Sign in to leave a comment. Votes are always anonymous; comments are not.
        </p>
        <div className="mt-3 flex gap-2">
          <a
            href="/login"
            className="inline-flex h-9 items-center rounded-full bg-accent px-4 text-[12.5px] font-medium text-accent-ink"
          >
            Sign in
          </a>
          <a
            href="/signup"
            className="inline-flex h-9 items-center rounded-full border border-line bg-surface px-4 text-[12.5px] font-medium"
          >
            Create account
          </a>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} action={action} className="space-y-3">
      <input type="hidden" name="artworkId" value={artworkId} />
      <textarea
        name="content"
        required
        minLength={2}
        maxLength={LIMITS.commentLength}
        placeholder="What do you see?"
        className="field-area min-h-[104px]"
        aria-label="Your comment"
      />
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10.5px] text-muted">
          Be curious, not cruel. Comments are public.
        </p>
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          {pending ? "Posting" : "Post"}
        </Button>
      </div>
      {state.error && <p className="text-[12px] text-red-500">{state.error}</p>}
      {state.success && <p className="text-[12px] text-emerald-600 dark:text-emerald-400">{state.success}</p>}
    </form>
  );
}
