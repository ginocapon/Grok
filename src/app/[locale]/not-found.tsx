import { Link } from "@/i18n/navigation";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <span className="font-mono-tech text-xs text-accent mb-4">404 — FRAME NOT FOUND</span>
      <h1 className="font-display text-6xl md:text-8xl font-bold text-text-primary">404</h1>
      <p className="mt-4 text-lg text-text-secondary max-w-md">
        This frame doesn&apos;t exist in the timeline.
      </p>
      <Link href="/" className="mt-8 btn-3d btn-3d-primary">
        BACK TO HOME
      </Link>
    </div>
  );
}
