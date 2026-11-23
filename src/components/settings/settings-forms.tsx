"use client";

import { AlertCircle, Check, Loader2 } from "lucide-react";
import { useActionState } from "react";

import {
  changePasswordAction,
  deleteAccountAction,
  updateProfileAction,
  type FormState,
} from "@/app/actions/auth";
import { buttonClasses } from "@/components/ui/button";
import { LIMITS } from "@/lib/constants";

const initial: FormState = {};

function Message({ state }: { state: FormState }) {
  if (state.error) {
    return (
      <p className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-3.5 py-2.5 text-[12px] text-red-600 dark:text-red-400">
        <AlertCircle size={14} className="mt-0.5 shrink-0" />
        {state.error}
      </p>
    );
  }
  if (state.success) {
    return (
      <p className="flex items-start gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3.5 py-2.5 text-[12px] text-emerald-700 dark:text-emerald-400">
        <Check size={14} className="mt-0.5 shrink-0" />
        {state.success}
      </p>
    );
  }
  return null;
}

export function ProfileForm({
  bio,
  avatarUrl,
}: {
  bio: string | null;
  avatarUrl: string | null;
}) {
  const [state, action, pending] = useActionState(updateProfileAction, initial);
  return (
    <form action={action} className="space-y-5">
      <div>
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <label htmlFor="bio" className="text-[12px] font-medium">
            Bio
          </label>
          <span className="text-[10px] text-muted">Up to {LIMITS.bioLength} characters</span>
        </div>
        <textarea
          id="bio"
          name="bio"
          defaultValue={bio ?? ""}
          maxLength={LIMITS.bioLength}
          rows={3}
          placeholder="A sentence about how you look."
          className="field-area"
        />
      </div>
      <div>
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <label htmlFor="avatarUrl" className="text-[12px] font-medium">
            Avatar image URL
          </label>
          <span className="text-[10px] text-muted">Optional · https only</span>
        </div>
        <input
          id="avatarUrl"
          name="avatarUrl"
          type="url"
          defaultValue={avatarUrl ?? ""}
          placeholder="https://…"
          className="field"
        />
      </div>
      <Message state={state} />
      <button type="submit" disabled={pending} className={buttonClasses({ size: "md" })}>
        {pending && <Loader2 size={14} className="animate-spin" />}
        Save profile
      </button>
    </form>
  );
}

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePasswordAction, initial);
  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="currentPassword" className="mb-2 block text-[12px] font-medium">
            Current password
          </label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            required
            className="field"
          />
        </div>
        <div>
          <label htmlFor="newPassword" className="mb-2 block text-[12px] font-medium">
            New password
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className="field"
          />
        </div>
      </div>
      <Message state={state} />
      <button type="submit" disabled={pending} className={buttonClasses({ variant: "secondary", size: "md" })}>
        {pending && <Loader2 size={14} className="animate-spin" />}
        Change password
      </button>
    </form>
  );
}

export function DeleteAccountForm() {
  return (
    <form
      action={deleteAccountAction}
      onSubmit={(event) => {
        if (
          !window.confirm(
            "Delete your account? Your votes, comments and submissions will be removed. This cannot be undone.",
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      <button type="submit" className={buttonClasses({ variant: "danger", size: "sm" })}>
        Delete my account
      </button>
    </form>
  );
}
