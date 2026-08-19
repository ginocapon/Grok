import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "it"],
  defaultLocale: "en",
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/projects": {
      en: "/projects",
      it: "/progetti",
    },
    "/projects/[slug]": {
      en: "/projects/[slug]",
      it: "/progetti/[slug]",
    },
    "/blog": "/blog",
    "/blog/[slug]": "/blog/[slug]",
    "/about": "/about",
    "/contact": "/contact",
    "/privacy": "/privacy",
    "/cookies": "/cookies",
    "/digital-transparency": "/digital-transparency",
  },
});

export type Locale = (typeof routing.locales)[number];
export type Pathnames = keyof typeof routing.pathnames;
