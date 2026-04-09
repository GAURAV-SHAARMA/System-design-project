import { currency } from '../utils/formatters';

export default function PlanCard({ plan, onPurchase }) {
  return (
    <div className="card-surface group p-6 transition hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-sky-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-sky-200">{plan.category}</span>
        <span className="text-sm text-slate-400">Risk: {plan.riskLevel}</span>
      </div>
      <h3 className="mt-5 font-display text-2xl font-semibold text-white">{plan.planName}</h3>
      <p className="mt-3 min-h-20 text-sm leading-6 text-slate-300">{plan.description}</p>
      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-slate-400">Base Premium</p>
          <p className="mt-1 font-semibold text-white">{currency(plan.basePremium)}</p>
        </div>
        <div>
          <p className="text-slate-400">Coverage</p>
          <p className="mt-1 font-semibold text-white">{currency(plan.coverageAmount)}</p>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
        <span>Age {plan.minAge} - {plan.maxAge}</span>
        {onPurchase && <button onClick={() => onPurchase(plan)} className="rounded-2xl bg-gradient-to-r from-emerald-400 to-sky-400 px-4 py-2 font-semibold text-slate-950">Purchase</button>}
      </div>
    </div>
  );
}
