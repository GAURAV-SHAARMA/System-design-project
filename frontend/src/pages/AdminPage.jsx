import { useEffect, useState } from 'react';
import api from '../api/client';
import { currency } from '../utils/formatters';

const emptyPlan = { planName: '', category: 'Health', description: '', basePremium: 18000, coverageAmount: 1000000, minAge: 18, maxAge: 60, riskLevel: 'LOW', active: true };

export default function AdminPage() {
  const [dashboard, setDashboard] = useState(null);
  const [plans, setPlans] = useState([]);
  const [claims, setClaims] = useState([]);
  const [form, setForm] = useState(emptyPlan);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const [dashboardRes, plansRes, claimsRes] = await Promise.all([api.get('/admin/dashboard'), api.get('/admin/plans'), api.get('/admin/claims')]);
      setDashboard(dashboardRes.data);
      setPlans(plansRes.data);
      setClaims(claimsRes.data);
    } catch {
      setError('Unable to load admin data.');
    }
  };

  useEffect(() => { load(); }, []);

  const savePlan = async (event) => {
    event.preventDefault();
    try {
      if (editingId) {
        await api.put(`/admin/plans/${editingId}`, form);
        setMessage('Plan updated successfully.');
      } else {
        await api.post('/admin/plans', form);
        setMessage('Plan created successfully.');
      }
      setForm(emptyPlan);
      setEditingId(null);
      setError('');
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to save plan.');
    }
  };

  const decideClaim = async (id, status) => {
    try {
      await api.put(`/admin/claims/${id}`, { status, adminRemark: status === 'APPROVED' ? 'Approved after policy verification' : 'Rejected in simulation review' });
      setMessage(`Claim ${status.toLowerCase()} successfully.`);
      load();
    } catch {
      setError('Unable to update claim.');
    }
  };

  return (
    <div className="space-y-6">
      <section className="card-surface p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-rose-300">Administrator Workspace</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-white">Manage insurance plans, dashboards, and claim outcomes.</h1>
      </section>
      {message && <p className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">{message}</p>}
      {error && <p className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</p>}
      <div className="grid gap-5 md:grid-cols-3">
        <div className="card-surface p-5"><p className="text-slate-400">Total Plans</p><p className="mt-2 font-display text-3xl font-bold text-white">{dashboard?.totalPlans || 0}</p></div>
        <div className="card-surface p-5"><p className="text-slate-400">Active Policies</p><p className="mt-2 font-display text-3xl font-bold text-white">{dashboard?.activePolicies || 0}</p></div>
        <div className="card-surface p-5"><p className="text-slate-400">Premium Collected</p><p className="mt-2 font-display text-3xl font-bold text-white">{currency(dashboard?.totalPremiumCollected)}</p></div>
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <form onSubmit={savePlan} className="card-surface grid gap-4 p-6">
          <h2 className="section-title">{editingId ? 'Edit Plan' : 'Create Plan'}</h2>
          {Object.entries(form).map(([key, value]) => key === 'active' ? (
            <label key={key} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white"><input type="checkbox" checked={value} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active</label>
          ) : (
            key === 'description' ? <textarea key={key} rows="4" className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white" value={value} onChange={(e) => setForm({ ...form, [key]: ['planName','category','description','riskLevel'].includes(key) ? e.target.value : Number(e.target.value) })} /> : <input key={key} className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white" value={value} onChange={(e) => setForm({ ...form, [key]: ['planName','category','description','riskLevel'].includes(key) ? e.target.value : Number(e.target.value) })} />
          ))}
          <button className="rounded-2xl bg-gradient-to-r from-emerald-400 to-sky-400 px-5 py-3 font-semibold text-slate-950">{editingId ? 'Update Plan' : 'Create Plan'}</button>
        </form>
        <section className="space-y-4">
          {plans.map((plan) => (
            <div key={plan.id} className="card-surface p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">{plan.planName}</p>
                  <p className="text-sm text-slate-400">{plan.category} | {plan.riskLevel}</p>
                </div>
                <button onClick={() => { setEditingId(plan.id); setForm(plan); }} className="rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white">Edit</button>
              </div>
            </div>
          ))}
        </section>
      </div>
      <section className="space-y-4">
        <h2 className="section-title">Claim Decisions</h2>
        {claims.map((claim) => (
          <div key={claim.id} className="card-surface flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-semibold text-white">{claim.policyNumber} - {claim.planName}</p>
              <p className="mt-1 text-sm text-slate-300">{claim.reason}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => decideClaim(claim.id, 'APPROVED')} className="rounded-2xl bg-emerald-400/20 px-4 py-2 text-sm font-semibold text-emerald-200">Approve</button>
              <button onClick={() => decideClaim(claim.id, 'REJECTED')} className="rounded-2xl bg-rose-400/20 px-4 py-2 text-sm font-semibold text-rose-200">Reject</button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
