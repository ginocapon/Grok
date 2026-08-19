export function isYouTubeUrl(url: string): boolean {
  return /youtube\.com|youtu\.be/.test(url);
}

export function toYouTubeEmbed(url: string): string {
  if (url.startsWith("youtube:")) {
    return `https://www.youtube.com/embed/${url.replace("youtube:", "")}`;
  }
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}
