import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthShell, GoogleButton } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/forms";
import { getCurrentUser, googleOAuthConfigured } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Создание аккаунта",
  description:
    "Создайте бесплатный аккаунт, чтобы копить очки, вести серию дней и попасть в таблицу лидеров.",
  alternates: { canonical: "/signup" },
};

export default async function SignupPage() {
  const user = await getCurrentUser();
  if (user) redirect("/play");

  return (
    <AuthShell
      eyebrow="Присоединяйтесь к эксперименту"
      title="Пусть ваш взгляд имеет значение."
      description="Бесплатно, без ленты и рекламы. По одному изображению за раз и запись того, что увидели вы и все остальные."
      footer={
        <>
          Уже есть аккаунт?{" "}
          <Link href="/login" className="font-medium text-ink underline underline-offset-2">
            Войти
          </Link>
        </>
      }
    >
      <SignupForm />
      {googleOAuthConfigured() && (
        <>
          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-line" />
            <span className="text-[10px] uppercase tracking-[0.16em] text-muted">или</span>
            <span className="h-px flex-1 bg-line" />
          </div>
          <GoogleButton label="Зарегистрироваться через Google" />
        </>
      )}
    </AuthShell>
  );
}
