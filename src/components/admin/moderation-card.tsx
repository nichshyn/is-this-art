"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ExternalLink, Loader2, X } from "lucide-react";

import { adminModerateArtworkAction } from "@/app/actions/admin";
import { ArtworkImage } from "@/components/artwork/artwork-image";
import { buttonClasses } from "@/components/ui/button";
import { CATEGORY_MAP } from "@/lib/constants";
import type { Artwork } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function ModerationCard({
  artwork,
}: {
  artwork: Artwork & { submitter: string | null };
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  function decide(decision: "approved" | "rejected") {
    if (decision === "rejected" && reason.trim().length < 3) {
      setError("Укажите краткую причину, чтобы автор знал, что нужно исправить.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await adminModerateArtworkAction(
        artwork.id,
        decision,
        decision === "rejected" ? reason.trim() : undefined,
      );
      if (!result.ok) {
        setError(result.error ?? "Не удалось обновить работу.");
        return;
      }
      router.refresh();
    });
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="grid gap-0 sm:grid-cols-[220px_minmax(0,1fr)]">
        <div className="relative flex min-h-[190px] items-center justify-center bg-subtle p-3">
          <ArtworkImage
            src={artwork.image_url}
            alt={artwork.title}
            width={artwork.image_width}
            height={artwork.image_height}
            className="max-h-[240px] rounded-md"
            sizes="220px"
          />
        </div>
        <div className="flex min-w-0 flex-col p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.1em] text-amber-700 dark:text-amber-400">
              На рассмотрении
            </span>
            <span className="text-[10px] text-muted">
              {CATEGORY_MAP[artwork.category]?.name ?? artwork.category}
            </span>
            {artwork.is_ai_generated === 1 && (
              <span className="rounded-full bg-subtle px-2 py-0.5 text-[9px] uppercase tracking-[0.1em] text-muted">
                ИИ
              </span>
            )}
            {artwork.is_anonymous === 1 && (
              <span className="rounded-full bg-subtle px-2 py-0.5 text-[9px] uppercase tracking-[0.1em] text-muted">
                Анонимно
              </span>
            )}
          </div>
          <h2 className="mt-2 text-[16px] font-medium tracking-tight">{artwork.title}</h2>
          <p className="mt-0.5 text-[11.5px] text-muted">
            {artwork.artist_name}
            {artwork.creation_year ? ` · ${artwork.creation_year}` : ""}
            {artwork.country ? ` · ${artwork.country}` : ""}
          </p>
          <p className="mt-3 line-clamp-3 text-[12px] leading-relaxed text-ink/75">
            {artwork.description}
          </p>
          <p className="mt-2 text-[10.5px] text-muted">
            Отправлено {formatDate(artwork.created_at)} пользователем{" "}
            {artwork.submitter ? (
              <Link href={`/u/${artwork.submitter}`} className="underline underline-offset-2">
                @{artwork.submitter}
              </Link>
            ) : (
              "демо-контент"
            )}
            {" · "}
            <a
              href={artwork.image_url}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-0.5 underline underline-offset-2"
            >
              Открыть изображение <ExternalLink size={9} />
            </a>
          </p>

          {rejecting ? (
            <div className="mt-4 rounded-xl border border-line bg-subtle/60 p-3">
              <label htmlFor={`reason-${artwork.id}`} className="text-[11px] font-medium">
                Причина отклонения
              </label>
              <textarea
                id={`reason-${artwork.id}`}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                rows={2}
                maxLength={500}
                placeholder="Например: изображение слишком низкого качества для публикации."
                className="field mt-2 min-h-[70px] text-[12px]"
              />
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => decide("rejected")}
                  disabled={pending}
                  className={buttonClasses({ variant: "danger", size: "sm" })}
                >
                  {pending ? <Loader2 size={13} className="animate-spin" /> : <X size={13} />}
                  Подтвердить отклонение
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRejecting(false);
                    setError(null);
                  }}
                  className={buttonClasses({ variant: "ghost", size: "sm" })}
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-auto flex flex-wrap gap-2 pt-4">
              <button
                type="button"
                onClick={() => decide("approved")}
                disabled={pending}
                className={buttonClasses({ size: "sm" })}
              >
                {pending ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                Одобрить
              </button>
              <button
                type="button"
                onClick={() => setRejecting(true)}
                disabled={pending}
                className={buttonClasses({ variant: "danger", size: "sm" })}
              >
                <X size={13} /> Отклонить
              </button>
            </div>
          )}
          {error && <p className="mt-2 text-[11px] text-red-500">{error}</p>}
        </div>
      </div>
    </article>
  );
}
