import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthShell, GoogleButton } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/forms";
import { getCurrentUser, googleOAuthConfigured } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Create account",
  description:
    "Create a free account to keep points, build a streak and appear on the leaderboard.",
  alternates: { canonical: "/signup" },
};

export default async function SignupPage() {
  const user = await getCurrentUser();
  if (user) redirect("/play");

  return (
    <AuthShell
      eyebrow="Join the experiment"
      title="Make your looking count."
      description="Free, no feed, no ads. Just one image at a time and a record of what you and everyone else saw."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-ink underline underline-offset-2">
            Sign in
          </Link>
        </>
      }
    >
      <SignupForm />
      {googleOAuthConfigured() && (
        <>
          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-line" />
            <span className="text-[10px] uppercase tracking-[0.16em] text-muted">or</span>
            <span className="h-px flex-1 bg-line" />
          </div>
          <GoogleButton label="Sign up with Google" />
        </>
      )}
    </AuthShell>
  );
}
