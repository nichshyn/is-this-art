import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  EyeOff,
  FileCheck2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { ArtworkThumb } from "@/components/artwork/artwork-image";
import { DeleteSubmissionButton } from "@/components/submit/delete-submission-button";
import { SubmitForm } from "@/components/submit/submit-form";
import { buttonClasses } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { getCurrentUser } from "@/lib/auth";
import { getUserWorks } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Submit artwork",
  description:
    "Submit your work to IS THIS ART? Every image is reviewed by a moderator before it joins the gallery.",
  alternates: { canonical: "/submit" },
};

const STEPS = [
  {
    icon: <FileCheck2 size={16} strokeWidth={1.7} />,
    title: "Describe the work",
    text: "A title, a category and a short description. No CV, no price, no wall text.",
  },
  {
    icon: <ShieldCheck size={16} strokeWidth={1.7} />,
    title: "A human reviews it",
    text: "Moderators check the image, the rights and the description before publishing.",
  },
  {
    icon: <Sparkles size={16} strokeWidth={1.7} />,
    title: "The room decides",
    text: "Once approved, your work enters the gallery and the play queue.",
  },
];

export default async function SubmitPage() {
  const user = await getCurrentUser();
  const submissions = user ? getUserWorks(user.id, true) : [];

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-16">
        <div className="min-w-0">
          <p className="eyebrow">Open call</p>
          <h1 className="display mt-4 max-w-3xl text-[clamp(2.6rem,6.5vw,5.4rem)] leading-[0.9]">
            Is your work
            <br />
            art?
          </h1>
          <p className="mt-5 max-w-xl text-[14px] leading-relaxed text-muted">
            Submit an image, a title and the story you want it to carry. The
            community will do the rest — one judgment at a time.
          </p>

          <div className="mt-10">
            {user ? (
              <div className="card p-5 sm:p-8">
                <div className="mb-7 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-5">
                  <div>
                    <h2 className="text-[15px] font-medium tracking-tight">New submission</h2>
                    <p className="mt-1 text-[11.5px] text-muted">
                      Signed in as @{user.username}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-subtle px-3 py-1.5 text-[10.5px] text-muted">
                    <Clock3 size={12} />
                    Usually reviewed within 48 hours
                  </span>
                </div>
                <SubmitForm />
              </div>
            ) : (
              <div className="card p-8 text-center sm:p-12">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-subtle">
                  <ShieldCheck size={22} className="text-muted" />
                </span>
                <h2 className="display mt-6 text-[clamp(1.7rem,3.4vw,2.4rem)] leading-[1.03]">
                  Sign in to submit.
                </h2>
                <p className="mx-auto mt-3 max-w-sm text-[13px] leading-relaxed text-muted">
                  An account lets us credit you, keep you updated on moderation and
                  protect the gallery from spam.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link href="/login?next=%2Fsubmit" className={buttonClasses()}>
                    Sign in <ArrowRight size={15} />
                  </Link>
                  <Link href="/signup" className={buttonClasses({ variant: "secondary" })}>
                    Create an account
                  </Link>
                </div>
              </div>
            )}
          </div>

          {user && submissions.length > 0 && (
            <section className="mt-12">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-[13px] font-medium uppercase tracking-[0.16em] text-muted">
                  Your submissions
                </h2>
                <span className="text-[11px] text-muted">{submissions.length} total</span>
              </div>
              <ul className="mt-4 space-y-2">
                {submissions.map((artwork) => (
                  <li
                    key={artwork.id}
                    className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-3"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-subtle">
                      <ArtworkThumb src={artwork.image_url} alt={artwork.title} sizes="64px" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium">{artwork.title}</p>
                      <p className="mt-0.5 text-[11px] text-muted">
                        {formatDate(artwork.created_at)}
                        {artwork.status === "approved"
                          ? ` · ${artwork.vote_count} judgments`
                          : ""}
                      </p>
                      {artwork.status === "rejected" && artwork.rejection_reason && (
                        <p className="mt-1 line-clamp-1 text-[10.5px] text-red-500">
                          {artwork.rejection_reason}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <StatusBadge status={artwork.status} />
                      {artwork.status === "approved" ? (
                        <Link
                          href={`/artwork/${artwork.slug}`}
                          className="text-[10.5px] text-muted hover:text-ink"
                        >
                          View page
                        </Link>
                      ) : artwork.status === "pending" ? (
                        <DeleteSubmissionButton artworkId={artwork.id} />
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <Reveal>
            <div className="rounded-2xl border border-line bg-surface p-5">
              <p className="eyebrow">How it works</p>
              <ol className="mt-4 space-y-5">
                {STEPS.map((step, index) => (
                  <li key={step.title} className="flex gap-3.5">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line bg-paper text-ink">
                      {step.icon}
                    </span>
                    <div>
                      <p className="text-[10px] tabular-nums text-muted">0{index + 1}</p>
                      <p className="mt-0.5 text-[12.5px] font-medium">{step.title}</p>
                      <p className="mt-1 text-[11.5px] leading-relaxed text-muted">
                        {step.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>

          <div className="rounded-2xl border border-line bg-subtle/70 p-5">
            <p className="eyebrow">A note on rights</p>
            <p className="mt-3 text-[11.5px] leading-relaxed text-muted">
              Only upload work you made or have permission to share. By submitting,
              you allow IS THIS ART? to display the image and its description for
              the purpose of this experiment. You can ask a moderator to remove an
              approved work at any time.
            </p>
          </div>

          <div className="rounded-2xl border border-line p-5">
            <p className="inline-flex items-center gap-1.5 text-[12px] font-medium">
              <EyeOff size={14} />
              Prefer to stay anonymous?
            </p>
            <p className="mt-2 text-[11.5px] leading-relaxed text-muted">
              Tick the anonymous box and your username will be hidden from the
              public artwork page. Moderators still see who submitted it.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    approved: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    pending: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    rejected: "bg-red-500/10 text-red-600 dark:text-red-400",
  };
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.12em] ${
        styles[status] ?? "bg-subtle text-muted"
      }`}
    >
      {status}
    </span>
  );
}
