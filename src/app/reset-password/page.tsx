import type { Metadata } from "next";
import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";
import { ResetForm } from "@/components/auth/forms";
import { buttonClasses } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Сброс пароля",
  description: "Выберите новый пароль для учётной записи «IS THIS ART?».",
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
      eyebrow="Восстановление аккаунта"
      title="Выберите новый пароль."
      description="Придумайте пароль не короче восьми символов. После сброса вы выйдете из всех остальных сеансов."
      footer={
        <>
          Нужна новая ссылка?{" "}
          <Link href="/forgot-password" className="font-medium text-ink underline underline-offset-2">
            Запросить ещё одну
          </Link>
        </>
      }
    >
      {token ? (
        <ResetForm token={token} />
      ) : (
        <div className="space-y-4">
          <p className="rounded-xl border border-red-500/20 bg-red-500/5 px-3.5 py-3 text-[12px] leading-relaxed text-red-600 dark:text-red-400">
            В этой ссылке для сброса отсутствует токен. Запросите новую ссылку, чтобы продолжить.
          </p>
          <Link
            href="/forgot-password"
            className={buttonClasses({ size: "lg", className: "w-full" })}
          >
            Запросить ссылку для сброса
          </Link>
        </div>
      )}
    </AuthShell>
  );
}
