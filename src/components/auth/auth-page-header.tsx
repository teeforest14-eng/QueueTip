import type { ReactNode } from "react";

export function AuthPageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: ReactNode;
}) {
  return (
    <header className="mb-8">
      <h1 className="text-2xl font-semibold tracking-tight text-qt-text">{title}</h1>
      {subtitle ? (
        <div className="mt-2 text-sm leading-relaxed text-qt-text-secondary">
          {subtitle}
        </div>
      ) : null}
    </header>
  );
}
