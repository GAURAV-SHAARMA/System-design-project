import api from '../api/client';
import useApi from '../hooks/useApi';
import StatCard from '../components/StatCard';
import { MiniBarChart, MiniPieChart } from '../components/Charts';
import PolicyCard from '../components/PolicyCard';
import { currency } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const dashboard = useApi(() => api.get(user?.roles?.includes('ROLE_ADMIN') ? '/admin/dashboard' : '/user/dashboard'), [user?.email]);
  const policies = useApi(() => api.get('/user/policies'), [user?.email]);

  const data = dashboard.data;

  return (
    <div className="space-y-6">
      <section className="card-surface overflow-hidden p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Insurance Intelligence Dashboard</p>
        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold text-white">Welcome back, {user?.fullName?.split(' ')[0]}</h1>
            <p className="mt-2 max-w-3xl text-slate-300">Track policy performance, premium flow, claim activity, and your next best action in one modern control center.</p>
          </div>
          <div className="rounded-3xl bg-white/10 px-5 py-4 text-right">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Role</p>
            <p className="mt-2 font-semibold text-white">{user?.roles?.includes('ROLE_ADMIN') ? 'Administrator' : 'Policy Holder'}</p>
          </div>
        </div>
      </section>

      {dashboard.error && <p className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{dashboard.error}</p>}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Plans" value={data?.totalPlans || 0} subtitle="Active plan catalogue" />
        <StatCard title="Policies" value={data?.activePolicies || 0} subtitle="Purchased and tracked" accent="from-sky-400 to-indigo-400" />
        <StatCard title="Pending Claims" value={data?.pendingClaims || 0} subtitle="Needs attention" accent="from-amber-400 to-orange-400" />
        <StatCard title="Premium Volume" value={currency(data?.totalPremiumCollected)} subtitle="Aggregate collection value" accent="from-fuchsia-400 to-rose-400" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="card-surface p-6">
          <h2 className="section-title">Policy Mix</h2>
          <p className="mt-2 text-sm text-slate-400">Category-wise policy distribution.</p>
          <MiniBarChart data={data?.policyCategoryChart || []} />
        </section>
        <section className="card-surface p-6">
          <h2 className="section-title">Claims Status</h2>
          <p className="mt-2 text-sm text-slate-400">Real-time overview of approval funnel.</p>
          <MiniPieChart data={data?.claimStatusChart || []} />
        </section>
      </div>

      {!user?.roles?.includes('ROLE_ADMIN') && (
        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="section-title">Tracked Policies</h2>
              <p className="mt-2 text-sm text-slate-400">Monitor live policies with renewal horizon and premium footprint.</p>
            </div>
          </div>
          <div className="grid gap-4">
            {(policies.data || []).map((policy) => <PolicyCard key={policy.id} policy={policy} />)}
            {!policies.loading && (!policies.data || policies.data.length === 0) && <p className="card-surface p-6 text-slate-300">No policies yet. Visit Plans to purchase your first policy.</p>}
          </div>
        </section>
      )}
    </div>
  );
}
