"use client";

import { useEffect, useMemo, useState } from "react";

const targetDate = new Date("2026-06-11T00:00:00Z");

function getRemainingTime(now: Date) {
  const diff = Math.max(targetDate.getTime() - now.getTime(), 0);
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

export function OpeningCountdown() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);

    return () => window.clearInterval(timer);
  }, []);

  const remaining = useMemo(() => (now ? getRemainingTime(now) : null), [now]);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-[color:var(--trophy-gold-soft)] bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(244,255,248,0.92))] p-5 shadow-[var(--card-shadow)] sm:p-6">
      <div className="absolute -right-14 -top-16 h-36 w-36 rounded-full bg-[color:var(--trophy-gold)]/20 blur-2xl" />
      <div className="absolute -bottom-20 left-6 h-40 w-40 rounded-full bg-[color:var(--pitch-green)]/15 blur-2xl" />
      <div className="relative">
        <p className="inline-flex rounded-full bg-[color:var(--stadium-blue)] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--trophy-gold)]">
          揭幕战倒计时
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["天", remaining?.days],
          ["小时", remaining?.hours],
          ["分钟", remaining?.minutes],
          ["秒", remaining?.seconds],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl border border-[color:var(--line-soft)] bg-white/90 p-4 text-center shadow-sm"
          >
            <div className="text-3xl font-black tabular-nums text-[color:var(--stadium-blue)] sm:text-4xl">
              {value ?? "--"}
            </div>
            <div className="mt-1 text-xs font-semibold text-[color:var(--muted)]">{label}</div>
          </div>
        ))}
        </div>
        <p className="mt-4 text-sm font-medium text-[color:var(--ink)]">
          揭幕战：6月11日 墨西哥 vs 南非
        </p>
      </div>
    </section>
  );
}
