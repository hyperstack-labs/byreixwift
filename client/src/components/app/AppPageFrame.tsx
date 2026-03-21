import type { ReactNode } from "react";

interface AppPageFrameProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}

export function AppPageFrame({ eyebrow, title, description, children }: AppPageFrameProps) {
  return (
    <div className="min-h-screen px-4 pt-24 pb-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--byreix-gold-soft)">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-base leading-8 text-muted-foreground">{description}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
