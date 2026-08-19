import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteImage } from "@/components/ui/SiteImage";
import { getTranslations, setRequestLocale, getLocale } from "next-intl/server";
import { getArticleBySlug, getPublishedArticles, getBlogArticles } from "@/lib/cms";
import { getLocalized } from "@/lib/i18n-content";
import { Link } from "@/i18n/navigation";
import { ArticleContent } from "@/components/blog/ArticleContent";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const articles = await getBlogArticles();
  const locales = ["en", "it"] as const;
  return locales.flatMap((locale) =>
    articles.filter((a) => a.published).map((a) => ({ locale, slug: a.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article not found" };
  const locale = (await getLocale()) as "en" | "it";
  return {
    title: article.seo.title || getLocalized(article.title, locale),
    description: article.seo.description || getLocalized(article.excerpt, locale),
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as "en" | "it";
  const t = await getTranslations("blog");

  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const related = (await getPublishedArticles())
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  return (
    <article className="pt-32 pb-24">
      <div className="mx-auto max-w-3xl px-6 md:px-12">
        <div className="font-mono-tech text-xs text-accent uppercase mb-4">
          {article.category.replace("-", " ")}
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight">
          {getLocalized(article.title, loc)}
        </h1>
        {getLocalized(article.subtitle, loc) && (
          <p className="mt-4 text-xl text-text-secondary">
            {getLocalized(article.subtitle, loc)}
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-4 font-mono-tech text-xs text-text-secondary">
          <span>{article.author}</span>
          <span>·</span>
          <time dateTime={article.publishedAt}>
            {new Date(article.publishedAt).toLocaleDateString(loc)}
          </time>
          <span>·</span>
          <span>{article.readingTimeMinutes} {t("readingTime")}</span>
        </div>

        {article.featuredImage && (
          <div className="relative aspect-[16/9] mt-12 overflow-hidden rounded-sm border border-white/10">
            <SiteImage
              src={article.featuredImage}
              alt={getLocalized(article.title, loc)}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-white/10">
          <ArticleContent content={getLocalized(article.content, loc)} />
        </div>

        {article.cartoonImage && (
          <div className="relative aspect-[16/9] mt-12 overflow-hidden rounded-sm border border-accent/20">
            <SiteImage
              src={article.cartoonImage}
              alt={`${getLocalized(article.title, loc)} — cartoon alter ego (AI-generated)`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
            <span className="absolute top-3 left-3 font-mono-tech text-xs bg-bg/80 px-2 py-1 text-accent border border-accent/30">
              ALTER EGO · AI
            </span>
          </div>
        )}

        {related.length > 0 && (
          <section className="mt-20 pt-12 border-t border-white/10">
            <h2 className="font-display text-2xl font-bold mb-6">Related</h2>
            <div className="space-y-3">
              {related.map((a) => (
                <Link
                  key={a.id}
                  href={{ pathname: "/blog/[slug]", params: { slug: a.slug } }}
                  className="block font-display text-lg hover:text-accent transition-colors"
                >
                  {getLocalized(a.title, loc)}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
