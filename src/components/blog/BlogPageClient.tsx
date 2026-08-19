"use client";

import { useState } from "react";
import { SiteImage } from "@/components/ui/SiteImage";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { getLocalized } from "@/lib/i18n-content";
import { MONTH_NAMES } from "@/lib/constants";
import type { BlogArticle, BlogCategory } from "@/types";
import { cn } from "@/lib/utils";

const CATEGORIES: BlogCategory[] = [
  "filmmaking", "cameras", "gear", "lighting", "editing",
  "color-grading", "audio", "ai", "video-marketing", "social-video",
  "behind-the-scenes", "case-studies", "creative-process",
];

interface BlogPageClientProps {
  articles: BlogArticle[];
  timeline: Record<number, Record<number, BlogArticle[]>>;
}

export function BlogPageClient({ articles, timeline }: BlogPageClientProps) {
  const t = useTranslations("blog");
  const locale = useLocale() as "en" | "it";
  const [mode, setMode] = useState<"latest" | "categories" | "archive">("latest");
  const [activeCategory, setActiveCategory] = useState<BlogCategory | null>(null);
  const years = Object.keys(timeline).map(Number).sort((a, b) => b - a);

  const displayed =
    mode === "categories" && activeCategory
      ? articles.filter((a) => a.category === activeCategory)
      : articles;

  return (
    <div className="pt-32 pb-24 px-6 md:px-12">
      <div className="mx-auto max-w-7xl">
        <span className="font-mono-tech text-xs text-accent">BLOG</span>
        <h1 className="mt-4 font-display text-5xl md:text-7xl font-bold tracking-tight">
          {t("title")}
        </h1>

        <div className="mt-10 flex flex-wrap gap-2">
          {(["latest", "categories", "archive"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); setActiveCategory(null); }}
              className={cn(
                "font-mono-tech text-xs tracking-widest px-6 py-3 min-h-[44px] border rounded-sm transition-colors",
                mode === m
                  ? "border-accent text-accent bg-accent/10"
                  : "border-white/10 text-text-secondary hover:border-white/30"
              )}
            >
              {t(m)}
            </button>
          ))}
        </div>

        {mode === "categories" && (
          <div className="mt-6 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "font-mono-tech text-xs px-3 py-2 min-h-[44px] border rounded-sm transition-colors uppercase",
                  activeCategory === cat
                    ? "border-accent text-accent"
                    : "border-white/10 text-text-secondary hover:border-white/30"
                )}
              >
                {cat.replace("-", " ")}
              </button>
            ))}
          </div>
        )}

        <div className="mt-12">
          {mode === "archive" ? (
            <div className="space-y-16">
              {years.map((year) => (
                <div key={year}>
                  <h2 className="font-display text-4xl font-bold text-accent mb-8">{year}</h2>
                  {Object.keys(timeline[year])
                    .map(Number)
                    .sort((a, b) => b - a)
                    .map((month) => (
                      <div key={month} className="mb-10">
                        <h3 className="font-mono-tech text-sm text-text-secondary mb-4">
                          {MONTH_NAMES[locale][month - 1]}
                        </h3>
                        <div className="space-y-3">
                          {timeline[year][month].map((article) => (
                            <ArticleRow key={article.id} article={article} locale={locale} />
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          ) : displayed.length === 0 ? (
            <p className="font-mono-tech text-sm text-text-secondary text-center py-16">{t("empty")}</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {displayed.map((article) => (
                <ArticleCard key={article.id} article={article} locale={locale} t={t} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ArticleCard({
  article,
  locale,
  t,
}: {
  article: BlogArticle;
  locale: "en" | "it";
  t: ReturnType<typeof useTranslations<"blog">>;
}) {
  return (
    <Link
      href={{ pathname: "/blog/[slug]", params: { slug: article.slug } }}
      className="group block overflow-hidden rounded-sm border border-white/5 bg-surface hover:border-accent/30 transition-all"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {article.featuredImage ? (
          <SiteImage
            src={article.featuredImage}
            alt={getLocalized(article.title, locale)}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="33vw"
          />
        ) : (
          <div className="h-full w-full bg-surface-2" />
        )}
      </div>
      <div className="p-6">
        <div className="font-mono-tech text-xs text-accent uppercase mb-2">
          {article.category.replace("-", " ")}
        </div>
        <h3 className="font-display text-xl font-bold group-hover:text-accent transition-colors">
          {getLocalized(article.title, locale)}
        </h3>
        <p className="mt-2 text-sm text-text-secondary line-clamp-2">
          {getLocalized(article.excerpt, locale)}
        </p>
        <p className="mt-3 font-mono-tech text-xs text-text-secondary">
          {article.readingTimeMinutes} {t("readingTime")}
        </p>
      </div>
    </Link>
  );
}

function ArticleRow({ article, locale }: { article: BlogArticle; locale: "en" | "it" }) {
  return (
    <Link
      href={{ pathname: "/blog/[slug]", params: { slug: article.slug } }}
      className="group flex items-center gap-4 p-3 rounded-sm hover:bg-surface transition-colors"
    >
      <h4 className="font-display text-lg font-bold group-hover:text-accent transition-colors flex-1">
        {getLocalized(article.title, locale)}
      </h4>
      <span className="font-mono-tech text-xs text-text-secondary">
        {new Date(article.publishedAt).toLocaleDateString(locale)}
      </span>
    </Link>
  );
}
