import Link from "next/link";

import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";

const columns = [
  {
    title: "Обзор",
    links: [
      { href: "/discover", label: "Работы" },
      { href: "/play", label: "Игра" },
      { href: "/challenge", label: "Задание дня" },
      { href: "/leaderboard", label: "Лидеры" },
    ],
  },
  {
    title: "Сообщество",
    links: [
      { href: "/community", label: "Сообщество" },
      { href: "/submit", label: "Предложить работу" },
      { href: "/signup", label: "Создать аккаунт" },
      { href: "/login", label: "Войти" },
    ],
  },
  {
    title: "О проекте",
    links: [
      { href: "/about", label: "Эксперимент" },
      { href: "/credits", label: "Источники изображений" },
      { href: "/privacy", label: "Конфиденциальность и условия" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-[13px] leading-relaxed text-muted">
              Социальный эксперимент о вкусе. Присмотритесь, оцените и узнайте,
              что видят другие.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <ThemeToggle />
              <span className="text-[11px] text-muted">Светлая / тёмная</span>
            </div>
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                {column.title}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-ink/80 transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 text-[11.5px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} IS THIS ART? Демонстрационный проект.</p>
          <p className="max-w-xl text-pretty">
            Исторические изображения — общественное достояние или CC0 из Wikimedia
            Commons. Работы с пометкой «Демо» созданы для этого проекта. Сайт не
            претендует на то, чтобы определять, что такое искусство.
          </p>
        </div>
      </div>
    </footer>
  );
}
