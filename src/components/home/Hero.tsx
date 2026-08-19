"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button3D } from "@/components/ui/Button3D";
import { FilmMeta } from "@/components/ui/FilmMeta";
import { Reveal } from "@/components/ui/Reveal";
import { Volume2, VolumeX, Pause, Play } from "lucide-react";

interface HeroProps {
  posterUrl: string | null;
  videoUrl: string | null;
}

export function Hero({ posterUrl, videoUrl }: HeroProps) {
  const t = useTranslations("hero");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted(!muted);
  };

  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden">
      <div className="absolute inset-0">
        {videoUrl ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            loop
            poster={posterUrl ?? undefined}
            className="h-full w-full object-cover"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : posterUrl ? (
          <Image
            src={posterUrl}
            alt="Grok — Filmmaker"
            fill
            priority
            className="object-cover object-center scale-105"
            sizes="100vw"
          />
        ) : (
          <div className="h-full w-full bg-surface" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-bg/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/80 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-24 pt-32 md:px-12 lg:pb-32">
        <div className="mx-auto w-full max-w-7xl">
          <Reveal delay={200}>
            <FilmMeta
              rec={t("rec")}
              fps={t("fps")}
              take={t("take")}
              className="mb-8"
            />
          </Reveal>

          <Reveal delay={400}>
            <h1 className="font-display text-[clamp(2.5rem,8vw,7rem)] font-bold leading-[0.95] tracking-tight text-text-primary max-w-4xl">
              {t("headline")}
            </h1>
          </Reveal>

          <Reveal delay={600}>
            <p className="mt-6 max-w-xl text-lg text-text-secondary md:text-xl">
              {t("subheadline")}
            </p>
          </Reveal>

          <Reveal delay={800}>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button3D variant="primary" href="/projects">
                {t("ctaSecondary")}
              </Button3D>
              <Button3D variant="secondary" href="/contact">
                {t("ctaTalk")}
              </Button3D>
            </div>
          </Reveal>
        </div>
      </div>

      {(videoUrl || posterUrl) && (
        <div className="absolute bottom-8 right-6 z-20 flex gap-2 md:right-12">
          {videoUrl && (
            <>
              <button
                type="button"
                onClick={togglePlay}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-bg/50 backdrop-blur-sm text-text-primary hover:border-accent transition-colors"
                aria-label={playing ? "Pause" : "Play"}
              >
                {playing ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <button
                type="button"
                onClick={toggleMute}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-bg/50 backdrop-blur-sm text-text-primary hover:border-accent transition-colors"
                aria-label={muted ? "Unmute" : "Mute"}
              >
                {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </>
          )}
        </div>
      )}
    </section>
  );
}
