"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, X } from "lucide-react";

import { adminResolveReportAction } from "@/app/actions/admin";
import { buttonClasses } from "@/components/ui/button";

export function ReportActions({ reportId }: { reportId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function resolve(status: "resolved" | "dismissed") {
    setError(null);
    startTransition(async () => {
      const result = await adminResolveReportAction(reportId, status);
      if (!result.ok) {
        setError("Не удалось обновить жалобу.");
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-1.5">
        <button
          type="button"
          onClick={() => resolve("resolved")}
          disabled={pending}
          className={buttonClasses({ size: "sm", className: "h-7 px-2.5 text-[10.5px]" })}
        >
          {pending ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
          Решить
        </button>
        <button
          type="button"
          onClick={() => resolve("dismissed")}
          disabled={pending}
          className={buttonClasses({ variant: "secondary", size: "sm", className: "h-7 px-2.5 text-[10.5px]" })}
        >
          <X size={11} /> Отклонить
        </button>
      </div>
      {error && <span className="text-[9.5px] text-red-500">{error}</span>}
    </div>
  );
}
