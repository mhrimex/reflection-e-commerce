
// Login.js - Admin login with actual authentication
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Connection failed. Is the server running?');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse delay-700"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex p-4 rounded-3xl bg-blue-600 text-white shadow-2xl shadow-blue-500/20 mb-6 scale-110">
            <span className="text-3xl">🔑</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Systems Access</h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">Administrative Terminal</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-3xl flex flex-col gap-6 animate-in zoom-in-95 duration-700 delay-200"
        >
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-6 py-4 rounded-2xl text-sm font-bold flex items-center gap-3">
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Terminal ID (Username)</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="e.g. admin_01"
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Authorization Key</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-4 bg-white text-slate-900 px-6 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all duration-300 disabled:opacity-50 active:scale-95 shadow-2xl shadow-white/5 ${loading ? 'animate-pulse' : ''}`}
          >
            {loading ? 'Authenticating...' : 'Enter System →'}
          </button>

          <p className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-4">
            Secure Encryption Level: AES-256
          </p>
        </form>

        <div className="mt-12 text-center text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
          Restricted Area &copy; {new Date().getFullYear()} E-Shop Operational Intelligence
        </div>
      </div>
    </main>
  );
}
