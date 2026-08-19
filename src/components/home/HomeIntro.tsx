import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ScrollReveal } from "@/components/ui/Reveal";
import { ArrowRight } from "lucide-react";

export async function HomeIntro() {
  const t = await getTranslations("intro");

  return (
    <section className="py-24 md:py-32 px-6 md:px-12">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="grid gap-12 md:grid-cols-12 md:gap-16 items-end">
            <div className="md:col-span-2">
              <span className="font-mono-tech text-xs text-accent">02 — INTRO</span>
            </div>
            <div className="md:col-span-8">
              <p className="font-display text-3xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-text-primary">
                {t("text")}
              </p>
            </div>
            <div className="md:col-span-2 md:text-right">
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 font-mono-tech text-xs tracking-widest text-text-secondary hover:text-accent transition-colors min-h-[44px]"
              >
                {t("cta")}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
