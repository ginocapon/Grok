"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { getLocalized } from "@/lib/i18n-content";
import type { BlogArticle } from "@/types";
import { ScrollReveal } from "@/components/ui/Reveal";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeaturedBlogProps {
  articles: BlogArticle[];
}

export function FeaturedBlog({ articles }: FeaturedBlogProps) {
  const t = useTranslations("blog");
  const locale = useLocale() as "en" | "it";

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-surface/30">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-16">
            <div>
              <span className="font-mono-tech text-xs text-accent">05 — BLOG</span>
              <h2 className="mt-4 font-display text-4xl md:text-6xl font-bold tracking-tight">
                {t("title")}
              </h2>
            </div>
            <Link
              href="/blog"
              className="hidden md:inline-flex items-center gap-2 font-mono-tech text-xs tracking-widest text-text-secondary hover:text-accent transition-colors"
            >
              {t("viewAll")}
              <ArrowRight size={14} />
            </Link>
          </div>
        </ScrollReveal>

        {articles.length === 0 ? (
          <div className="rounded-sm border border-dashed border-white/10 p-16 text-center">
            <p className="font-mono-tech text-sm text-text-secondary">{t("empty")}</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.slice(0, 6).map((article, i) => (
              <Link
                key={article.id}
                href={{ pathname: "/blog/[slug]", params: { slug: article.slug } }}
                className={cn(
                  "group block overflow-hidden rounded-sm border border-white/5 bg-surface transition-all hover:border-accent/30",
                  i === 0 && "md:col-span-2 lg:col-span-2 lg:row-span-2"
                )}
              >
                <div className={cn("relative overflow-hidden", i === 0 ? "aspect-[16/9]" : "aspect-[16/10]")}>
                  {article.featuredImage ? (
                    <Image
                      src={article.featuredImage}
                      alt={getLocalized(article.title, locale)}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="h-full w-full bg-surface-2" />
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 font-mono-tech text-xs text-text-secondary mb-3">
                    <span className="text-accent uppercase">{article.category.replace("-", " ")}</span>
                    <span>·</span>
                    <span>{article.readingTimeMinutes} {t("readingTime")}</span>
                  </div>
                  <h3 className={cn(
                    "font-display font-bold text-text-primary group-hover:text-accent-light transition-colors",
                    i === 0 ? "text-2xl md:text-3xl" : "text-xl"
                  )}>
                    {getLocalized(article.title, locale)}
                  </h3>
                  <p className="mt-2 text-sm text-text-secondary line-clamp-2">
                    {getLocalized(article.excerpt, locale)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
