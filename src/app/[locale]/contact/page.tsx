import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/contact/ContactForm";
import { ScrollReveal } from "@/components/ui/Reveal";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("contactTitle"), description: t("contactDescription") };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <div className="pt-32 pb-24 px-6 md:px-12">
      <div className="mx-auto max-w-3xl">
        <ScrollReveal>
          <span className="font-mono-tech text-xs text-accent">CONTACT</span>
          <h1 className="mt-4 font-display text-4xl md:text-6xl font-bold tracking-tight">
            {t("headline")}
          </h1>
          <p className="mt-6 text-lg text-text-secondary">{t("subheadline")}</p>
        </ScrollReveal>
        <div className="mt-12">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
