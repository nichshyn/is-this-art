import type { Metadata } from "next";
import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotForm } from "@/components/auth/forms";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Забыли пароль",
  description: "Запросите ссылку для сброса пароля к учётной записи «IS THIS ART?».",
  alternates: { canonical: "/forgot-password" },
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Восстановление аккаунта"
      title="Поможем вам снова войти."
      description="Введите адрес электронной почты, указанный при регистрации. Если аккаунт существует, мы создадим ссылку для сброса пароля."
      footer={
        <>
          Вспомнили пароль?{" "}
          <Link href="/login" className="font-medium text-ink underline underline-offset-2">
            Вернуться ко входу
          </Link>
        </>
      }
    >
      <ForgotForm />
    </AuthShell>
  );
}
