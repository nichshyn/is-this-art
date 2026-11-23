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
          <ArrowLeft size={13} /> Catalog
        </Link>
        <p className="text-[11px] text-muted">Admin-created works publish immediately</p>
      </div>
      <div className="card p-5 sm:p-7">
        <h2 className="text-[16px] font-medium tracking-tight">Add an artwork</h2>
        <p className="mt-1 max-w-2xl text-[12px] leading-relaxed text-muted">
          Use a verified public-domain or licensed image. Keep the credit, licence
          and source URL accurate — they are shown on the public artwork page.
        </p>
        <div className="mt-7">
          <AdminArtworkForm categories={categories.map((category) => ({ slug: category.slug, name: category.name }))} />
        </div>
      </div>
    </div>
  );
}
