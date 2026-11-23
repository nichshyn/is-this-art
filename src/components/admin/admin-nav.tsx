"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderTree,
  Gauge,
  Images,
  ShieldAlert,
  Users,
  Flag,
} from "lucide-react";

import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/admin", label: "Обзор", icon: Gauge, exact: true },
  { href: "/admin/moderation", label: "Модерация", icon: ShieldAlert, key: "pending" },
  { href: "/admin/artworks", label: "Работы", icon: Images, key: "artworks" },
  { href: "/admin/reports", label: "Жалобы", icon: Flag, key: "reports" },
  { href: "/admin/users", label: "Пользователи", icon: Users, key: "users" },
  { href: "/admin/categories", label: "Категории", icon: FolderTree },
] as const;

export function AdminNav({
  counts,
}: {
  counts: { pending: number; reports: number; users: number; artworks: number };
}) {
  const pathname = usePathname();
  return (
    <nav className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto border-b border-line pb-2" aria-label="Разделы админки">
      {ITEMS.map((item) => {
        const active =
          "exact" in item && item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + "/");
        const count =
          "key" in item && item.key ? counts[item.key as keyof typeof counts] : null;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] transition-colors",
              active ? "bg-accent text-accent-ink" : "text-muted hover:bg-subtle hover:text-ink",
            )}
          >
            <Icon size={13} />
            {item.label}
            {typeof count === "number" && count > 0 && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[9px] font-medium tabular-nums",
                  active ? "bg-white/20" : "bg-subtle",
                )}
              >
                {count}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
