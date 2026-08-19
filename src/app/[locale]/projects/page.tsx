import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProjectsPageClient } from "@/components/projects/ProjectsPageClient";
import { getPublishedProjects, getProjectsTimeline } from "@/lib/cms";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("projectsTitle"), description: t("projectsDescription") };
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [projects, timeline] = await Promise.all([
    getPublishedProjects(),
    getProjectsTimeline(),
  ]);

  return <ProjectsPageClient projects={projects} timeline={timeline} />;
}
