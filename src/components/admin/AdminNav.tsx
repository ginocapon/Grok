import Link from "next/link";

const sections = [
  { href: "/admin", label: "Dashboard", icon: "◉" },
  { href: "/admin/projects", label: "Projects", icon: "▶" },
  { href: "/admin/blog", label: "Blog", icon: "✎" },
  { href: "/admin/media", label: "Media", icon: "◫" },
  { href: "/admin/contacts", label: "Contacts", icon: "✉" },
  { href: "/admin/analytics", label: "Analytics", icon: "◔" },
  { href: "/admin/ml", label: "Machine Learning", icon: "◈" },
  { href: "/admin/grok", label: "GROK", icon: "⚡" },
  { href: "/admin/character", label: "Character", icon: "◐" },
  { href: "/admin/seo", label: "SEO", icon: "◎" },
  { href: "/admin/settings", label: "Settings", icon: "⚙" },
];

export function AdminNav({ current }: { current?: string }) {
  return (
    <nav className="w-56 flex-shrink-0 border-r border-white/10 bg-surface min-h-screen p-4">
      <Link href="/admin" className="font-display text-xl font-bold text-accent block mb-8 px-2">
        GROK ADMIN
      </Link>
      <ul className="space-y-1">
        {sections.map(({ href, label, icon }) => (
          <li key={href}>
            <Link
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-colors min-h-[44px] ${
                current === href
                  ? "bg-accent/10 text-accent"
                  : "text-text-secondary hover:text-text-primary hover:bg-white/5"
              }`}
            >
              <span className="font-mono-tech text-xs">{icon}</span>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
