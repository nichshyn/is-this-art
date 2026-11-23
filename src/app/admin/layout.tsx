import type { Metadata } from "next";

import { AdminNav } from "@/components/admin/admin-nav";
import { requireAdmin } from "@/lib/auth";
import { getAdminStats } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Админка",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();
  const stats = getAdminStats();

  return (
    <div className="container-page py-8 sm:py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Панель куратора</p>
          <h1 className="display mt-3 text-[clamp(1.9rem,4vw,3rem)] leading-[0.98]">
            Модерация и каталог
          </h1>
        </div>
        <p className="text-[11.5px] text-muted">
          Вы вошли как <span className="font-medium text-ink">@{admin.username}</span>
        </p>
      </div>
      <div className="mt-6">
        <AdminNav
          counts={{
            pending: stats.pending,
            reports: stats.reports,
            users: stats.users,
            artworks: stats.artworks,
          }}
        />
      </div>
      <div className="pt-7">{children}</div>
    </div>
  );
}
