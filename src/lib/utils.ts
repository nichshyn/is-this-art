import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("ru-RU").format(value);
}

export function formatCompact(value: number): string {
  return new Intl.NumberFormat("ru-RU", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function initials(name: string): string {
  const parts = name.replace(/[^a-zA-Z0-9 ]/g, " ").trim().split(/\s+/);
  if (!parts[0]) return "?";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

const AVATAR_TONES = [
  "bg-[#1f2933] text-white",
  "bg-[#3b4a3f] text-white",
  "bg-[#6b4f3f] text-white",
  "bg-[#43536b] text-white",
  "bg-[#5d4a63] text-white",
  "bg-[#7a6a4f] text-white",
  "bg-[#2d4a4a] text-white",
  "bg-[#6d3f3f] text-white",
];

export function avatarTone(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return AVATAR_TONES[hash % AVATAR_TONES.length];
}

export function timeAgo(iso: string): string {
  const date = new Date(iso.endsWith("Z") ? iso : iso + "Z");
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (!Number.isFinite(seconds) || seconds < 45) return "только что";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${plural(minutes, "минуту", "минуты", "минут")} назад`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${plural(hours, "час", "часа", "часов")} назад`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${plural(days, "день", "дня", "дней")} назад`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${plural(months, "месяц", "месяца", "месяцев")} назад`;
  return `${plural(Math.floor(months / 12), "год", "года", "лет")} назад`;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(iso.endsWith("Z") ? iso : iso + "Z"));
}

export function utcDay(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function utcDaysAgo(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString();
}

export function truncate(value: string, max = 160): string {
  if (value.length <= max) return value;
  return value.slice(0, max - 1).trimEnd() + "…";
}

export function absoluteUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}

export function plural(
  count: number,
  singular: string,
  pluralForm?: string,
  manyForm?: string,
) {
  const absolute = Math.abs(count);
  const mod100 = absolute % 100;
  const mod10 = absolute % 10;

  let form = manyForm ?? pluralForm ?? singular;
  if (mod100 < 11 || mod100 > 14) {
    if (mod10 === 1) form = singular;
    else if (mod10 >= 2 && mod10 <= 4) form = pluralForm ?? singular;
  }

  return `${formatNumber(count)} ${form}`;
}

export function safeNext(value: unknown, fallback = "/play"): string {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
}
