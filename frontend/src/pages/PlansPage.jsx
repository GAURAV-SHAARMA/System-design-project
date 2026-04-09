import { useEffect, useState } from 'react';
import api from '../api/client';
import PlanCard from '../components/PlanCard';

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [termYears, setTermYears] = useState(3);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/plans').then((response) => setPlans(response.data)).catch(() => setError('Unable to load plans.'));
  }, []);

  const purchasePolicy = async () => {
    try {
      const response = await api.post('/user/purchase', { planId: selectedPlan.id, termYears });
      setMessage(`Policy ${response.data.policyNumber} purchased successfully.`);
      setSelectedPlan(null);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Purchase failed.');
    }
  };

  return (
    <div className="space-y-6">
      <section className="card-surface p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Plan Marketplace</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-white">Explore insurance plans built for health, life, vehicle, and wealth protection.</h1>
        <p className="mt-4 max-w-3xl text-slate-300">Each plan includes structured age eligibility, premium details, and coverage amount so users can compare and purchase confidently.</p>
      </section>
      {message && <p className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">{message}</p>}
      {error && <p className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</p>}
      <div className="grid gap-5 xl:grid-cols-2">
        {plans.map((plan) => <PlanCard key={plan.id} plan={plan} onPurchase={setSelectedPlan} />)}
      </div>
      {selectedPlan && (
        <section className="card-surface flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-2xl font-semibold text-white">Purchase {selectedPlan.planName}</p>
            <p className="mt-2 text-slate-300">Choose term length and confirm purchase.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <input type="number" min="1" max="30" value={termYears} onChange={(e) => setTermYears(Number(e.target.value))} className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none" />
            <button onClick={purchasePolicy} className="rounded-2xl bg-gradient-to-r from-emerald-400 to-sky-400 px-5 py-3 font-semibold text-slate-950">Confirm Purchase</button>
          </div>
        </section>
      )}
    </div>
  );
}
