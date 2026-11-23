import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      <div className="pointer-events-none absolute inset-0 bg-dots [mask-image:radial-gradient(70%_80%_at_50%_0%,black,transparent)]" />
      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 lg:px-8 lg:pb-14 lg:pt-14">
        <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em] text-navy-soft">{eyebrow}</p>
        <h1 className="animate-fade-up mt-3 text-4xl font-extrabold leading-tight text-foreground [animation-delay:80ms] sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="animate-fade-up mt-4 max-w-2xl text-lg text-muted-foreground [animation-delay:160ms]">
            {description}
          </p>
        )}
        {children && <div className="animate-fade-up mt-8 [animation-delay:240ms]">{children}</div>}
      </div>
    </section>
  );
}
