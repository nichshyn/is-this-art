import type { Metadata } from "next";
import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";
import { ResetForm } from "@/components/auth/forms";
import { buttonClasses } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Choose a new password for your IS THIS ART? account.",
  alternates: { canonical: "/reset-password" },
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Choose a new password."
      description="Pick something at least eight characters long. Resetting will sign you out of other sessions."
      footer={
        <>
          Need a new link?{" "}
          <Link href="/forgot-password" className="font-medium text-ink underline underline-offset-2">
            Request another
          </Link>
        </>
      }
    >
      {token ? (
        <ResetForm token={token} />
      ) : (
        <div className="space-y-4">
          <p className="rounded-xl border border-red-500/20 bg-red-500/5 px-3.5 py-3 text-[12px] leading-relaxed text-red-600 dark:text-red-400">
            This reset link is missing its token. Request a new link to continue.
          </p>
          <Link
            href="/forgot-password"
            className={buttonClasses({ size: "lg", className: "w-full" })}
          >
            Request a reset link
          </Link>
        </div>
      )}
    </AuthShell>
  );
}
