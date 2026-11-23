"use client";

import { AlertCircle, Check, Loader2, Plus } from "lucide-react";
import { useActionState } from "react";

import { adminAddCategoryAction } from "@/app/actions/admin";
import type { FormState } from "@/app/actions/auth";
import { buttonClasses } from "@/components/ui/button";

const initial: FormState = {};

export function AddCategoryForm() {
  const [state, action, pending] = useActionState(adminAddCategoryAction, initial);

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-[11px] font-medium">
            Category name
          </label>
          <input id="name" name="name" required minLength={2} maxLength={60} className="field text-[12px]" />
        </div>
        <div>
          <label htmlFor="description" className="mb-1.5 block text-[11px] font-medium">
            Description <span className="font-normal text-muted">optional</span>
          </label>
          <input id="description" name="description" maxLength={200} className="field text-[12px]" />
        </div>
      </div>
      {state.error && (
        <p className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-[11.5px] text-red-600 dark:text-red-400">
          <AlertCircle size={13} className="mt-0.5 shrink-0" /> {state.error}
        </p>
      )}
      {state.success && (
        <p className="flex items-start gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-[11.5px] text-emerald-700 dark:text-emerald-400">
          <Check size={13} className="mt-0.5 shrink-0" /> {state.success}
        </p>
      )}
      <button type="submit" disabled={pending} className={buttonClasses({ size: "sm" })}>
        {pending ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
        Add category
      </button>
    </form>
  );
}
