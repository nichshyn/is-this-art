import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Trash2 } from "lucide-react";

import {
  DeleteAccountForm,
  PasswordForm,
  ProfileForm,
} from "@/components/settings/settings-forms";
import { Avatar } from "@/components/ui/avatar";
import { requireUser } from "@/lib/auth";
import { getUserAchievements, getUserStats } from "@/lib/queries";
import { formatDate, formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Настройки",
  description: "Управляйте профилем, паролем и аккаунтом.",
  alternates: { canonical: "/settings" },
  robots: { index: false, follow: false },
};

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const stats = getUserStats(user.id);
  const achievements = getUserAchievements(user.id);

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Аккаунт</p>
          <h1 className="display mt-4 text-[clamp(2.3rem,5vw,4rem)] leading-[0.94]">
            Настройки
          </h1>
          <p className="mt-3 max-w-lg text-[13px] leading-relaxed text-muted">
            Ваш профиль общедоступен, адрес электронной почты — нет. Очки и серии
            дней хранятся на сервере и не подлежат изменению.
          </p>
        </div>
        <Link
          href={`/u/${user.username}`}
          className="inline-flex items-center gap-1.5 text-[12px] font-medium text-ink"
        >
          Открыть публичный профиль <ArrowUpRight size={14} />
        </Link>
      </div>

      {params.error === "admin-account" && (
        <p className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-[12px] text-amber-700 dark:text-amber-400">
          Аккаунты администраторов нельзя удалить на этой странице. Сначала передайте
          роль другому пользователю.
        </p>
      )}

      <div className="mt-9 grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-8">
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-line bg-surface p-5">
            <div className="flex items-center gap-3">
              <Avatar name={user.username} src={user.avatar_url} size="lg" />
              <div className="min-w-0">
                <p className="truncate text-[15px] font-medium">@{user.username}</p>
                <p className="truncate text-[11px] text-muted">{user.email}</p>
              </div>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-4">
              {[
                ["Очки", formatNumber(user.points)],
                ["Серия", `${user.streak} д.`],
                ["Оценки", formatNumber(stats.votes)],
                ["Работы", formatNumber(stats.works)],
              ].map(([label, value]) => (
                <div key={label}>
                  <dd className="text-[16px] font-semibold tabular-nums">{value}</dd>
                  <dt className="text-[9.5px] uppercase tracking-[0.14em] text-muted">{label}</dt>
                </div>
              ))}
            </dl>
            <p className="mt-4 border-t border-line pt-3 text-[10.5px] text-muted">
              На сайте с {formatDate(user.created_at)} · {achievements.length} достижений
            </p>
          </div>

          <div className="rounded-2xl border border-line p-5">
            <p className="inline-flex items-center gap-1.5 text-[12px] font-medium">
              <ShieldCheck size={14} /> Аккаунт и конфиденциальность
            </p>
            <p className="mt-2 text-[11.5px] leading-relaxed text-muted">
              Сеансы хранятся как хешированные токены в cookie с флагом httpOnly. Пароль
              хешируется с помощью scrypt и никогда не хранится в открытом виде.
            </p>
            <Link href="/privacy" className="mt-3 inline-block text-[11.5px] underline underline-offset-2 hover:text-ink">
              Прочитать политику конфиденциальности
            </Link>
          </div>
        </aside>

        <div className="space-y-4">
          <section className="card p-5 sm:p-7">
            <h2 className="text-[15px] font-medium tracking-tight">Публичный профиль</h2>
            <p className="mt-1 text-[11.5px] text-muted">
              Отображается в вашем профиле и рядом с вашими комментариями.
            </p>
            <div className="mt-6">
              <ProfileForm bio={user.bio} avatarUrl={user.avatar_url} />
            </div>
          </section>

          <section className="card p-5 sm:p-7">
            <h2 className="text-[15px] font-medium tracking-tight">Пароль</h2>
            <p className="mt-1 text-[11.5px] text-muted">
              После смены пароля текущий сеанс останется активным.
            </p>
            <div className="mt-6">
              <PasswordForm />
            </div>
          </section>

          <section className="rounded-2xl border border-red-500/20 bg-red-500/[0.03] p-5 sm:p-7">
            <h2 className="flex items-center gap-2 text-[15px] font-medium tracking-tight text-red-600 dark:text-red-400">
              <Trash2 size={15} /> Опасная зона
            </h2>
            <p className="mt-2 max-w-xl text-[11.5px] leading-relaxed text-muted">
              Удаление аккаунта удалит ваши голоса, комментарии, отметки «Нравится»,
              подписки и предложенные работы. Одобренные работы будут убраны из
              галереи. Это действие нельзя отменить.
            </p>
            <div className="mt-5">
              <DeleteAccountForm />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
