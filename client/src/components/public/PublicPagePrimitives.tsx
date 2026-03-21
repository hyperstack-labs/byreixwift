import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PublicPageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  aside?: ReactNode;
  children?: ReactNode;
}

interface PublicSectionProps {
  id?: string;
  className?: string;
  children: ReactNode;
}

interface PublicSectionHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
  className?: string;
}

interface PublicGlassPanelProps {
  className?: string;
  children: ReactNode;
}

export function PublicPageHero({
  eyebrow,
  title,
  description,
  aside,
  children,
}: PublicPageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border/70 pt-32 pb-20 sm:pb-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-64 w-[44rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(37,201,133,0.18)_0%,rgba(37,201,133,0.04)_48%,transparent_72%)] blur-3xl" />
        <div className="absolute right-[-5rem] top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(214,196,133,0.16)_0%,transparent_68%)] blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(214,196,133,0.32),transparent)]" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.12fr_0.88fr] lg:gap-14 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-(--byreix-gold-soft)">
            {eyebrow}
          </p>
          <h1 className="mt-6 text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.02]">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            {description}
          </p>
          {children ? <div className="mt-10">{children}</div> : null}
        </div>

        {aside ? <div className="lg:justify-self-end lg:self-center">{aside}</div> : null}
      </div>
    </section>
  );
}

export function PublicSection({ id, className, children }: PublicSectionProps) {
  return (
    <section id={id} className={cn("mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8", className)}>
      {children}
    </section>
  );
}

export function PublicSectionHeading({
  eyebrow,
  title,
  description,
  className,
}: PublicSectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", className)}>
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--byreix-gold-soft)">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">{description}</p>
    </div>
  );
}

export function PublicGlassPanel({ className, children }: PublicGlassPanelProps) {
  return (
    <div
      className={cn(
        "rounded-[2rem] border border-[rgba(214,196,133,0.14)] bg-[linear-gradient(180deg,rgba(11,18,14,0.92)_0%,rgba(8,13,10,0.78)_100%)] p-6 shadow-[0_24px_70px_rgba(2,10,6,0.26)] backdrop-blur-xl sm:p-7 lg:p-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
