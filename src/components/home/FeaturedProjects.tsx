"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";
import { useLocale, useTranslations } from "next-intl";
import { getLocalized } from "@/lib/i18n-content";
import { ScrollReveal } from "@/components/ui/Reveal";
import { ArrowRight } from "lucide-react";

interface FeaturedProjectsProps {
  projects: Project[];
}

const layoutClasses = [
  "md:col-span-7 md:row-span-2",
  "md:col-span-5",
  "md:col-span-5",
  "md:col-span-12",
  "md:col-span-5",
  "md:col-span-7 md:row-span-2",
];

function ProjectCard({ project, className, index }: { project: Project; className?: string; index: number }) {
  const locale = useLocale() as "en" | "it";
  const t = useTranslations("projects");

  return (
    <Link
      href={{ pathname: "/projects/[slug]", params: { slug: project.slug } }}
      className={cn(
        "group relative overflow-hidden rounded-sm bg-surface border border-white/5",
        "transition-all duration-500 hover:border-accent/30 hover:shadow-[0_20px_60px_rgba(255,42,26,0.1)]",
        "min-h-[280px]",
        className
      )}
    >
      <div className="absolute inset-0">
        {project.heroImage ? (
          <Image
            src={project.heroImage}
            alt={getLocalized(project.title, locale)}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="h-full w-full bg-surface-2 flex items-center justify-center">
            <span className="font-mono-tech text-xs text-text-secondary">FRAME {String(index + 1).padStart(3, "0")}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
      </div>

      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
        <span className="font-mono-tech text-xs text-accent mb-2">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="font-display text-2xl md:text-3xl font-bold text-text-primary group-hover:text-accent-light transition-colors">
          {getLocalized(project.title, locale)}
        </h3>
        <p className="mt-2 text-sm text-text-secondary line-clamp-2">
          {getLocalized(project.description, locale)}
        </p>
      </div>
    </Link>
  );
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const t = useTranslations("projects");

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-surface/50">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-16">
            <div>
              <span className="font-mono-tech text-xs text-accent">03 — WORK</span>
              <h2 className="mt-4 font-display text-4xl md:text-6xl font-bold tracking-tight">
                {t("title")}
              </h2>
            </div>
            <Link
              href="/projects"
              className="hidden md:inline-flex items-center gap-2 font-mono-tech text-xs tracking-widest text-text-secondary hover:text-accent transition-colors"
            >
              {t("viewAll")}
              <ArrowRight size={14} />
            </Link>
          </div>
        </ScrollReveal>

        {projects.length === 0 ? (
          <div className="rounded-sm border border-dashed border-white/10 p-16 text-center">
            <p className="font-mono-tech text-sm text-text-secondary">{t("empty")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 auto-rows-[minmax(200px,auto)]">
            {projects.slice(0, 6).map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                className={layoutClasses[i] ?? "md:col-span-6"}
              />
            ))}
          </div>
        )}

        <div className="mt-8 md:hidden">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 font-mono-tech text-xs tracking-widest text-accent"
          >
            {t("viewAll")}
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
