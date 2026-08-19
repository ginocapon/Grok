import { AdminNav } from "@/components/admin/AdminNav";
import fs from "fs/promises";
import path from "path";

export const metadata = { title: "GROK — Admin", robots: { index: false } };

async function getGrokData() {
  const dir = path.join(process.cwd(), "grok");
  const [config, history, approved, rejected] = await Promise.all([
    fs.readFile(path.join(dir, "grok-config.json"), "utf-8").then(JSON.parse).catch(() => ({})),
    fs.readFile(path.join(dir, "grok-history.json"), "utf-8").then(JSON.parse).catch(() => []),
    fs.readFile(path.join(dir, "grok-approved.json"), "utf-8").then(JSON.parse).catch(() => []),
    fs.readFile(path.join(dir, "grok-rejected.json"), "utf-8").then(JSON.parse).catch(() => []),
  ]);
  return { config, history, approved, rejected };
}

export default async function AdminGrokPage() {
  const { config, history, approved, rejected } = await getGrokData();

  return (
    <div className="flex min-h-screen bg-bg">
      <AdminNav current="/admin/grok" />
      <main className="flex-1 p-8">
        <h1 className="font-display text-3xl font-bold mb-2">GROK Evolution Engine</h1>
        <p className="font-mono-tech text-xs text-text-secondary mb-8">
          Creative research · Design scout · UX auditor · SEO scout
        </p>

        <div className="grid gap-4 md:grid-cols-3 mb-12">
          <div className="p-4 border border-white/10 rounded-sm bg-surface">
            <p className="font-mono-tech text-xs text-accent">COMMANDS</p>
            <p className="mt-2 text-sm text-text-secondary">
              GROK · SCAN · IDEAS · MOTION · DESIGN · VIDEO · SEO · AI · AUDIT · EVOLVE
            </p>
          </div>
          <div className="p-4 border border-white/10 rounded-sm bg-surface">
            <p className="font-mono-tech text-xs text-accent">LAST SCAN</p>
            <p className="mt-2 text-sm">{config.lastScan ?? "Never"}</p>
          </div>
          <div className="p-4 border border-white/10 rounded-sm bg-surface">
            <p className="font-mono-tech text-xs text-accent">NEXT SCAN</p>
            <p className="mt-2 text-sm">{config.nextScan ?? "Not scheduled"}</p>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="font-display text-xl font-bold mb-4">Recent History</h2>
          {history.length === 0 ? (
            <p className="font-mono-tech text-sm text-text-secondary">No scans yet. Run GROK SCAN to begin.</p>
          ) : (
            <div className="space-y-3">
              {history.slice(-5).reverse().map((entry: { date: string; type: string; summary: string }, i: number) => (
                <div key={i} className="p-4 border border-white/10 rounded-sm">
                  <p className="font-mono-tech text-xs text-accent">{entry.date} — {entry.type}</p>
                  <p className="mt-1 text-sm text-text-secondary">{entry.summary}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="grid gap-8 md:grid-cols-2">
          <section>
            <h2 className="font-display text-xl font-bold mb-4 text-green-400">Approved ({approved.length})</h2>
            {approved.length === 0 && <p className="text-sm text-text-secondary">None yet</p>}
          </section>
          <section>
            <h2 className="font-display text-xl font-bold mb-4 text-red-400">Rejected ({rejected.length})</h2>
            {rejected.length === 0 && <p className="text-sm text-text-secondary">None yet</p>}
          </section>
        </div>
      </main>
    </div>
  );
}
