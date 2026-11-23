"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Flag, Loader2, X } from "lucide-react";
import { useActionState, useEffect, useState } from "react";

import { reportAction } from "@/app/actions/artwork";
import { REPORT_REASONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export function ReportDialog({
  artworkId,
  signedIn,
}: {
  artworkId: string;
  signedIn: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(reportAction, {});

  useEffect(() => {
    if (state.success) {
      const timer = window.setTimeout(() => setOpen(false), 2200);
      return () => window.clearTimeout(timer);
    }
  }, [state]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (!signedIn) {
            window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
            return;
          }
          setOpen(true);
        }}
        className="inline-flex items-center gap-1.5 text-[11px] text-muted transition-colors hover:text-ink"
      >
        <Flag size={12} />
        Пожаловаться
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-end justify-center bg-black/40 p-0 backdrop-blur-sm sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="report-title"
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-md rounded-t-3xl border border-line bg-paper p-6 shadow-lift sm:rounded-3xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">Модерация</p>
                  <h2 id="report-title" className="mt-2 text-[20px] font-semibold tracking-tight">
                    Пожаловаться на работу
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full p-1.5 text-muted hover:bg-subtle hover:text-ink"
                  aria-label="Закрыть"
                >
                  <X size={17} />
                </button>
              </div>

              {state.success ? (
                <p className="mt-6 rounded-xl bg-subtle p-4 text-[13px] leading-relaxed">
                  {state.success}
                </p>
              ) : (
                <form action={action} className="mt-5 space-y-4">
                  <input type="hidden" name="artworkId" value={artworkId} />
                  <label className="block">
                    <span className="mb-1.5 block text-[11.5px] font-medium text-muted">Причина</span>
                    <select name="reason" required className="field">
                      {REPORT_REASONS.map((reason) => (
                        <option key={reason} value={reason}>
                          {reason}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-[11.5px] font-medium text-muted">
                      Подробности <span className="font-normal">(необязательно)</span>
                    </span>
                    <textarea
                      name="details"
                      maxLength={600}
                      rows={4}
                      className="field-area"
                      placeholder="Что должен знать модератор?"
                    />
                  </label>
                  {state.error && <p className="text-[12px] text-red-500">{state.error}</p>}
                  <Button type="submit" className="w-full" disabled={pending}>
                    {pending ? <Loader2 size={15} className="animate-spin" /> : <Flag size={14} />}
                    Отправить жалобу
                  </Button>
                  <p className="text-[10.5px] leading-relaxed text-muted">
                    Жалобы рассматривает модератор. Ложные жалобы могут быть проигнорированы.
                  </p>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
