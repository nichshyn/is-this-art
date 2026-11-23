import type { Metadata } from "next";
import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotForm } from "@/components/auth/forms";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Request a password reset link for your IS THIS ART? account.",
  alternates: { canonical: "/forgot-password" },
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Let's get you back in."
      description="Enter the email you signed up with. If an account exists, a reset link will be created."
      footer={
        <>
          Remembered it?{" "}
          <Link href="/login" className="font-medium text-ink underline underline-offset-2">
            Back to sign in
          </Link>
        </>
      }
    >
      <ForgotForm />
    </AuthShell>
  );
}
