import { SiteImage } from "@/components/ui/SiteImage";

function renderBlock(text: string, keyPrefix: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];

  lines.forEach((line, j) => {
    const key = `${keyPrefix}-${j}`;
    const trimmed = line.trim();

    if (!trimmed) {
      elements.push(<div key={key} className="h-4" />);
      return;
    }

    const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imgMatch) {
      const [, alt, src] = imgMatch;
      elements.push(
        <figure key={key} className="my-8">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm border border-white/10">
            <SiteImage src={src} alt={alt || ""} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" />
          </div>
          {alt && (
            <figcaption className="mt-2 font-mono-tech text-xs text-text-secondary">{alt}</figcaption>
          )}
        </figure>
      );
      return;
    }

    if (trimmed.startsWith("## ")) {
      elements.push(
        <h2 key={key} className="font-display text-2xl md:text-3xl font-bold text-text-primary mt-10 mb-4">
          {trimmed.replace("## ", "")}
        </h2>
      );
      return;
    }

    if (trimmed.startsWith("# ")) {
      elements.push(
        <h3 key={key} className="font-display text-xl font-bold text-text-primary mt-8 mb-3">
          {trimmed.replace("# ", "")}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith("*") && trimmed.endsWith("*") && !trimmed.startsWith("**")) {
      elements.push(
        <p key={key} className="font-mono-tech text-xs text-text-secondary italic my-2">
          {trimmed.replace(/^\*|\*$/g, "")}
        </p>
      );
      return;
    }

    if (/^\d+\./.test(trimmed)) {
      elements.push(
        <p key={key} className="ml-4 my-2 text-text-secondary leading-relaxed">
          {trimmed}
        </p>
      );
      return;
    }

    elements.push(
      <p key={key} className="my-3 text-base md:text-lg text-text-secondary leading-relaxed">
        {trimmed}
      </p>
    );
  });

  return elements;
}

export function RichContent({ content }: { content: string }) {
  if (!content?.trim()) {
    return (
      <p className="font-mono-tech text-sm text-text-secondary italic">
        Contenuto in arrivo.
      </p>
    );
  }

  return (
    <div className="max-w-3xl">
      {renderBlock(content, "block")}
    </div>
  );
}

/** Parse project case study blocks like "THE IDEA", "THE PRODUCTION", etc. */
export function CaseStudyContent({
  content,
  labels,
}: {
  content: string;
  labels: Record<string, string>;
}) {
  if (!content?.trim()) {
    return <RichContent content="" />;
  }

  const sectionPattern = /\n(?=(?:THE |L'|IL |LA |LE |LO |GLI |I ))/i;
  const rawSections = content.split(sectionPattern).filter(Boolean);

  if (rawSections.length <= 1) {
    return <RichContent content={content} />;
  }

  return (
    <div className="space-y-16">
      {rawSections.map((section, i) => {
        const lines = section.trim().split("\n");
        const heading = lines[0]?.trim() ?? "";
        const body = lines.slice(1).join("\n").trim();

        const labelKey = heading.toLowerCase().includes("idea")
          ? "idea"
          : heading.toLowerCase().includes("production") || heading.toLowerCase().includes("produzione")
            ? "production"
            : heading.toLowerCase().includes("shoot") || heading.toLowerCase().includes("riprese")
              ? "shoot"
              : heading.toLowerCase().includes("edit") || heading.toLowerCase().includes("montaggio")
                ? "edit"
                : null;

        return (
          <section key={i} className="border-b border-white/5 pb-12 last:border-0">
            <h2 className="font-mono-tech text-xs text-accent mb-6 tracking-widest">
              {labelKey && labels[labelKey] ? labels[labelKey] : heading}
            </h2>
            <RichContent content={body || section} />
          </section>
        );
      })}
    </div>
  );
}
