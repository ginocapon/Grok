import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { saveContactSubmission } from "@/lib/cms";

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  company: z.string().max(100).nullable().optional(),
  projectType: z.string().max(100).nullable().optional(),
  budget: z.string().max(100).nullable().optional(),
  timeline: z.string().max(100).nullable().optional(),
  message: z.string().min(10).max(5000),
  gdprConsent: z.literal(true),
  locale: z.enum(["en", "it"]),
});

const rateLimit = new Map<string, { count: number; reset: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.reset) {
    rateLimit.set(ip, { count: 1, reset: now + 60_000 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const data = contactSchema.parse(body);

    const submission = await saveContactSubmission({
      name: data.name,
      email: data.email,
      company: data.company ?? null,
      projectType: data.projectType ?? null,
      budget: data.budget ?? null,
      timeline: data.timeline ?? null,
      message: data.message,
      gdprConsent: data.gdprConsent,
      locale: data.locale,
    });

    return NextResponse.json({ success: true, id: submission.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
