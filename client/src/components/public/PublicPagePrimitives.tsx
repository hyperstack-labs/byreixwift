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
    <section className="relative overflow-hidden border-b border-border/70 pb-16 pt-24 sm:pb-20 sm:pt-28 lg:pb-24 lg:pt-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-52 w-[32rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(37,201,133,0.18)_0%,rgba(37,201,133,0.04)_48%,transparent_72%)] blur-3xl sm:h-64 sm:w-[44rem]" />
        <div className="absolute right-[-5rem] top-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(214,196,133,0.16)_0%,transparent_68%)] blur-3xl sm:top-24 sm:h-72 sm:w-72" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(214,196,133,0.32),transparent)]" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-8 px-4 sm:gap-10 sm:px-6 lg:grid-cols-[1.12fr_0.88fr] lg:gap-14 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-(--byreix-gold-soft)">
            {eyebrow}
          </p>
          <h1 className="mt-5 text-[2.3rem] font-semibold leading-[1.02] tracking-[-0.04em] text-foreground sm:mt-6 sm:text-[3.25rem] lg:text-6xl lg:leading-[1.02]">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-[0.98rem] leading-7 text-muted-foreground sm:mt-6 sm:text-lg sm:leading-8">
            {description}
          </p>
          {children ? <div className="mt-8 sm:mt-10">{children}</div> : null}
        </div>

        {aside ? <div className="w-full lg:justify-self-end lg:self-center">{aside}</div> : null}
      </div>
    </section>
  );
}

export function PublicSection({ id, className, children }: PublicSectionProps) {
  return (
    <section
      id={id}
      className={cn("mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20", className)}
    >
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
      <h2 className="mt-4 text-[2rem] font-semibold leading-[1.06] tracking-[-0.03em] text-foreground sm:text-[2.65rem]">
        {title}
      </h2>
      <p className="mt-4 max-w-2xl text-[0.98rem] leading-7 text-muted-foreground sm:text-base sm:leading-8">
        {description}
      </p>
    </div>
  );
}

export function PublicGlassPanel({ className, children }: PublicGlassPanelProps) {
  return (
    <div
      className={cn(
        "rounded-[1.55rem] border border-[rgba(214,196,133,0.14)] bg-[linear-gradient(180deg,rgba(11,18,14,0.9)_0%,rgba(8,13,10,0.74)_100%)] p-5 backdrop-blur-xl sm:rounded-[1.9rem] sm:p-6 lg:p-8",
        className
      )}
    >
      {children}
    </div>
  );
}
