import { getTranslations } from "next-intl/server";
import { ContactForm } from "@/components/contact/ContactForm";
import { ScrollReveal } from "@/components/ui/Reveal";

export async function HomeContact() {
  const t = await getTranslations("contact");

  return (
    <section id="contact" className="py-24 md:py-32 px-6 md:px-12">
      <div className="mx-auto max-w-3xl">
        <ScrollReveal>
          <span className="font-mono-tech text-xs text-accent">06 — CONTACT</span>
          <h2 className="mt-4 font-display text-4xl md:text-6xl font-bold tracking-tight">
            {t("headline")}
          </h2>
          <p className="mt-6 text-lg text-text-secondary">{t("subheadline")}</p>
        </ScrollReveal>

        <div className="mt-12">
          <ContactForm compact />
        </div>
      </div>
    </section>
  );
}
