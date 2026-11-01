import type { ReactNode } from "react";

export function SgSection({
  id,
  no,
  title,
  note,
  children,
}: {
  id: string;
  no: string;
  title: string;
  note?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="border-t border-line py-16 md:py-24">
      <div className="mb-10 flex flex-wrap items-baseline gap-x-6 gap-y-2">
        <span className="mono-label text-paper-dim">{no}</span>
        <h2 id={`${id}-h`} className="font-expanded text-h3 tracking-[-0.01em]">
          {title}
        </h2>
        {note && <p className="basis-full max-w-[60ch] text-paper-dim">{note}</p>}
      </div>
      {children}
    </section>
  );
}

export function Specimen({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <figure
      className={`flex flex-col gap-4 rounded-[var(--radius)] border border-line bg-ink-2 p-5 ${className}`}
    >
      <div className="grid min-h-28 flex-1 place-items-center">{children}</div>
      <figcaption className="mono-label text-paper-dim">{label}</figcaption>
    </figure>
  );
}
