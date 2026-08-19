import { NextRequest } from "next/server";

export function verifyAdmin(request: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET ?? "grok-admin";
  const header = request.headers.get("x-admin-secret");
  const cookie = request.cookies.get("admin_secret")?.value;
  return header === secret || cookie === secret;
}

export function adminUnauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export { isYouTubeUrl, toYouTubeEmbed } from "@/lib/video";
