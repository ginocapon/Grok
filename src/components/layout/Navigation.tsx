"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const navItems = [
  { key: "home", href: "/" as const },
  { key: "projects", href: "/projects" as const },
  { key: "blog", href: "/blog" as const },
  { key: "about", href: "/about" as const },
  { key: "contact", href: "/contact" as const },
] as const;

function useLocaleSwitchHref():
  | "/"
  | "/projects"
  | "/blog"
  | "/about"
  | "/contact"
  | "/privacy"
  | "/cookies"
  | "/digital-transparency"
  | { pathname: "/blog/[slug]"; params: { slug: string } }
  | { pathname: "/projects/[slug]"; params: { slug: string } } {
  const pathname = usePathname();
  const params = useParams();

  if (pathname === "/blog/[slug]" && params.slug) {
    return {
      pathname: "/blog/[slug]",
      params: { slug: String(params.slug) },
    };
  }

  if (pathname === "/projects/[slug]" && params.slug) {
    return {
      pathname: "/projects/[slug]",
      params: { slug: String(params.slug) },
    };
  }

  const staticPaths = [
    "/",
    "/projects",
    "/blog",
    "/about",
    "/contact",
    "/privacy",
    "/cookies",
    "/digital-transparency",
  ] as const;

  if (staticPaths.includes(pathname as (typeof staticPaths)[number])) {
    return pathname as (typeof staticPaths)[number];
  }

  return "/";
}

function isNavActive(pathname: string, href: string): boolean {
  if (href === "/blog") return pathname === "/blog" || pathname === "/blog/[slug]";
  if (href === "/projects") return pathname === "/projects" || pathname === "/projects/[slug]";
  return pathname === href;
}

export function Navigation() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const localeSwitchHref = useLocaleSwitchHref();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const otherLocale = locale === "en" ? "it" : "en";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-bg/90 backdrop-blur-md border-b border-white/5"
            : "bg-transparent"
        )}
      >
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5"
          aria-label="Main navigation"
        >
          <Link
            href="/"
            className="font-display text-xl font-bold tracking-tight text-text-primary hover:text-accent transition-colors"
          >
            GROK
          </Link>

          <ul className="hidden md:flex items-center gap-8">
            {navItems.map(({ key, href }) => (
              <li key={key}>
                <Link
                  href={href}
                  className={cn(
                    "font-mono-tech text-xs tracking-widest transition-colors hover:text-accent",
                    isNavActive(pathname, href) ? "text-accent" : "text-text-secondary"
                  )}
                >
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <Link
              href={localeSwitchHref}
              locale={otherLocale}
              className="font-mono-tech text-xs tracking-widest text-text-secondary hover:text-accent transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={`Switch to ${otherLocale.toUpperCase()}`}
            >
              {otherLocale.toUpperCase()}
            </Link>

            <button
              type="button"
              className="md:hidden btn-icon-3d min-w-[44px] min-h-[44px] w-11 h-11"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </header>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-bg/98 backdrop-blur-lg md:hidden flex flex-col items-center justify-center gap-8"
          role="dialog"
          aria-modal="true"
        >
          {navItems.map(({ key, href }) => (
            <Link
              key={key}
              href={href}
              className="font-display text-4xl font-bold tracking-tight text-text-primary hover:text-accent transition-colors"
            >
              {t(key)}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
