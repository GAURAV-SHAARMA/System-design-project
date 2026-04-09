import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const registerDefaults = { fullName: '', email: '', password: '', age: 25, annualIncome: 600000, riskScore: 4 };

export default function LoginPage() {
  const { updateAuth, demoAdmin, demoUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: demoUser.email, password: demoUser.password });
  const [registerForm, setRegisterForm] = useState(registerDefaults);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const target = location.state?.from?.pathname || '/dashboard';

  const handleLogin = async (payload) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', payload || form);
      updateAuth(data);
      navigate(target, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to login. Check backend status and credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/register', registerForm);
      updateAuth(data);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative overflow-hidden bg-slate-950/80 p-10 lg:p-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.18),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(56,189,248,0.2),transparent_35%)]" />
          <div className="relative z-10">
            <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">Academic Showcase Ready</span>
            <h1 className="mt-8 font-display text-5xl font-bold leading-tight text-white">Online Insurance System with AI recommendations, premium intelligence, and role-based workflows.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">A polished full-stack interface for policy discovery, live premium estimation, claims tracking, administrator controls, and notification-driven engagement.</p>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <button onClick={() => handleLogin(demoUser)} className="rounded-2xl bg-white px-5 py-4 text-left text-slate-950 transition hover:-translate-y-0.5">
                <p className="font-semibold">Demo User Login</p>
                <p className="mt-1 text-sm text-slate-600">user@insurance.com / User@123</p>
              </button>
              <button onClick={() => handleLogin(demoAdmin)} className="rounded-2xl bg-gradient-to-r from-emerald-400 to-sky-400 px-5 py-4 text-left text-slate-950 transition hover:-translate-y-0.5">
                <p className="font-semibold">Demo Admin Login</p>
                <p className="mt-1 text-sm text-slate-700">admin@insurance.com / Admin@123</p>
              </button>
            </div>
          </div>
        </section>
        <section className="p-8 lg:p-12">
          <div className="mb-8 flex gap-3 rounded-2xl bg-slate-900/60 p-2">
            <button onClick={() => setMode('login')} className={`flex-1 rounded-2xl px-4 py-3 text-sm font-semibold ${mode === 'login' ? 'bg-white text-slate-950' : 'text-slate-300'}`}>Login</button>
            <button onClick={() => setMode('register')} className={`flex-1 rounded-2xl px-4 py-3 text-sm font-semibold ${mode === 'register' ? 'bg-white text-slate-950' : 'text-slate-300'}`}>Register</button>
          </div>
          {mode === 'login' ? (
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4">
              <input className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-4 text-white outline-none" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <input className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-4 text-white outline-none" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              {error && <p className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</p>}
              <button disabled={loading} className="w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-sky-400 px-5 py-4 font-semibold text-slate-950">{loading ? 'Signing in...' : 'Enter Dashboard'}</button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="grid gap-4">
              <input className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-4 text-white outline-none" placeholder="Full Name" value={registerForm.fullName} onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })} />
              <input className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-4 text-white outline-none" placeholder="Email" value={registerForm.email} onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} />
              <input className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-4 text-white outline-none" type="password" placeholder="Password" value={registerForm.password} onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} />
              <div className="grid gap-4 md:grid-cols-3">
                <input className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-4 text-white outline-none" type="number" placeholder="Age" value={registerForm.age} onChange={(e) => setRegisterForm({ ...registerForm, age: Number(e.target.value) })} />
                <input className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-4 text-white outline-none" type="number" placeholder="Income" value={registerForm.annualIncome} onChange={(e) => setRegisterForm({ ...registerForm, annualIncome: Number(e.target.value) })} />
                <input className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-4 text-white outline-none" type="number" min="1" max="10" placeholder="Risk" value={registerForm.riskScore} onChange={(e) => setRegisterForm({ ...registerForm, riskScore: Number(e.target.value) })} />
              </div>
              {error && <p className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</p>}
              <button disabled={loading} className="w-full rounded-2xl bg-white px-5 py-4 font-semibold text-slate-950">{loading ? 'Creating account...' : 'Create Account'}</button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
