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
    <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
      <p className="text-sm font-semibold text-emerald-800">揭幕战倒计时</p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["天", remaining?.days],
          ["小时", remaining?.hours],
          ["分钟", remaining?.minutes],
          ["秒", remaining?.seconds],
        ].map(([label, value]) => (
          <div key={label} className="rounded-md bg-white p-4 text-center">
            <div className="text-2xl font-bold text-slate-950">{value ?? "--"}</div>
            <div className="mt-1 text-xs text-slate-500">{label}</div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-slate-600">揭幕战：6月11日 墨西哥 vs 南非</p>
    </section>
  );
}
