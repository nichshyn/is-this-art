import Link from "next/link";

import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";

const columns = [
  {
    title: "Explore",
    links: [
      { href: "/discover", label: "Artworks" },
      { href: "/play", label: "Play" },
      { href: "/challenge", label: "Daily challenge" },
      { href: "/leaderboard", label: "Leaderboard" },
    ],
  },
  {
    title: "Community",
    links: [
      { href: "/community", label: "Community" },
      { href: "/submit", label: "Submit artwork" },
      { href: "/signup", label: "Create account" },
      { href: "/login", label: "Sign in" },
    ],
  },
  {
    title: "About",
    links: [
      { href: "/about", label: "The experiment" },
      { href: "/credits", label: "Image credits" },
      { href: "/privacy", label: "Privacy & terms" },
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
              A social experiment about taste. Look closely, make a judgment, and
              discover what everyone else sees.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <ThemeToggle />
              <span className="text-[11px] text-muted">Light / dark</span>
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
          <p>© {new Date().getFullYear()} IS THIS ART? A demonstration project.</p>
          <p className="max-w-xl text-pretty">
            Historical images are public domain or CC0, sourced from Wikimedia
            Commons. Works marked “Demo” were created for this project. This site
            does not claim to define what art is.
          </p>
        </div>
      </div>
    </footer>
  );
}
