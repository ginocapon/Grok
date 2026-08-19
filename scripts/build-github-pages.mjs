/**
 * Build statico per GitHub Pages (come linda-allenamenti).
 * Disabilita temporaneamente API, admin e middleware (non supportati in export).
 */
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const root = process.cwd();

const moves = [
  { from: "src/app/api", to: "src/app/_api.disabled", isDir: true },
  { from: "src/app/admin", to: "src/app/_admin.disabled", isDir: true },
  { from: "src/middleware.ts", to: "src/middleware.ts.disabled", isDir: false },
];

function disable({ from, to, isDir }) {
  const fromPath = path.join(root, from);
  const toPath = path.join(root, to);
  if (!fs.existsSync(fromPath)) return false;

  if (fs.existsSync(toPath)) fs.rmSync(toPath, { recursive: true, force: true });

  if (isDir) {
    fs.cpSync(fromPath, toPath, { recursive: true });
    fs.rmSync(fromPath, { recursive: true, force: true });
  } else {
    fs.copyFileSync(fromPath, toPath);
    fs.rmSync(fromPath, { force: true });
  }
  return true;
}

function restore({ from, to, isDir }) {
  const fromPath = path.join(root, from);
  const toPath = path.join(root, to);
  if (!fs.existsSync(toPath)) return;

  if (fs.existsSync(fromPath)) fs.rmSync(fromPath, { recursive: true, force: true });

  if (isDir) {
    fs.cpSync(toPath, fromPath, { recursive: true });
    fs.rmSync(toPath, { recursive: true, force: true });
  } else {
    fs.copyFileSync(toPath, fromPath);
    fs.rmSync(toPath, { force: true });
  }
}

const disabled = moves.map((m) => ({ ...m, ok: disable(m) }));

try {
  const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "Grok";
  console.log(`Building for GitHub Pages — basePath: /${repoName}`);

  execSync("npm run build", {
    stdio: "inherit",
    env: {
      ...process.env,
      GITHUB_PAGES: "true",
      NEXT_PUBLIC_GITHUB_PAGES: "true",
      GITHUB_REPOSITORY_NAME: repoName,
      NEXT_PUBLIC_SITE_URL: `https://ginocapon.github.io/${repoName}`,
      NEXT_PUBLIC_CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@grok.film",
    },
  });

  console.log("Static export completato in /out");
} finally {
  for (const item of disabled) {
    if (item.ok) restore(item);
  }
}
