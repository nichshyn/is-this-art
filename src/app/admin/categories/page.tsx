import { FolderTree } from "lucide-react";

import { AddCategoryForm } from "@/components/admin/add-category-form";
import { ToggleCategoryButton } from "@/components/admin/toggle-category-button";
import { listAllCategories } from "@/lib/queries";
import { formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function AdminCategoriesPage() {
  const categories = listAllCategories();

  return (
    <div>
      <div>
        <h2 className="text-[16px] font-medium tracking-tight">Categories</h2>
        <p className="mt-1 max-w-xl text-[12px] leading-relaxed text-muted">
          Categories organise the gallery and the play filters. Hiding a category
          removes it from filters without touching the works inside it.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-surface p-4 sm:p-5">
        <h3 className="text-[12px] font-medium">Add a category</h3>
        <div className="mt-3">
          <AddCategoryForm />
        </div>
      </div>

      <ul className="mt-5 overflow-hidden rounded-2xl border border-line bg-surface">
        <li className="hidden grid-cols-[minmax(0,1fr)_90px_70px_80px] items-center gap-3 border-b border-line px-4 py-2.5 text-[9.5px] uppercase tracking-[0.12em] text-muted sm:grid">
          <span>Category</span>
          <span className="text-right">Works</span>
          <span className="text-right">Status</span>
          <span className="text-right">Visibility</span>
        </li>
        {categories.map((category) => (
          <li
            key={category.slug}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-line px-4 py-3 last:border-0 sm:grid-cols-[minmax(0,1fr)_90px_70px_80px]"
          >
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 truncate text-[12px] font-medium">
                <FolderTree size={12} className="text-muted" />
                {category.name}
              </p>
              <p className="truncate text-[10px] text-muted">
                {category.slug}
                {category.description ? ` · ${category.description}` : ""}
              </p>
            </div>
            <span className="hidden text-right text-[11px] tabular-nums text-muted sm:block">
              {formatNumber(category.count)}
            </span>
            <span className="hidden text-right sm:block">
              <span
                className={`rounded-full px-2 py-0.5 text-[9px] uppercase tracking-[0.1em] ${
                  category.is_active
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                    : "bg-subtle text-muted"
                }`}
              >
                {category.is_active ? "Active" : "Hidden"}
              </span>
            </span>
            <div className="flex justify-end">
              <ToggleCategoryButton slug={category.slug} active={Boolean(category.is_active)} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
