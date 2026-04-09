import { useState } from 'react';
import api from '../api/client';
import PlanCard from '../components/PlanCard';
import { currency } from '../utils/formatters';

const recommendationDefaults = { age: 29, income: 780000, riskScore: 4 };
const calculatorDefaults = { basePremium: 18500, age: 29, income: 780000, riskScore: 4, termYears: 3 };

export default function RecommendationsPage() {
  const [recommendationForm, setRecommendationForm] = useState(recommendationDefaults);
  const [calculatorForm, setCalculatorForm] = useState(calculatorDefaults);
  const [recommendation, setRecommendation] = useState(null);
  const [premium, setPremium] = useState(null);
  const [error, setError] = useState('');

  const fetchRecommendation = async (event) => {
    event.preventDefault();
    try {
      const { data } = await api.post('/user/recommendations', recommendationForm);
      setRecommendation(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to fetch recommendations.');
    }
  };

  const calculatePremium = async (event) => {
    event.preventDefault();
    try {
      const { data } = await api.post('/user/premium-calculator', calculatorForm);
      setPremium(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to calculate premium.');
    }
  };

  return (
    <div className="space-y-6">
      <section className="card-surface p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300">AI Assistance</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-white">Insurance recommendation engine and live premium calculator.</h1>
        <p className="mt-4 max-w-3xl text-slate-300">This view demonstrates intelligent plan matching using age, income, and risk profile, paired with real-time pricing feedback for interactive decision support.</p>
      </section>
      {error && <p className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</p>}
      <div className="grid gap-6 xl:grid-cols-2">
        <form onSubmit={fetchRecommendation} className="card-surface grid gap-4 p-6">
          <h2 className="section-title">AI Recommendation</h2>
          <input type="number" className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white" value={recommendationForm.age} onChange={(e) => setRecommendationForm({ ...recommendationForm, age: Number(e.target.value) })} placeholder="Age" />
          <input type="number" className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white" value={recommendationForm.income} onChange={(e) => setRecommendationForm({ ...recommendationForm, income: Number(e.target.value) })} placeholder="Annual Income" />
          <input type="number" min="1" max="10" className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white" value={recommendationForm.riskScore} onChange={(e) => setRecommendationForm({ ...recommendationForm, riskScore: Number(e.target.value) })} placeholder="Risk Score" />
          <button className="rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950">Generate Recommendation</button>
          {recommendation && <div className="rounded-2xl bg-emerald-400/10 p-4 text-sm text-emerald-100">{recommendation.insight}</div>}
        </form>

        <form onSubmit={calculatePremium} className="card-surface grid gap-4 p-6">
          <h2 className="section-title">Premium Calculator</h2>
          {['basePremium', 'age', 'income', 'riskScore', 'termYears'].map((field) => (
            <input
              key={field}
              type="number"
              className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white"
              value={calculatorForm[field]}
              onChange={(e) => setCalculatorForm({ ...calculatorForm, [field]: Number(e.target.value) })}
              placeholder={field}
            />
          ))}
          <button className="rounded-2xl bg-gradient-to-r from-emerald-400 to-sky-400 px-5 py-3 font-semibold text-slate-950">Calculate Premium</button>
          {premium && (
            <div className="grid gap-3 rounded-2xl bg-white/5 p-4 text-sm text-slate-200 md:grid-cols-2">
              <div><span className="text-slate-400">Monthly:</span> {currency(premium.monthlyPremium)}</div>
              <div><span className="text-slate-400">Yearly:</span> {currency(premium.yearlyPremium)}</div>
              <div><span className="text-slate-400">Risk Multiplier:</span> {premium.riskMultiplier}x</div>
              <div><span className="text-slate-400">Discount:</span> {(premium.loyaltyDiscount * 100).toFixed(0)}%</div>
            </div>
          )}
        </form>
      </div>
      {recommendation?.plans?.length > 0 && (
        <section className="space-y-4">
          <h2 className="section-title">Top Recommended Plans</h2>
          <div className="grid gap-5 xl:grid-cols-3">
            {recommendation.plans.map((plan) => <PlanCard key={plan.id} plan={plan} />)}
          </div>
        </section>
      )}
    </div>
  );
}
