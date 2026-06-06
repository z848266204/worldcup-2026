import Link from "next/link";
import { Trophy } from "lucide-react";

const navItems = [
  { href: "/schedule", label: "赛程" },
  { href: "/groups", label: "小组" },
  { href: "/teams", label: "球队" },
  { href: "/predictions", label: "预测" },
  { href: "/articles", label: "前瞻" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(7,22,18,0.82)] shadow-lg shadow-black/10 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-base font-bold text-white">
          <span className="grid size-9 place-items-center rounded-full bg-[var(--trophy-gold)] text-[var(--stadium-blue)]">
            <Trophy size={18} aria-hidden="true" />
          </span>
          2026 世界杯中文资讯站
        </Link>
        <nav aria-label="主导航" className="flex flex-wrap gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-white/78 transition hover:bg-white/12 hover:text-[var(--trophy-gold-soft)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
