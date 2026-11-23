import Link from "next/link";
import { CheckCircle2, Inbox } from "lucide-react";

import { ModerationCard } from "@/components/admin/moderation-card";
import { buttonClasses } from "@/components/ui/button";
import { listPendingArtworks } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default function AdminModerationPage() {
  const pending = listPendingArtworks();

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-[16px] font-medium tracking-tight">Очередь предложений</h2>
          <p className="mt-1 max-w-xl text-[12px] leading-relaxed text-muted">
            Проверьте изображение, права на него и описание. После одобрения
            работа появится в галерее, а её автор получит очки.
          </p>
        </div>
        <p className="shrink-0 text-[11px] text-muted">
          {pending.length} {pending.length === 1 ? "работа ожидает" : pending.length < 5 ? "работы ожидают" : "работ ожидают"}
        </p>
      </div>

      {pending.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-line py-20 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-subtle">
            <CheckCircle2 size={21} className="text-muted" />
          </span>
          <p className="mt-4 text-[14px] font-medium">Всё проверено.</p>
          <p className="mx-auto mt-1.5 max-w-sm text-[12px] leading-relaxed text-muted">
            Здесь появятся новые работы от сообщества. Галерея актуальна.
          </p>
          <Link href="/admin/artworks" className={buttonClasses({ variant: "secondary", size: "sm", className: "mt-5" })}>
            <Inbox size={13} /> Открыть каталог
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {pending.map((artwork) => (
            <ModerationCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      )}
    </div>
  );
}
