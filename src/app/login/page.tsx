import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthShell, GoogleButton } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/forms";
import { getCurrentUser, googleOAuthConfigured } from "@/lib/auth";
import { safeNext } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Вход",
  description: "Войдите, чтобы сохранить очки, серию дней и место в таблице лидеров.",
  alternates: { canonical: "/login" },
};

const ERRORS: Record<string, string> = {
  "google-not-configured": "Вход через Google не настроен на этом сайте.",
  "google-state": "Сеанс входа через Google истёк. Попробуйте ещё раз.",
  google: "Не удалось войти через Google. Попробуйте ещё раз.",
  blocked: "Эта учётная запись заблокирована.",
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
      eyebrow="С возвращением"
      title="Войдите, чтобы продолжить смотреть."
      description="Ваши голоса уже идут в счёт. Учётная запись сохранит очки, серию дней и аргументы."
      footer={
        <>
          Впервые здесь?{" "}
          <Link href="/signup" className="font-medium text-ink underline underline-offset-2">
            Создать аккаунт
          </Link>
        </>
      }
    >
      {params.reset && (
        <p className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3.5 py-2.5 text-[12px] text-emerald-700 dark:text-emerald-400">
          Ваш пароль сброшен. Войдите с новым паролем.
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
            <span className="text-[10px] uppercase tracking-[0.16em] text-muted">или</span>
            <span className="h-px flex-1 bg-line" />
          </div>
          <GoogleButton />
        </>
      )}
    </AuthShell>
  );
}
