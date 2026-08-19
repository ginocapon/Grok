"use client";

import { useState, useEffect, useCallback } from "react";
import type { Project, BlogArticle, ProjectCategory, BlogCategory } from "@/types";
import { cn } from "@/lib/utils";
import { SiteImage } from "@/components/ui/SiteImage";
import { isPagesAdmin, getGitHubToken } from "@/lib/admin/github-storage";
import {
  AdminAuthError,
  adminLoadProjects,
  adminLoadArticles,
  adminSaveProject,
  adminDeleteProject,
  adminSaveArticle,
  adminDeleteArticle,
  adminUploadFile,
  adminLoginLocal,
  adminLogoutLocal,
  clearAdminSession,
  startPagesAdminSession,
} from "@/lib/admin/admin-client";
import { Upload, Trash2, Save, Plus, LogOut, Film, FileText, ImageIcon } from "lucide-react";

type Tab = "projects" | "blog" | "media";

function LoginGate({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [githubToken, setGithubToken] = useState("");
  const [error, setError] = useState("");
  const pagesMode = isPagesAdmin();

  useEffect(() => {
    const saved = getGitHubToken();
    if (saved) setGithubToken(saved);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (pagesMode) {
      if (startPagesAdminSession(password, githubToken)) {
        onLogin();
      } else {
        setError("Password o token GitHub non validi");
      }
      return;
    }

    if (await adminLoginLocal(password)) onLogin();
    else setError("Password non valida");
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <form onSubmit={handleLogin} className="w-full max-w-md p-8 border border-white/10 rounded-sm bg-surface">
        <h1 className="font-display text-2xl font-bold mb-2">GROK Admin</h1>
        <p className="text-sm text-text-secondary mb-6">
          {pagesMode
            ? "Accedi per modificare contenuti e salvare su GitHub"
            : "Inserisci la password per gestire contenuti"}
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password admin"
          className="w-full bg-bg border border-white/10 rounded-sm px-4 py-3 text-sm mb-4 focus:border-accent focus:outline-none"
        />
        {pagesMode && (
          <>
            <input
              type="password"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              placeholder="GitHub Personal Access Token"
              className="w-full bg-bg border border-white/10 rounded-sm px-4 py-3 text-sm mb-4 focus:border-accent focus:outline-none"
            />
            <p className="font-mono-tech text-xs text-text-secondary mb-4 leading-relaxed">
              Il token viene salvato su questo browser — lo inserisci una sola volta.
              Crealo gratis su GitHub → Settings → Developer settings → Personal access tokens
              (permesso <strong className="text-text-primary">repo</strong>).
            </p>
          </>
        )}
        {error && <p className="text-sm text-accent mb-4">{error}</p>}
        <button type="submit" className="btn-3d btn-3d-primary w-full">ACCEDI</button>
        {!pagesMode && (
          <p className="mt-4 font-mono-tech text-xs text-text-secondary">Default locale: grok-admin</p>
        )}
      </form>
    </div>
  );
}

function MediaUpload({
  folder,
  onUploaded,
  label,
}: {
  folder: string;
  onUploaded: (url: string) => void;
  label: string;
}) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await adminUploadFile(folder, file);
      onUploaded(url);
    } catch {
      alert("Upload fallito. Verifica token GitHub e permessi repo.");
    }
    setUploading(false);
    e.target.value = "";
  };

  return (
    <label className="flex items-center gap-2 cursor-pointer font-mono-tech text-xs text-accent hover:text-accent-light transition-colors min-h-[44px]">
      <Upload size={14} />
      {uploading ? "CARICAMENTO..." : label}
      <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFile} />
    </label>
  );
}

function ProjectEditor({
  project,
  onSave,
  onDelete,
  onCancel,
}: {
  project: Partial<Project> & { id?: string };
  onSave: (p: Partial<Project>) => void;
  onDelete?: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(project);

  const set = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));
  const setLoc = (field: "title" | "description" | "caseStudy", lang: "en" | "it", value: string) =>
    setForm((f) => ({ ...f, [field]: { ...(f[field] as { en: string; it: string }), [lang]: value } }));

  const inputClass = "w-full bg-bg border border-white/10 rounded-sm px-3 py-2 text-sm focus:border-accent focus:outline-none";

  return (
    <div className="p-6 border border-white/10 rounded-sm bg-surface space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="font-mono-tech text-xs text-text-secondary">Titolo EN</label>
          <input className={inputClass} value={form.title?.en ?? ""} onChange={(e) => setLoc("title", "en", e.target.value)} />
        </div>
        <div>
          <label className="font-mono-tech text-xs text-text-secondary">Titolo IT</label>
          <input className={inputClass} value={form.title?.it ?? ""} onChange={(e) => setLoc("title", "it", e.target.value)} />
        </div>
        <div>
          <label className="font-mono-tech text-xs text-text-secondary">Cliente</label>
          <input className={inputClass} value={form.client ?? ""} onChange={(e) => set("client", e.target.value)} />
        </div>
        <div>
          <label className="font-mono-tech text-xs text-text-secondary">Categoria</label>
          <select className={inputClass} value={form.category ?? "commercial"} onChange={(e) => set("category", e.target.value)}>
            {(["commercial","brand-film","fashion","music","social","events","short-film","experimental"] as ProjectCategory[]).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-mono-tech text-xs text-text-secondary">Anno</label>
          <input type="number" className={inputClass} value={form.year ?? 2026} onChange={(e) => set("year", +e.target.value)} />
        </div>
        <div>
          <label className="font-mono-tech text-xs text-text-secondary">Mese</label>
          <input type="number" min={1} max={12} className={inputClass} value={form.month ?? 1} onChange={(e) => set("month", +e.target.value)} />
        </div>
      </div>

      <div>
        <label className="font-mono-tech text-xs text-text-secondary">Hero Image URL</label>
        <div className="flex gap-2 mt-1">
          <input className={inputClass} value={form.heroImage ?? ""} onChange={(e) => set("heroImage", e.target.value)} placeholder="/uploads/projects/..." />
          <MediaUpload folder="projects" label="UPLOAD" onUploaded={(url) => set("heroImage", url)} />
        </div>
        {form.heroImage && (
          <div className="relative h-32 w-full mt-2 rounded-sm overflow-hidden">
            <SiteImage src={form.heroImage} alt="" fill className="object-cover" />
          </div>
        )}
      </div>

      <div>
        <label className="font-mono-tech text-xs text-text-secondary">Video (file path o link YouTube)</label>
        <input className={inputClass} value={form.heroVideo ?? ""} onChange={(e) => set("heroVideo", e.target.value)} placeholder="/uploads/... oppure https://youtube.com/watch?v=..." />
        <MediaUpload folder="projects" label="UPLOAD VIDEO" onUploaded={(url) => set("heroVideo", url)} />
      </div>

      <div>
        <label className="font-mono-tech text-xs text-text-secondary">Case Study EN</label>
        <textarea className={cn(inputClass, "min-h-[100px]")} value={form.caseStudy?.en ?? ""} onChange={(e) => setLoc("caseStudy", "en", e.target.value)} />
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={form.featured ?? false} onChange={(e) => set("featured", e.target.checked)} className="accent-accent" />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={form.published ?? false} onChange={(e) => set("published", e.target.checked)} className="accent-accent" />
          Pubblicato
        </label>
        <div className="flex items-center gap-2">
          <span className="font-mono-tech text-xs text-text-secondary">Ordine</span>
          <input type="number" className="w-16 bg-bg border border-white/10 rounded-sm px-2 py-1 text-sm" value={form.displayOrder ?? 1} onChange={(e) => set("displayOrder", +e.target.value)} />
        </div>
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={() => onSave(form)} className="btn-3d btn-3d-primary flex items-center gap-2">
          <Save size={14} /> SALVA
        </button>
        <button type="button" onClick={onCancel} className="btn-3d btn-3d-secondary">ANNULLA</button>
        {onDelete && (
          <button type="button" onClick={onDelete} className="btn-3d btn-3d-ghost text-accent flex items-center gap-2 ml-auto">
            <Trash2 size={14} /> ELIMINA
          </button>
        )}
      </div>
    </div>
  );
}

function ArticleEditor({
  article,
  onSave,
  onDelete,
  onCancel,
}: {
  article: Partial<BlogArticle> & { id?: string };
  onSave: (a: Partial<BlogArticle>) => void;
  onDelete?: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(article);

  const set = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));
  const setLoc = (field: "title" | "excerpt" | "content", lang: "en" | "it", value: string) =>
    setForm((f) => ({ ...f, [field]: { ...(f[field] as { en: string; it: string }), [lang]: value } }));

  const inputClass = "w-full bg-bg border border-white/10 rounded-sm px-3 py-2 text-sm focus:border-accent focus:outline-none";

  return (
    <div className="p-6 border border-white/10 rounded-sm bg-surface space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="font-mono-tech text-xs text-text-secondary">Titolo EN</label>
          <input className={inputClass} value={form.title?.en ?? ""} onChange={(e) => setLoc("title", "en", e.target.value)} />
        </div>
        <div>
          <label className="font-mono-tech text-xs text-text-secondary">Titolo IT</label>
          <input className={inputClass} value={form.title?.it ?? ""} onChange={(e) => setLoc("title", "it", e.target.value)} />
        </div>
        <div>
          <label className="font-mono-tech text-xs text-text-secondary">Categoria</label>
          <select className={inputClass} value={form.category ?? "filmmaking"} onChange={(e) => set("category", e.target.value)}>
            {(["filmmaking","cameras","gear","lighting","editing","color-grading","audio","ai","video-marketing","social-video","behind-the-scenes","case-studies","creative-process"] as BlogCategory[]).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-mono-tech text-xs text-text-secondary">Tempo lettura (min)</label>
          <input type="number" className={inputClass} value={form.readingTimeMinutes ?? 5} onChange={(e) => set("readingTimeMinutes", +e.target.value)} />
        </div>
      </div>

      <div>
        <label className="font-mono-tech text-xs text-text-secondary">Immagine Featured</label>
        <div className="flex gap-2 mt-1">
          <input className={inputClass} value={form.featuredImage ?? ""} onChange={(e) => set("featuredImage", e.target.value)} />
          <MediaUpload folder="blog" label="UPLOAD" onUploaded={(url) => set("featuredImage", url)} />
        </div>
      </div>

      <div>
        <label className="font-mono-tech text-xs text-text-secondary">Immagine Cartoon</label>
        <div className="flex gap-2 mt-1">
          <input className={inputClass} value={form.cartoonImage ?? ""} onChange={(e) => set("cartoonImage", e.target.value)} />
          <MediaUpload folder="blog" label="UPLOAD" onUploaded={(url) => set("cartoonImage", url)} />
        </div>
      </div>

      <div>
        <label className="font-mono-tech text-xs text-text-secondary">Excerpt EN</label>
        <textarea className={cn(inputClass, "min-h-[60px]")} value={form.excerpt?.en ?? ""} onChange={(e) => setLoc("excerpt", "en", e.target.value)} />
      </div>

      <div>
        <label className="font-mono-tech text-xs text-text-secondary">Contenuto EN (Markdown: ![alt](/path))</label>
        <textarea className={cn(inputClass, "min-h-[200px] font-mono text-xs")} value={form.content?.en ?? ""} onChange={(e) => setLoc("content", "en", e.target.value)} />
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={form.featured ?? false} onChange={(e) => set("featured", e.target.checked)} className="accent-accent" />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={form.published ?? false} onChange={(e) => set("published", e.target.checked)} className="accent-accent" />
          Pubblicato
        </label>
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={() => onSave(form)} className="btn-3d btn-3d-primary flex items-center gap-2">
          <Save size={14} /> SALVA
        </button>
        <button type="button" onClick={onCancel} className="btn-3d btn-3d-secondary">ANNULLA</button>
        {onDelete && (
          <button type="button" onClick={onDelete} className="btn-3d btn-3d-ghost text-accent flex items-center gap-2 ml-auto">
            <Trash2 size={14} /> ELIMINA
          </button>
        )}
      </div>
    </div>
  );
}

export function AdminCMS() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState<Tab>("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [editingProject, setEditingProject] = useState<(Partial<Project> & { id?: string }) | null>(null);
  const [editingArticle, setEditingArticle] = useState<(Partial<BlogArticle> & { id?: string }) | null>(null);

  const load = useCallback(async () => {
    try {
      const [projectsData, articlesData] = await Promise.all([
        adminLoadProjects(),
        adminLoadArticles(),
      ]);
      setProjects(projectsData);
      setArticles(articlesData);
      setAuthed(true);
    } catch (err) {
      if (err instanceof AdminAuthError) {
        setAuthed(false);
        return;
      }
      setAuthed(false);
    }
  }, []);

  useEffect(() => {
    load().finally(() => setChecking(false));
  }, [load]);

  const logout = async () => {
    if (isPagesAdmin()) {
      clearAdminSession();
    } else {
      await adminLogoutLocal();
    }
    setAuthed(false);
  };

  if (checking) {
    return <div className="min-h-screen bg-bg flex items-center justify-center font-mono-tech text-text-secondary">LOADING...</div>;
  }

  if (!authed) return <LoginGate onLogin={load} />;

  const saveProject = async (form: Partial<Project>) => {
    try {
      await adminSaveProject(form);
      if (isPagesAdmin()) {
        alert("Salvato su GitHub. Il sito si aggiorna in circa 1 minuto.");
      }
      setEditingProject(null);
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Salvataggio fallito");
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Eliminare questo progetto?")) return;
    try {
      await adminDeleteProject(id);
      if (isPagesAdmin()) alert("Eliminato. Deploy in corso...");
      setEditingProject(null);
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Eliminazione fallita");
    }
  };

  const saveArticle = async (form: Partial<BlogArticle>) => {
    try {
      await adminSaveArticle(form);
      if (isPagesAdmin()) {
        alert("Salvato su GitHub. Il sito si aggiorna in circa 1 minuto.");
      }
      setEditingArticle(null);
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Salvataggio fallito");
    }
  };

  const deleteArticle = async (id: string) => {
    if (!confirm("Eliminare questo articolo?")) return;
    try {
      await adminDeleteArticle(id);
      if (isPagesAdmin()) alert("Eliminato. Deploy in corso...");
      setEditingArticle(null);
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Eliminazione fallita");
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-white/10 bg-surface px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">GROK <span className="text-accent">Admin</span></h1>
          <p className="font-mono-tech text-sm text-text-secondary">Gestisci progetti, articoli e media</p>
          {isPagesAdmin() && (
            <p className="font-mono-tech text-xs text-accent mt-1">Modalità GitHub Pages — salvataggio diretto su repo</p>
          )}
        </div>
        <button type="button" onClick={logout} className="btn-3d btn-3d-ghost flex items-center gap-2 text-xs">
          <LogOut size={14} /> ESCI
        </button>
      </header>

      <div className="flex border-b border-white/10">
        {([
          { id: "projects" as Tab, label: "PROGETTI", icon: Film },
          { id: "blog" as Tab, label: "ARTICOLI", icon: FileText },
          { id: "media" as Tab, label: "MEDIA", icon: ImageIcon },
        ]).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "flex items-center gap-2 px-6 py-4 font-mono-tech text-xs tracking-widest transition-colors min-h-[44px]",
              tab === id ? "text-accent border-b-2 border-accent" : "text-text-secondary hover:text-text-primary"
            )}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      <main className="max-w-5xl mx-auto p-6 space-y-6">
        {tab === "projects" && (
          <>
            {!editingProject && (
              <button
                type="button"
                onClick={() => setEditingProject({ title: { en: "", it: "" }, description: { en: "", it: "" }, caseStudy: { en: "", it: "" } })}
                className="btn-3d btn-3d-primary flex items-center gap-2"
              >
                <Plus size={14} /> NUOVO PROGETTO
              </button>
            )}
            {editingProject ? (
              <ProjectEditor
                project={editingProject}
                onSave={saveProject}
                onDelete={editingProject.id ? () => deleteProject(editingProject.id!) : undefined}
                onCancel={() => setEditingProject(null)}
              />
            ) : (
              <div className="space-y-3">
                {projects.map((p) => (
                  <div key={p.id} className="flex items-center gap-4 p-4 border border-white/10 rounded-sm bg-surface hover:border-accent/30 transition-colors">
                    {p.heroImage && (
                      <div className="relative h-16 w-24 flex-shrink-0 rounded-sm overflow-hidden">
                        <SiteImage src={p.heroImage} alt="" fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-display font-bold">{p.title.en}</p>
                      <p className="font-mono-tech text-xs text-text-secondary">{p.client} · {p.year} · {p.published ? "LIVE" : "DRAFT"}</p>
                    </div>
                    <button type="button" onClick={() => setEditingProject(p)} className="btn-3d btn-3d-secondary text-xs">MODIFICA</button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === "blog" && (
          <>
            {!editingArticle && (
              <button
                type="button"
                onClick={() => setEditingArticle({ title: { en: "", it: "" }, subtitle: { en: "", it: "" }, excerpt: { en: "", it: "" }, content: { en: "", it: "" } })}
                className="btn-3d btn-3d-primary flex items-center gap-2"
              >
                <Plus size={14} /> NUOVO ARTICOLO
              </button>
            )}
            {editingArticle ? (
              <ArticleEditor
                article={editingArticle}
                onSave={saveArticle}
                onDelete={editingArticle.id ? () => deleteArticle(editingArticle.id!) : undefined}
                onCancel={() => setEditingArticle(null)}
              />
            ) : (
              <div className="space-y-3">
                {articles.map((a) => (
                  <div key={a.id} className="flex items-center gap-4 p-4 border border-white/10 rounded-sm bg-surface">
                    {a.featuredImage && (
                      <div className="relative h-16 w-24 flex-shrink-0 rounded-sm overflow-hidden">
                        <SiteImage src={a.featuredImage} alt="" fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-display font-bold">{a.title.en}</p>
                      <p className="font-mono-tech text-xs text-text-secondary">{a.category} · {a.published ? "LIVE" : "DRAFT"}</p>
                    </div>
                    <button type="button" onClick={() => setEditingArticle(a)} className="btn-3d btn-3d-secondary text-xs">MODIFICA</button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === "media" && (
          <div className="p-8 border border-dashed border-white/10 rounded-sm text-center space-y-6">
            <p className="font-mono-tech text-sm text-text-secondary">Carica foto e video — verranno salvati in /public/uploads/</p>
            <div className="flex flex-wrap justify-center gap-6">
              <MediaUpload folder="projects" label="UPLOAD PROGETTO" onUploaded={() => {}} />
              <MediaUpload folder="blog" label="UPLOAD BLOG" onUploaded={() => {}} />
              <MediaUpload folder="general" label="UPLOAD GENERICO" onUploaded={() => {}} />
            </div>
            <p className="text-xs text-text-secondary">Formati: JPG, PNG, WebP, MP4, WebM · Max 100MB</p>
          </div>
        )}
      </main>
    </div>
  );
}
