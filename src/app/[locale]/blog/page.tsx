import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BlogPageClient } from "@/components/blog/BlogPageClient";
import { getPublishedArticles, getArticlesTimeline } from "@/lib/cms";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("blogTitle"), description: t("blogDescription") };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [articles, timeline] = await Promise.all([
    getPublishedArticles(),
    getArticlesTimeline(),
  ]);

  return <BlogPageClient articles={articles} timeline={timeline} />;
}
