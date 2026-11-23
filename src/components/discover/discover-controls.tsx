"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { cn } from "@/lib/utils";

export interface DiscoverCategory {
  slug: string;
  name: string;
  count: number;
}

export function DiscoverControls({
  q,
  category,
  sort,
  categories,
}: {
  q: string;
  category: string;
  sort: string;
  categories: DiscoverCategory[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState(q);
  const [pending, startTransition] = useTransition();

  function navigate(next: {
    q?: string;
    category?: string;
    sort?: string;
    page?: number;
  }) {
    const params = new URLSearchParams();
    const nextQ = next.q ?? q;
    const nextCategory = next.category ?? category;
    const nextSort = next.sort ?? sort;
    if (nextQ.trim()) params.set("q", nextQ.trim());
    if (nextCategory) params.set("category", nextCategory);
    if (nextSort && nextSort !== "trending") params.set("sort", nextSort);
    if (next.page && next.page > 1) params.set("page", String(next.page));
    startTransition(() => {
      router.push(`/discover${params.toString() ? `?${params.toString()}` : ""}`, {
        scroll: false,
      });
    });
  }

  const hasFilters = Boolean(q || category || (sort && sort !== "trending"));

  return (
    <div className="mt-8 space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <form
          className="relative flex-1"
          onSubmit={(event) => {
            event.preventDefault();
            navigate({ q: query, page: 1 });
          }}
        >
          <Search
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title, artist or description"
            className="field h-11 rounded-full pl-10 pr-10 text-[13.5px]"
            aria-label="Search artworks"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                navigate({ q: "", page: 1 });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted hover:text-ink"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </form>

        <div className="flex items-center gap-2">
          <label className="relative inline-flex items-center">
            <SlidersHorizontal
              size={14}
              className="pointer-events-none absolute left-3.5 text-muted"
            />
            <select
              value={sort}
              onChange={(event) => navigate({ sort: event.target.value, page: 1 })}
              className="h-11 appearance-none rounded-full border border-line bg-surface pl-9 pr-8 text-[12.5px] text-ink focus:outline-none focus:ring-4 focus:ring-ink/5"
              aria-label="Sort artworks"
            >
              <option value="trending">Trending</option>
              <option value="controversial">Most divisive</option>
              <option value="newest">Recently added</option>
              <option value="votes">Most judged</option>
            </select>
            <span className="pointer-events-none absolute right-3 text-[9px] text-muted">▾</span>
          </label>
          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                startTransition(() => router.push("/discover"));
              }}
              className="h-11 rounded-full px-3 text-[11.5px] text-muted transition-colors hover:text-ink"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        <button
          type="button"
          onClick={() => navigate({ category: "", page: 1 })}
          className={cn(
            "shrink-0 rounded-full border px-3.5 py-1.5 text-[11.5px] transition-colors",
            !category
              ? "border-ink bg-ink text-paper"
              : "border-line bg-surface text-muted hover:border-ink/20 hover:text-ink",
          )}
        >
          All works
        </button>
        {categories.map((item) => (
          <button
            key={item.slug}
            type="button"
            onClick={() => navigate({ category: item.slug, page: 1 })}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-1.5 text-[11.5px] transition-colors",
              category === item.slug
                ? "border-ink bg-ink text-paper"
                : "border-line bg-surface text-muted hover:border-ink/20 hover:text-ink",
            )}
          >
            {item.name}
            <span className="ml-1.5 opacity-50">{item.count}</span>
          </button>
        ))}
      </div>
      {pending && <p className="text-[10.5px] text-muted">Updating gallery…</p>}
    </div>
  );
}
