import type { ReactNode } from "react";

interface PageShellProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="space-y-3">
        <h1 className="text-3xl font-black tracking-normal text-white sm:text-4xl">
          {title}
        </h1>
        <p className="max-w-3xl text-base leading-7 text-white/72">
          {description}
        </p>
      </section>
      {children}
    </main>
  );
}
