export default function StatCard({ title, value, subtitle, accent = 'from-emerald-400 to-sky-400' }) {
  return (
    <div className="card-surface overflow-hidden p-5">
      <div className={`mb-5 h-1.5 rounded-full bg-gradient-to-r ${accent}`} />
      <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{title}</p>
      <p className="mt-3 font-display text-3xl font-bold text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-300">{subtitle}</p>
    </div>
  );
}
