import { PageShell } from "@/components/page-shell";

export default function PredictionsPage() {
  return (
    <PageShell
      title="预测板块"
      description="夺冠、晋级和单场比分预测的入口占位。本阶段不填真实预测。"
    >
      <section className="grid gap-4 sm:grid-cols-3">
        {["夺冠预测", "晋级预测", "单场比分预测"].map((title) => (
          <article key={title} className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              待后续阶段接入数据结构和真实内容。
            </p>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
