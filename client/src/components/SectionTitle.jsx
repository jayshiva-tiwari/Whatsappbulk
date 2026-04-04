export function SectionTitle({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-300">{eyebrow}</p>
        ) : null}
        <h2 className="mt-2 font-display text-2xl font-bold text-white md:text-3xl">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-400 md:text-base">{description}</p>
      </div>
      {action}
    </div>
  );
}

