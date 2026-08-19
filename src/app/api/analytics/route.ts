import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import type { AnalyticsEvent } from "@/types";

const ANALYTICS_FILE = path.join(process.cwd(), "data", "analytics.json");

async function appendEvent(event: AnalyticsEvent) {
  let events: AnalyticsEvent[] = [];
  try {
    const raw = await fs.readFile(ANALYTICS_FILE, "utf-8");
    events = JSON.parse(raw);
  } catch {
    events = [];
  }
  events.push(event);
  if (events.length > 10000) events = events.slice(-5000);
  await fs.writeFile(ANALYTICS_FILE, JSON.stringify(events, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const event: AnalyticsEvent = {
      type: body.type ?? "page_view",
      path: body.path ?? "/",
      locale: body.locale ?? "en",
      metadata: body.metadata,
      timestamp: new Date().toISOString(),
    };
    await appendEvent(event);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
