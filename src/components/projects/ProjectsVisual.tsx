"use client";

import { useState } from "react";
import { SiteImage } from "@/components/ui/SiteImage";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { getLocalized } from "@/lib/i18n-content";
import type { Project, ProjectCategory } from "@/types";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/ui/Reveal";

const CATEGORIES: (ProjectCategory | "all")[] = [
  "all", "commercial", "brand-film", "fashion", "music",
  "social", "events", "short-film", "experimental",
];

interface ProjectsVisualProps {
  projects: Project[];
}

export function ProjectsVisual({ projects }: ProjectsVisualProps) {
  const t = useTranslations("projects");
  const locale = useLocale() as "en" | "it";
  const [filter, setFilter] = useState<ProjectCategory | "all">("all");

  const filtered =
    filter === "all" ? projects : projects.filter((p) => p.category === filter);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-12">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            className={cn(
              "font-mono-tech text-xs tracking-widest px-4 py-2 min-h-[44px] border rounded-sm transition-colors",
              filter === cat
                ? "border-accent text-accent bg-accent/10"
                : "border-white/10 text-text-secondary hover:border-white/30"
            )}
          >
            {t(`filters.${cat}`)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="font-mono-tech text-sm text-text-secondary text-center py-16">
          {t("empty")}
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, i) => (
            <ScrollReveal key={project.id}>
              <Link
                href={{ pathname: "/projects/[slug]", params: { slug: project.slug } }}
                className="group block overflow-hidden rounded-sm border border-white/5 bg-surface hover:border-accent/30 transition-all"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  {project.heroImage ? (
                    <SiteImage
                      src={project.heroImage}
                      alt={getLocalized(project.title, locale)}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="h-full w-full bg-surface-2 flex items-center justify-center">
                      <span className="font-mono-tech text-xs text-text-secondary">
                        TAKE {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold group-hover:text-accent transition-colors">
                    {getLocalized(project.title, locale)}
                  </h3>
                  <p className="mt-2 text-sm text-text-secondary line-clamp-2">
                    {getLocalized(project.description, locale)}
                  </p>
                  <div className="mt-2 flex gap-3 font-mono-tech text-xs text-text-secondary">
                    {project.client && <span>{project.client}</span>}
                    <span>{project.year}</span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}
