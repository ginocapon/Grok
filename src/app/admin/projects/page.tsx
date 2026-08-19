import { AdminNav } from "@/components/admin/AdminNav";
import { getProjects } from "@/lib/cms";

export const metadata = { title: "Projects — Admin", robots: { index: false } };

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="flex min-h-screen bg-bg">
      <AdminNav current="/admin/projects" />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold">Projects</h1>
          <button type="button" className="btn-3d btn-3d-primary text-xs">
            + New Project
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="p-12 border border-dashed border-white/10 rounded-sm text-center">
            <p className="font-mono-tech text-sm text-text-secondary">
              No projects yet. Add your first project via CMS or admin UI.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-4 border border-white/10 rounded-sm bg-surface">
                <div>
                  <p className="font-display font-bold">{p.title.en}</p>
                  <p className="font-mono-tech text-xs text-text-secondary mt-1">
                    {p.client ?? "—"} · {p.year} · {p.published ? "Published" : "Draft"}
                  </p>
                </div>
                <span className={`font-mono-tech text-xs ${p.featured ? "text-accent" : "text-text-secondary"}`}>
                  {p.featured ? "FEATURED" : ""}
                </span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
