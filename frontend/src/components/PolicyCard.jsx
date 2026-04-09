import { currency, shortDate } from '../utils/formatters';

export default function PolicyCard({ policy }) {
  return (
    <div className="card-surface p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-xl font-semibold text-white">{policy.planName}</p>
          <p className="mt-1 text-sm text-slate-400">Policy ID: {policy.policyNumber}</p>
        </div>
        <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">{policy.status}</span>
      </div>
      <div className="mt-6 grid gap-4 text-sm text-slate-300 md:grid-cols-3">
        <div>
          <p className="text-slate-400">Premium</p>
          <p className="mt-1 font-semibold text-white">{currency(policy.premiumAmount)}</p>
        </div>
        <div>
          <p className="text-slate-400">Start Date</p>
          <p className="mt-1 font-semibold text-white">{shortDate(policy.startDate)}</p>
        </div>
        <div>
          <p className="text-slate-400">End Date</p>
          <p className="mt-1 font-semibold text-white">{shortDate(policy.endDate)}</p>
        </div>
      </div>
    </div>
  );
}
