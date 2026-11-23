import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Info } from "lucide-react";

import { SEED_ARTWORKS } from "@/data/artworks";
import { plural } from "@/lib/utils";

import credits from "../../../public/artworks/credits.json";

export const metadata: Metadata = {
  title: "Источники изображений",
  description:
    "Источники, лицензии и указание авторства изображений, используемых в демонстрационной галерее IS THIS ART?.",
  alternates: { canonical: "/credits" },
};

interface Credit {
  slug: string;
  file: string;
  title: string;
  sourcePage: string;
  license: string;
  licenseUrl: string;
  credit: string;
  artist: string;
  width: number;
  height: number;
}

const demoWorks = SEED_ARTWORKS.filter(
  (artwork) => artwork.isDemo && (artwork.status ?? "approved") === "approved",
);

export default function CreditsPage() {
  const items = credits as Credit[];

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="max-w-3xl">
        <p className="eyebrow">Происхождение</p>
        <h1 className="display mt-4 text-[clamp(2.6rem,6vw,5rem)] leading-[0.92]">
          Источники изображений
          <br />
          и лицензии.
        </h1>
        <p className="mt-5 max-w-xl text-[14px] leading-relaxed text-muted">
          Исторические изображения в демонстрационном каталоге — это работы из
          общественного достояния или с лицензией CC0, взятые с Wikimedia Commons.
          Каждая запись ведёт к исходному файлу. Ещё пять работ созданы специально
          для проекта и явно помечены как демо-материалы.
        </p>
      </div>

      <div className="mt-8 flex items-start gap-2.5 rounded-2xl border border-line bg-subtle/60 p-4 text-[11.5px] leading-relaxed text-muted">
        <Info size={14} className="mt-0.5 shrink-0" />
        <p>
          Лицензии описывают исходный файл, а не саму работу в каждой юрисдикции.
          Если вы считаете, что указание авторства неполное, воспользуйтесь кнопкой
          жалобы на странице работы — модератор сможет это проверить.
        </p>
      </div>

      <section className="mt-10">
        <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
          <h2 className="text-[12px] font-medium uppercase tracking-[0.16em] text-muted">
            Исторические изображения и общественное достояние
          </h2>
          <span className="text-[10.5px] text-muted">{plural(items.length, "работа", "работы", "работ")}</span>
        </div>
        <ul className="divide-y divide-line">
          {items.map((item) => (
            <li key={item.slug} className="grid gap-4 py-4 sm:grid-cols-[72px_minmax(0,1fr)_auto] sm:items-center">
              <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-line bg-subtle">
                <Image
                  src={item.file}
                  alt={item.artist}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="text-[12.5px] font-medium">{item.artist}</p>
                <p className="mt-0.5 line-clamp-1 text-[11px] text-muted">
                  {item.title.replace(/^File:/, "").replace(/\.(jpg|jpeg|png)$/i, "")}
                </p>
                <p className="mt-1 text-[10px] text-muted">
                  {item.license}
                  {item.width && item.height ? ` · ${item.width} × ${item.height}` : ""}
                </p>
              </div>
              <a
                href={item.sourcePage}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1 justify-self-start text-[10.5px] text-muted underline underline-offset-2 hover:text-ink sm:justify-self-end"
              >
                Источник <ArrowUpRight size={10} />
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
          <h2 className="text-[12px] font-medium uppercase tracking-[0.16em] text-muted">
            Демонстрационные материалы
          </h2>
          <span className="text-[10.5px] text-muted">{plural(demoWorks.length, "работа", "работы", "работ")}</span>
        </div>
        <p className="mt-4 max-w-2xl text-[12px] leading-relaxed text-muted">
          Эти работы созданы специально для демонстрации продукта. Они не
          приписываются реальному художнику, коллекции или историческому событию и
          везде помечены как «Демо».
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {demoWorks.map((work) => (
            <li key={work.slug} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-subtle">
                <Image src={work.imageUrl} alt={work.title} fill sizes="56px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[12px] font-medium">{work.title}</p>
                <p className="text-[10.5px] text-muted">
                  Демо-материал · {work.artistName}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-line pt-6">
        <Link href="/discover" className="text-[12px] font-medium underline underline-offset-4">
          Открыть галерею
        </Link>
        <Link href="/about" className="text-[12px] text-muted hover:text-ink">
          О проекте
        </Link>
      </div>
    </div>
  );
}
