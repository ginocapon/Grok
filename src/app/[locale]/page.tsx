import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { HomeIntro } from "@/components/home/HomeIntro";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { AboutPreview } from "@/components/home/AboutPreview";
import { FeaturedBlog } from "@/components/home/FeaturedBlog";
import { HomeContact } from "@/components/home/HomeContact";
import { getFeaturedProjects, getFeaturedArticles, getSiteSettings } from "@/lib/cms";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: t("homeTitle"),
    description: t("homeDescription"),
    openGraph: {
      title: t("homeTitle"),
      description: t("homeDescription"),
      type: "website",
      locale: locale === "it" ? "it_IT" : "en_US",
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [settings, projects, articles] = await Promise.all([
    getSiteSettings(),
    getFeaturedProjects(6),
    getFeaturedArticles(6),
  ]);

  return (
    <>
      <Hero posterUrl={settings.hero.posterUrl} videoUrl={settings.hero.videoUrl} />
      <HomeIntro />
      <FeaturedProjects projects={projects} />
      <AboutPreview />
      <FeaturedBlog articles={articles} />
      <HomeContact />
    </>
  );
}
