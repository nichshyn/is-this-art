import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthShell, GoogleButton } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/forms";
import { getCurrentUser, googleOAuthConfigured } from "@/lib/auth";
import { safeNext } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to keep your points, streaks and place on the leaderboard.",
  alternates: { canonical: "/login" },
};

const ERRORS: Record<string, string> = {
  "google-not-configured": "Google sign-in is not configured on this instance.",
  "google-state": "The Google sign-in session expired. Please try again.",
  google: "Google sign-in could not be completed. Please try again.",
  blocked: "This account has been suspended.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; reset?: string; error?: string; welcome?: string }>;
}) {
  const params = await searchParams;
  const user = await getCurrentUser();
  const next = safeNext(params.next, "/play");
  if (user) redirect(next);

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to keep looking."
      description="Your votes already count. An account keeps the points, the streak and the arguments."
      footer={
        <>
          New here?{" "}
          <Link href="/signup" className="font-medium text-ink underline underline-offset-2">
            Create an account
          </Link>
        </>
      }
    >
      {params.reset && (
        <p className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3.5 py-2.5 text-[12px] text-emerald-700 dark:text-emerald-400">
          Your password has been reset. Sign in with the new one.
        </p>
      )}
      {params.error && ERRORS[params.error] && (
        <p className="mb-4 rounded-xl border border-red-500/20 bg-red-500/5 px-3.5 py-2.5 text-[12px] text-red-600 dark:text-red-400">
          {ERRORS[params.error]}
        </p>
      )}
      <LoginForm next={next} />
      {googleOAuthConfigured() && (
        <>
          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-line" />
            <span className="text-[10px] uppercase tracking-[0.16em] text-muted">or</span>
            <span className="h-px flex-1 bg-line" />
          </div>
          <GoogleButton />
        </>
      )}
    </AuthShell>
  );
}
