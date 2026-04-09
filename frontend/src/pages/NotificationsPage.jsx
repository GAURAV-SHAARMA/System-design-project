import api from '../api/client';
import useApi from '../hooks/useApi';
import NotificationList from '../components/NotificationList';

export default function NotificationsPage() {
  const { data, loading, error } = useApi(() => api.get('/user/notifications'), []);

  return (
    <div className="space-y-6">
      <section className="card-surface p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Notification Center</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-white">UI-based engagement system for policy and claim updates.</h1>
      </section>
      {loading && <p className="card-surface p-6 text-slate-300">Loading notifications...</p>}
      {error && <p className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</p>}
      {data && <NotificationList notifications={data} />}
    </div>
  );
}
