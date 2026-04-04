export function StatCard({ label, value, hint, tone = "default" }) {
  const toneClassNames = {
    default: "border-slate-800/80 bg-slate-900/60",
    success: "border-brand-500/20 bg-brand-500/10",
    danger: "border-rose-500/20 bg-rose-500/10",
    accent: "border-sky-500/20 bg-sky-500/10"
  };

  return (
    <div className={`rounded-3xl border p-5 shadow-glow ${toneClassNames[tone]}`}>
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-3 font-display text-3xl font-bold text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{hint}</p>
    </div>
  );
}

