import Link from "next/link";

const navItems = [
  { href: "/schedule", label: "赛程" },
  { href: "/groups", label: "小组" },
  { href: "/teams", label: "球队" },
  { href: "/predictions", label: "预测" },
  { href: "/articles", label: "前瞻" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/95">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-bold text-slate-950">
          2026 世界杯中文资讯站
        </Link>
        <nav aria-label="主导航" className="flex flex-wrap gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
