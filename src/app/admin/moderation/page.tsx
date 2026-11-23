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
          <h2 className="text-[16px] font-medium tracking-tight">Submission queue</h2>
          <p className="mt-1 max-w-xl text-[12px] leading-relaxed text-muted">
            Check the image, the rights and the description. Approving publishes the
            work to the gallery and awards the submitter points.
          </p>
        </div>
        <p className="shrink-0 text-[11px] text-muted">
          {pending.length} {pending.length === 1 ? "work" : "works"} waiting
        </p>
      </div>

      {pending.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-line py-20 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-subtle">
            <CheckCircle2 size={21} className="text-muted" />
          </span>
          <p className="mt-4 text-[14px] font-medium">Everything is reviewed.</p>
          <p className="mx-auto mt-1.5 max-w-sm text-[12px] leading-relaxed text-muted">
            New community submissions will appear here. The gallery is up to date.
          </p>
          <Link href="/admin/artworks" className={buttonClasses({ variant: "secondary", size: "sm", className: "mt-5" })}>
            <Inbox size={13} /> Browse the catalog
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
