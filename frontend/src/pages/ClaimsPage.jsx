import { useEffect, useState } from 'react';
import api from '../api/client';
import { currency, shortDate } from '../utils/formatters';

export default function ClaimsPage() {
  const [claims, setClaims] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [form, setForm] = useState({ policyPurchaseId: '', claimAmount: 25000, reason: 'Hospitalization reimbursement request' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const [claimsRes, policiesRes] = await Promise.all([api.get('/user/claims'), api.get('/user/policies')]);
      setClaims(claimsRes.data);
      setPolicies(policiesRes.data);
      if (policiesRes.data[0] && !form.policyPurchaseId) {
        setForm((current) => ({ ...current, policyPurchaseId: policiesRes.data[0].id }));
      }
    } catch {
      setError('Unable to load claims data.');
    }
  };

  useEffect(() => { load(); }, []);

  const submitClaim = async (event) => {
    event.preventDefault();
    try {
      await api.post('/user/claims', form);
      setMessage('Claim request submitted successfully.');
      setError('');
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to submit claim.');
    }
  };

  return (
    <div className="space-y-6">
      <section className="card-surface p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-fuchsia-300">Claims Center</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-white">Submit claims and track approval simulation in one place.</h1>
      </section>
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <form onSubmit={submitClaim} className="card-surface grid gap-4 p-6">
          <h2 className="section-title">New Claim Request</h2>
          <select className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white" value={form.policyPurchaseId} onChange={(e) => setForm({ ...form, policyPurchaseId: Number(e.target.value) })}>
            {policies.map((policy) => <option key={policy.id} value={policy.id}>{policy.policyNumber} - {policy.planName}</option>)}
          </select>
          <input type="number" className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white" value={form.claimAmount} onChange={(e) => setForm({ ...form, claimAmount: Number(e.target.value) })} />
          <textarea rows="5" className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
          {message && <p className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">{message}</p>}
          {error && <p className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</p>}
          <button className="rounded-2xl bg-gradient-to-r from-emerald-400 to-sky-400 px-5 py-3 font-semibold text-slate-950">Submit Claim</button>
        </form>
        <section className="space-y-4">
          {claims.map((claim) => (
            <div key={claim.id} className="card-surface p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-white">{claim.planName}</p>
                  <p className="mt-1 text-sm text-slate-400">{claim.policyNumber}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${claim.status === 'APPROVED' ? 'bg-emerald-400/15 text-emerald-300' : claim.status === 'REJECTED' ? 'bg-rose-400/15 text-rose-300' : 'bg-amber-400/15 text-amber-300'}`}>{claim.status}</span>
              </div>
              <div className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-3">
                <div><span className="text-slate-400">Amount:</span> {currency(claim.claimAmount)}</div>
                <div><span className="text-slate-400">Requested:</span> {shortDate(claim.requestedDate)}</div>
                <div><span className="text-slate-400">Remark:</span> {claim.adminRemark || 'Awaiting review'}</div>
              </div>
              <p className="mt-3 text-sm text-slate-300">{claim.reason}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
