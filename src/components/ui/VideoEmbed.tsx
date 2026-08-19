import { isYouTubeUrl, toYouTubeEmbed } from "@/lib/video";

interface VideoEmbedProps {
  src: string;
  className?: string;
  title?: string;
}

export function VideoEmbed({ src, className, title = "Video" }: VideoEmbedProps) {
  if (!src || (!isYouTubeUrl(src) && !src.startsWith("/") && !src.startsWith("http"))) {
    return null;
  }

  if (isYouTubeUrl(src)) {
    return (
      <div className={className}>
        <iframe
          src={toYouTubeEmbed(src)}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full aspect-video rounded-sm border border-white/10"
        />
      </div>
    );
  }

  return (
    <video
      src={src}
      controls
      playsInline
      className={className ?? "w-full rounded-sm border border-white/10"}
    />
  );
}
