import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, adminUnauthorized } from "@/lib/admin/auth";

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  const secret = process.env.ADMIN_SECRET ?? "grok-admin";

  if (password !== secret) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("admin_secret", secret, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}

export async function DELETE(request: NextRequest) {
  if (!verifyAdmin(request)) return adminUnauthorized();
  const response = NextResponse.json({ success: true });
  response.cookies.delete("admin_secret");
  return response;
}
