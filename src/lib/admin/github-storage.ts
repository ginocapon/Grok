const REPO_SLUG = process.env.NEXT_PUBLIC_GITHUB_REPO ?? "ginocapon/Grok";
const BRANCH = process.env.NEXT_PUBLIC_GITHUB_BRANCH ?? "main";
const [OWNER, REPO] = REPO_SLUG.split("/");

const TOKEN_KEY = "grok-github-token";
const SESSION_KEY = "grok-admin-session";

function storage() {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

export function isPagesAdmin(): boolean {
  return process.env.NEXT_PUBLIC_GITHUB_PAGES === "true";
}

export function getGitHubToken(): string | null {
  const store = storage();
  if (!store) return null;
  return store.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
}

export function setGitHubToken(token: string, persist = true) {
  if (typeof window === "undefined") return;
  if (persist) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
  }
}

export function clearGitHubToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}

export function isPagesSessionSaved(): boolean {
  const store = storage();
  if (!store) return false;
  return store.getItem(SESSION_KEY) === "1";
}

export function setPagesSession(active: boolean) {
  const store = storage();
  if (!store) return;
  if (active) store.setItem(SESSION_KEY, "1");
  else store.removeItem(SESSION_KEY);
}

function apiUrl(path: string) {
  return `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`;
}

function rawUrl(path: string) {
  return `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${path}`;
}

function toBase64Utf8(text: string): string {
  return btoa(unescape(encodeURIComponent(text)));
}

async function fileSha(path: string, token: string): Promise<string | null> {
  const res = await fetch(apiUrl(path), {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub read failed (${res.status})`);
  const data = (await res.json()) as { sha: string };
  return data.sha;
}

export async function readJsonFile<T>(path: string): Promise<T> {
  const res = await fetch(rawUrl(path), { cache: "no-store" });
  if (!res.ok) throw new Error(`Impossibile leggere ${path}`);
  return res.json() as Promise<T>;
}

export async function writeJsonFile(path: string, data: unknown, message: string): Promise<void> {
  const token = getGitHubToken();
  if (!token) throw new Error("Token GitHub mancante");

  const content = JSON.stringify(data, null, 2) + "\n";
  const sha = await fileSha(path, token);

  const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({
      message,
      content: toBase64Utf8(content),
      sha: sha ?? undefined,
      branch: BRANCH,
    }),
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(err.message ?? `Salvataggio fallito (${res.status})`);
  }
}

export async function uploadPublicFile(
  folder: string,
  file: File
): Promise<{ url: string; filename: string }> {
  const token = getGitHubToken();
  if (!token) throw new Error("Token GitHub mancante");

  const safeFolder = folder.replace(/[^a-z0-9-]/gi, "");
  const isImage = file.type.startsWith("image/") && file.type !== "image/gif";
  const ext = isImage ? ".webp" : file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")) : ".mp4";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const repoPath = `public/uploads/${safeFolder}/${filename}`;

  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);

  const sha = await fileSha(repoPath, token);

  const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${repoPath}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({
      message: `Upload media: ${filename}`,
      content: btoa(binary),
      sha: sha ?? undefined,
      branch: BRANCH,
    }),
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(err.message ?? `Upload fallito (${res.status})`);
  }

  return { url: `/uploads/${safeFolder}/${filename}`, filename };
}
