import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AdminArtworkForm } from "@/components/admin/artwork-form";
import { getCategoriesWithCounts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default function AdminNewArtworkPage() {
  const categories = getCategoriesWithCounts();
  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-4">
        <Link
          href="/admin/artworks"
          className="inline-flex items-center gap-1.5 text-[11.5px] text-muted hover:text-ink"
        >
          <ArrowLeft size={13} /> Каталог
        </Link>
        <p className="text-[11px] text-muted">Работы, добавленные администратором, публикуются сразу</p>
      </div>
      <div className="card p-5 sm:p-7">
        <h2 className="text-[16px] font-medium tracking-tight">Добавить работу</h2>
        <p className="mt-1 max-w-2xl text-[12px] leading-relaxed text-muted">
          Используйте проверенное изображение в общественном достоянии или с лицензией.
          Укажите точные данные об авторе, лицензии и источнике — они видны на публичной странице работы.
        </p>
        <div className="mt-7">
          <AdminArtworkForm categories={categories.map((category) => ({ slug: category.slug, name: category.name }))} />
        </div>
      </div>
    </div>
  );
}
