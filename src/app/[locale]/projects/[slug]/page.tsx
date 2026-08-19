import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteImage } from "@/components/ui/SiteImage";
import { getTranslations, setRequestLocale, getLocale } from "next-intl/server";
import { getProjectBySlug, getPublishedProjects, getProjects } from "@/lib/cms";
import { getLocalized } from "@/lib/i18n-content";
import { ContactForm } from "@/components/contact/ContactForm";
import { Link } from "@/i18n/navigation";
import { VideoEmbed } from "@/components/ui/VideoEmbed";
import { CaseStudyContent } from "@/components/content/RichContent";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const projects = await getProjects();
  const locales = ["en", "it"] as const;
  return locales.flatMap((locale) =>
    projects.filter((p) => p.published).map((p) => ({ locale, slug: p.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  const locale = (await getLocale()) as "en" | "it";
  return {
    title: getLocalized(project.title, locale),
    description: getLocalized(project.description, locale),
  };
}

export default async function ProjectCaseStudyPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as "en" | "it";
  const t = await getTranslations("caseStudy");
  const tp = await getTranslations("projects");

  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const related = (await getPublishedProjects())
    .filter((p) => p.id !== project.id && p.category === project.category)
    .slice(0, 3);

  const description = getLocalized(project.description, loc);
  const caseStudy = getLocalized(project.caseStudy, loc);

  const sectionLabels = {
    idea: t("idea"),
    production: t("production"),
    shoot: t("shoot"),
    edit: t("edit"),
  };

  return (
    <article className="pt-32 pb-24">
      <div className="relative h-[60vh] min-h-[400px] w-full">
        {project.heroImage ? (
          <SiteImage
            src={project.heroImage}
            alt={getLocalized(project.title, loc)}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="h-full w-full bg-surface-2" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="mx-auto max-w-7xl">
            <span className="font-mono-tech text-xs text-accent">
              {tp(`filters.${project.category}`)} · {project.year}
            </span>
            <h1 className="mt-4 font-display text-5xl md:text-7xl font-bold tracking-tight">
              {getLocalized(project.title, loc)}
            </h1>
            {project.client && (
              <p className="mt-4 font-mono-tech text-sm text-text-secondary">{project.client}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-12 py-16">
        {description && (
          <section className="max-w-3xl mb-16 pb-16 border-b border-white/10">
            <p className="text-xl md:text-2xl text-text-primary leading-relaxed font-display">
              {description}
            </p>
          </section>
        )}

        <div className="grid gap-8 md:grid-cols-4 border-b border-white/10 pb-16 mb-16">
          {project.role && (
            <div>
              <p className="font-mono-tech text-xs text-text-secondary">{tp("role")}</p>
              <p className="mt-1 text-text-primary">{project.role}</p>
            </div>
          )}
          <div>
            <p className="font-mono-tech text-xs text-text-secondary">{tp("year")}</p>
            <p className="mt-1 text-text-primary">{project.year}</p>
          </div>
          <div>
            <p className="font-mono-tech text-xs text-text-secondary">{tp("category")}</p>
            <p className="mt-1 text-text-primary">{tp(`filters.${project.category}`)}</p>
          </div>
        </div>

        <CaseStudyContent content={caseStudy} labels={sectionLabels} />

        {project.heroVideo && (
          <section className="py-16 mt-16 border-t border-white/10">
            <h2 className="font-mono-tech text-xs text-accent mb-6 tracking-widest">{t("finalFilm")}</h2>
            <VideoEmbed src={project.heroVideo} title={getLocalized(project.title, loc)} />
          </section>
        )}

        {project.gallery.length > 0 && (
          <section className="py-16 border-t border-white/10">
            <h2 className="font-mono-tech text-xs text-accent mb-8 tracking-widest">{t("bts")}</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {project.gallery.map((img, i) => (
                <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-sm">
                  <SiteImage src={img} alt="" fill className="object-cover" sizes="33vw" />
                </div>
              ))}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="py-16 border-t border-white/10">
            <h2 className="font-display text-3xl font-bold mb-8">{t("related")}</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={{ pathname: "/projects/[slug]", params: { slug: p.slug } }}
                  className="group block p-4 border border-white/5 rounded-sm hover:border-accent/30 transition-colors"
                >
                  <h3 className="font-display text-lg font-bold group-hover:text-accent transition-colors">
                    {getLocalized(p.title, loc)}
                  </h3>
                  <p className="font-mono-tech text-xs text-text-secondary mt-1">{p.year}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="py-16 border-t border-white/10">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-8">{t("contactCta")}</h2>
          <ContactForm compact />
        </section>
      </div>
    </article>
  );
}
