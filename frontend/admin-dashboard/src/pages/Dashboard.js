
// Dashboard.js - Premium Admin Dashboard with Command Console
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { fetchProducts, fetchOrders, fetchUsers } from '../api';

export default function Dashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('Dashboard: No token found, redirecting to login');
      navigate('/login');
      return;
    }
    try {
      const decoded = jwtDecode(token);
      console.log('Dashboard: Decoded token', decoded);
      if (Number(decoded.roleId) === 1) {
        setIsAdmin(true);
        loadStats();
      } else {
        console.warn('Dashboard: User is not an admin', decoded.roleId);
        navigate('/login');
      }
    } catch (err) {
      console.error('Dashboard: Token decoding failed', err);
      navigate('/login');
    }
  }, [navigate]);

  async function loadStats() {
    setLoading(true);
    try {
      const fetchData = async (fn) => {
        try { return await fn(); } catch (e) { console.error(`Failed to fetch:`, e); return []; }
      };

      const [products, orders, users] = await Promise.all([
        fetchData(fetchProducts),
        fetchData(fetchOrders),
        fetchData(fetchUsers)
      ]);

      const revenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
      setStats({
        products: products?.length || 0,
        orders: orders?.length || 0,
        users: users?.length || 0,
        revenue: revenue
      });
    } catch (err) {
      console.error('Dashboard: Critical stats load failure', err);
    } finally {
      setLoading(false);
    }
  }

  if (!isAdmin) return null;

  return (
    <main className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div>
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter mb-4">
            System <span className="text-blue-600 underline decoration-blue-200 underline-offset-8">Intelligence</span>
          </h1>
          <p className="text-slate-400 font-bold text-xl flex items-center gap-2">
            Control Center <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-sm uppercase tracking-[0.3em] font-black text-slate-300">Operational Dashboard</span>
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white p-2 rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 ring-1 ring-slate-900/5">
          <button
            onClick={loadStats}
            className="w-14 h-14 flex items-center justify-center bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition-all active:scale-90 shadow-xl shadow-slate-900/20 group"
          >
            <span className="text-2xl group-hover:rotate-180 transition-transform duration-700">🔄</span>
          </button>
          <div className="pr-6 pl-2">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Status</div>
            <div className="text-sm font-black text-slate-900 uppercase">Synchronized</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <MetricTile label="Revenue" value={`$${stats.revenue.toLocaleString()}`} icon="💎" scheme="blue" trend="+12.4%" />
        <MetricTile label="Orders" value={stats.orders} icon="⚡" scheme="emerald" trend="+8%" />
        <MetricTile label="Users" value={stats.users} icon="🔥" scheme="violet" trend="Active" />
        <MetricTile label="Catalog" value={stats.products} icon="📦" scheme="amber" trend="Audited" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="bg-[#0f172a] rounded-[3rem] p-12 text-white relative overflow-hidden shadow-3xl shadow-slate-900/20 border border-white/5 group">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter mb-2">Command Console</h2>
                  <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">Direct Terminal Access</p>
                </div>
                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black tracking-[0.4em] text-blue-400">
                  SECURE_MODE
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ConsoleButton to="/products" icon="📦" title="Inventory" sub="Global Catalog Management" />
                <ConsoleButton to="/orders" icon="📋" title="Fulfillment" sub="Real-time Order Processing" />
                <ConsoleButton to="/users" icon="👤" title="Directory" sub="Access & Permission Control" />
                <ConsoleButton to="/reports" icon="📊" title="Analytics" sub="Data Export & Intelligence" />
              </div>
            </div>

            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full group-hover:bg-blue-600/20 transition-all duration-1000"></div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-[3rem] p-12 shadow-3xl shadow-slate-200/50 border border-slate-100 ring-1 ring-slate-900/5 h-full relative overflow-hidden">
            <h2 className="text-xl font-bold text-slate-900 mb-8 uppercase tracking-[0.2em] flex items-center gap-3">
              <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
              Health Map
            </h2>

            <div className="space-y-10">
              <HealthTracker label="Database Latency" value="12ms" progress={98} />
              <HealthTracker label="SSL Integrity" value="Valdated" progress={100} />
              <HealthTracker label="Storage Density" value="Moderate" progress={42} />
            </div>

            <div className="mt-16 pt-8 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Build</span>
              <span className="text-sm font-black text-slate-900">v2.4.0-pro</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function MetricTile({ label, value, icon, scheme, trend }) {
  const themes = {
    blue: 'from-blue-600 to-indigo-600 shadow-blue-500/30',
    emerald: 'from-emerald-600 to-teal-600 shadow-emerald-500/30',
    violet: 'from-violet-600 to-purple-600 shadow-violet-500/30',
    amber: 'from-amber-600 to-orange-600 shadow-amber-500/30'
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-1 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100 ring-1 ring-slate-900/5 hover:shadow-2xl transition-all duration-500 group overflow-hidden">
      <div className="bg-white rounded-[2.2rem] p-8 h-full">
        <div className="flex items-center justify-between mb-8">
          <div className={`w-14 h-14 flex items-center justify-center bg-gradient-to-br rounded-2xl text-white shadow-xl ${themes[scheme]} transition-transform group-hover:scale-110 group-hover:-rotate-6`}>
            <span className="text-2xl">{icon}</span>
          </div>
          <span className={`text-[10px] font-black px-3 py-1 rounded-full bg-slate-50 text-slate-400 uppercase tracking-widest ring-1 ring-slate-100`}>{trend}</span>
        </div>
        <div className="text-4xl font-black text-slate-900 tracking-tighter mb-1 tabular-nums">
          {value === 0 && !label.includes('Catalog') ? '0' : value || '0'}
        </div>
        <div className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{label} Metrics</div>
      </div>
    </div>
  );
}

function ConsoleButton({ to, icon, title, sub }) {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(to)} className="group block p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white hover:text-slate-900 transition-all duration-500 active:scale-95 text-left h-full w-full">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/10 text-white text-2xl group-hover:bg-slate-900 transition-all font-bold">
          {icon}
        </div>
        <div className="w-10 h-[2px] bg-white/20 group-hover:bg-slate-300"></div>
      </div>
      <h3 className="text-xl font-black tracking-tight mb-2 group-hover:text-slate-900 transition-colors">{title}</h3>
      <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">{sub}</p>

      <div className="mt-8 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-500 text-blue-600 font-black text-[10px] uppercase tracking-widest">
        Initialize Module →
      </div>
    </button>
  );
}

function HealthTracker({ label, value, progress }) {
  return (
    <div>
      <div className="flex justify-between items-end mb-4">
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</span>
        <span className="text-sm font-black text-slate-900 bg-slate-50 px-3 py-1 rounded-xl">{value}</span>
      </div>
      <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
        <div
          className="h-full bg-blue-600 rounded-full shadow-[0_0_12px_rgba(37,99,235,0.4)] transition-all duration-1000"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
