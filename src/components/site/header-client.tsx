"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Settings,
  User as UserIcon,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { logoutAction } from "@/app/actions/auth";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { Avatar } from "@/components/ui/avatar";
import { buttonClasses } from "@/components/ui/button";
import { Logo } from "@/components/site/logo";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/discover", label: "Discover" },
  { href: "/play", label: "Play" },
  { href: "/community", label: "Community" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export interface HeaderUser {
  username: string;
  avatar_url: string | null;
  role: string;
  points: number;
}

export function HeaderClient({ user }: { user: HeaderUser | null }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setUserOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-line/80 bg-paper/80 backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent bg-paper/0",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative rounded-full px-3.5 py-2 text-[13.5px] transition-colors",
                isActive(item.href)
                  ? "text-ink"
                  : "text-muted hover:text-ink",
              )}
            >
              {item.label}
              {isActive(item.href) && (
                <motion.span
                  layoutId="nav-dot"
                  className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-ink"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <Link
            href="/submit"
            className={cn(
              buttonClasses({ variant: "secondary", size: "sm" }),
              "hidden sm:inline-flex",
            )}
          >
            <Plus size={15} strokeWidth={1.8} />
            Submit artwork
          </Link>

          {user ? (
            <div className="relative hidden lg:block" ref={userRef}>
              <button
                type="button"
                onClick={() => setUserOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded-full p-1 pr-2 transition-colors hover:bg-subtle"
                aria-expanded={userOpen}
                aria-haspopup="menu"
              >
                <Avatar name={user.username} src={user.avatar_url} size="sm" />
                <ChevronDown
                  size={13}
                  className={cn("text-muted transition-transform", userOpen && "rotate-180")}
                />
              </button>
              <AnimatePresence>
                {userOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.16 }}
                    className="absolute right-0 top-12 w-60 overflow-hidden rounded-2xl border border-line bg-surface p-1.5 shadow-lift"
                    role="menu"
                  >
                    <div className="border-b border-line px-3 py-2.5">
                      <p className="text-[13px] font-medium">@{user.username}</p>
                      <p className="mt-0.5 text-[11.5px] text-muted">
                        {user.points.toLocaleString()} points
                      </p>
                    </div>
                    <MenuLink href={`/u/${user.username}`} icon={<UserIcon size={15} />}>
                      Profile
                    </MenuLink>
                    <MenuLink href="/settings" icon={<Settings size={15} />}>
                      Settings
                    </MenuLink>
                    {user.role === "admin" && (
                      <MenuLink href="/admin" icon={<LayoutDashboard size={15} />}>
                        Admin dashboard
                      </MenuLink>
                    )}
                    <form action={logoutAction}>
                      <button
                        type="submit"
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] text-muted transition-colors hover:bg-subtle hover:text-ink"
                      >
                        <LogOut size={15} />
                        Sign out
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/login"
              className={cn(
                buttonClasses({ variant: "ghost", size: "sm" }),
                "hidden lg:inline-flex",
              )}
            >
              Sign in
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-subtle lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line bg-paper/95 backdrop-blur-xl lg:hidden"
          >
            <div className="container-page space-y-1 py-5">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block rounded-xl px-3 py-2.5 text-[17px] tracking-tight",
                    isActive(item.href) ? "bg-subtle font-medium text-ink" : "text-ink",
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="my-3 h-px bg-line" />
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <Avatar name={user.username} src={user.avatar_url} size="md" />
                    <div>
                      <p className="text-[14px] font-medium">@{user.username}</p>
                      <p className="text-[12px] text-muted">
                        {user.points.toLocaleString()} points
                      </p>
                    </div>
                  </div>
                  <Link href={`/u/${user.username}`} className="block rounded-xl px-3 py-2.5 text-[15px]">
                    Profile
                  </Link>
                  <Link href="/settings" className="block rounded-xl px-3 py-2.5 text-[15px]">
                    Settings
                  </Link>
                  {user.role === "admin" && (
                    <Link href="/admin" className="block rounded-xl px-3 py-2.5 text-[15px]">
                      Admin dashboard
                    </Link>
                  )}
                  <form action={logoutAction} className="pt-1">
                    <button
                      type="submit"
                      className="w-full rounded-xl px-3 py-2.5 text-left text-[15px] text-muted"
                    >
                      Sign out
                    </button>
                  </form>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 px-1 pt-1">
                  <Link href="/login" className={buttonClasses({ variant: "secondary", size: "md" })}>
                    Sign in
                  </Link>
                  <Link href="/signup" className={buttonClasses({ variant: "primary", size: "md" })}>
                    Create account
                  </Link>
                </div>
              )}
              <Link
                href="/submit"
                className={cn(buttonClasses({ variant: "secondary", size: "md" }), "mt-2 w-full")}
              >
                <Plus size={16} />
                Submit artwork
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function MenuLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] text-muted transition-colors hover:bg-subtle hover:text-ink"
    >
      {icon}
      {children}
    </Link>
  );
}
