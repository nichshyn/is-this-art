import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { ArtworkCard } from "@/components/artwork/artwork-card";
import { DiscoverControls } from "@/components/discover/discover-controls";
import { Reveal } from "@/components/ui/reveal";
import { getCategoriesWithCounts, listArtworks } from "@/lib/queries";
import { formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Обзор",
  description:
    "Смотрите живопись, скульптуру, фотографию, инсталляции, цифровое и ИИ-искусство. Ищите, фильтруйте и сортируйте галерею.",
  alternates: { canonical: "/discover" },
};

const SORTS = new Set(["trending", "controversial", "newest", "votes"]);

function buildHref(params: {
  q: string;
  category: string;
  sort: string;
  page: number;
}) {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.category) search.set("category", params.category);
  if (params.sort !== "trending") search.set("sort", params.sort);
  if (params.page > 1) search.set("page", String(params.page));
  return `/discover${search.toString() ? `?${search.toString()}` : ""}`;
}

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.slice(0, 80) : "";
  const category = typeof params.category === "string" ? params.category : "";
  const sort = typeof params.sort === "string" && SORTS.has(params.sort) ? params.sort : "trending";
  const page = Math.max(1, Number.parseInt(String(params.page ?? "1"), 10) || 1);

  const data = listArtworks({
    q,
    category,
    sort: sort as "trending" | "controversial" | "newest" | "votes",
    page,
    pageSize: 12,
  });
  const categories = getCategoriesWithCounts();
  const activeCategory = categories.find((c) => c.slug === category);

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="max-w-3xl">
        <p className="eyebrow">Галерея</p>
        <h1 className="display mt-4 text-[clamp(2.5rem,6vw,5.2rem)] leading-[0.92]">
          Что
          <br />
          считается искусством?
        </h1>
        <p className="mt-5 max-w-xl text-[14px] leading-relaxed text-muted">
          Картины, готовые объекты, фотографии, эксперименты с ИИ и то, что трудно
          назвать. Каждая работа здесь, чтобы её смотрели, а не выносили вердикт.
        </p>
      </div>

      <DiscoverControls
        q={q}
        category={category}
        sort={sort}
        categories={categories.map((c) => ({
          slug: c.slug,
          name: c.name,
          count: c.count,
        }))}
      />

      <div className="mt-9 flex flex-wrap items-baseline justify-between gap-3 border-t border-line pt-6">
        <p className="text-[12px] text-muted">
          {activeCategory ? activeCategory.name : q ? `Результаты по запросу «${q}»` : "Все работы"}
          <span className="ml-2 text-ink">{formatNumber(data.total)}</span>
        </p>
        <p className="text-[10.5px] text-muted">
          Страница {data.page} из {data.pages}
        </p>
      </div>

      {data.items.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-3xl border border-dashed border-line py-20 text-center">
          <p className="text-[18px] font-medium tracking-tight">Здесь пока ничего нет.</p>
          <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-muted">
            Попробуйте другой запрос или категорию. Или станьте первым, кто
            предложит работу для этой галереи.
          </p>
          <Link
            href="/submit"
            className="mt-5 rounded-full bg-accent px-5 py-2.5 text-[12.5px] font-medium text-accent-ink"
          >
            Предложить работу
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.items.map((artwork, index) => (
            <Reveal key={artwork.id} delay={(index % 4) * 0.04}>
              <ArtworkCard artwork={artwork} priority={index < 4} />
            </Reveal>
          ))}
        </div>
      )}

      {data.pages > 1 && (
        <nav className="mt-14 flex items-center justify-center gap-2" aria-label="Пагинация">
          {data.page > 1 ? (
            <Link
              href={buildHref({ q, category, sort, page: data.page - 1 })}
              className="inline-flex h-9 items-center gap-1 rounded-full border border-line px-3.5 text-[12px] hover:bg-subtle"
            >
              <ChevronLeft size={14} /> Назад
            </Link>
          ) : (
            <span className="inline-flex h-9 items-center gap-1 rounded-full border border-line px-3.5 text-[12px] text-muted opacity-40">
              <ChevronLeft size={14} /> Назад
            </span>
          )}
          <span className="px-3 text-[11.5px] tabular-nums text-muted">
            {data.page} / {data.pages}
          </span>
          {data.page < data.pages ? (
            <Link
              href={buildHref({ q, category, sort, page: data.page + 1 })}
              className="inline-flex h-9 items-center gap-1 rounded-full border border-line px-3.5 text-[12px] hover:bg-subtle"
            >
              Далее <ChevronRight size={14} />
            </Link>
          ) : (
            <span className="inline-flex h-9 items-center gap-1 rounded-full border border-line px-3.5 text-[12px] text-muted opacity-40">
              Далее <ChevronRight size={14} />
            </span>
          )}
        </nav>
      )}
    </div>
  );
}
