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

export { slugify } from "@/lib/admin/slugify";

export { isYouTubeUrl, toYouTubeEmbed } from "@/lib/video";
