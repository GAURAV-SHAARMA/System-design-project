import { Bell, FileStack, LayoutDashboard, LogOut, ShieldCheck, Sparkles } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const baseLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/plans', label: 'Plans', icon: ShieldCheck },
  { to: '/recommendations', label: 'AI Recommend', icon: Sparkles },
  { to: '/claims', label: 'Claims', icon: FileStack },
  { to: '/notifications', label: 'Notifications', icon: Bell }
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const links = user?.roles?.includes('ROLE_ADMIN')
    ? [...baseLinks, { to: '/admin', label: 'Admin Panel', icon: ShieldCheck }]
    : baseLinks;

  return (
    <aside className="card-surface flex h-full min-h-[calc(100vh-2rem)] w-full flex-col justify-between p-6">
      <div>
        <div className="mb-10">
          <p className="font-display text-3xl font-bold text-white">InsureSmart</p>
          <p className="mt-2 text-sm text-slate-300">Modern insurance operations with AI-driven recommendations.</p>
        </div>
        <nav className="space-y-3">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 transition ${isActive ? 'bg-emerald-400/20 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/60 p-4">
        <div>
          <p className="font-semibold text-white">{user?.fullName}</p>
          <p className="text-sm text-slate-400">{user?.roles?.includes('ROLE_ADMIN') ? 'Administrator' : 'Policy Holder'}</p>
        </div>
        <button onClick={logout} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
