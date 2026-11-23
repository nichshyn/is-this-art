import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { AdminArtworkForm } from "@/components/admin/artwork-form";
import { getArtworkById, listAllCategories } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminEditArtworkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const artwork = getArtworkById(id);
  if (!artwork) notFound();
  const categories = listAllCategories();

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/artworks"
          className="inline-flex items-center gap-1.5 text-[11.5px] text-muted hover:text-ink"
        >
          <ArrowLeft size={13} /> Catalog
        </Link>
        <div className="flex items-center gap-3">
          {artwork.status === "approved" && (
            <Link
              href={`/artwork/${artwork.slug}`}
              className="inline-flex items-center gap-1 text-[11px] text-muted hover:text-ink"
            >
              View public page <ExternalLink size={10} />
            </Link>
          )}
          <span className="text-[11px] text-muted">
            {artwork.vote_count} votes · {artwork.status}
          </span>
        </div>
      </div>
      <div className="card p-5 sm:p-7">
        <h2 className="text-[16px] font-medium tracking-tight">Edit artwork</h2>
        <p className="mt-1 text-[12px] text-muted">Changes are public immediately.</p>
        <div className="mt-7">
          <AdminArtworkForm
            artwork={artwork}
            categories={categories.map((category) => ({
              slug: category.slug,
              name: category.name,
            }))}
          />
        </div>
      </div>
    </div>
  );
}
