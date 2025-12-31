
// Reports.js - Premium Operational Reports
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { fetchOrders, fetchProducts, fetchUsers } from '../api';

export default function Reports() {
  const [data, setData] = useState({ orders: [], products: [], users: [] });
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const decoded = jwtDecode(token);
      if (Number(decoded.roleId) === 1) {
        setIsAdmin(true);
        loadAllData();
      } else {
        navigate('/login');
      }
    } catch (err) {
      navigate('/login');
    }
  }, [navigate]);

  async function loadAllData() {
    setLoading(true);
    try {
      const fetchData = async (fn) => {
        try { return await fn(); } catch (e) { console.error(`Reports: Fetch failed`, e); return []; }
      };

      const [orders, products, users] = await Promise.all([
        fetchData(fetchOrders),
        fetchData(fetchProducts),
        fetchData(fetchUsers)
      ]);

      setData({ orders, products, users });
    } finally {
      setLoading(false);
    }
  }

  if (!isAdmin) return null;

  const totalRevenue = data.orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const avgOrderValue = data.orders.length ? (totalRevenue / data.orders.length).toFixed(2) : 0;

  return (
    <main className="p-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="flex justify-between items-center mb-16">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Market <span className="text-blue-600">Intelligence</span></h1>
          <p className="text-slate-400 mt-2 font-bold text-lg tracking-tight uppercase tracking-[0.2em]">Operational Data Clusters</p>
        </div>
        <button
          onClick={() => window.print()}
          className="bg-[#0f172a] text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-2xl shadow-slate-900/20 flex items-center gap-3 active:scale-95"
        >
          <span>📥</span> Export Intel
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <ReportCard title="Revenue Stream" value={`$${totalRevenue.toLocaleString()}`} subtitle="Gross Financial Inflow" icon="💎" color="bg-emerald-50 text-emerald-600" />
        <ReportCard title="Active Cluster" value={data.users.length} subtitle="Registered User Nodes" icon="👤" color="bg-blue-50 text-blue-600" />
        <ReportCard title="Ticket Delta" value={`$${avgOrderValue}`} subtitle="Mean Transaction Value" icon="🎫" color="bg-purple-50 text-purple-600" />
      </div>

      <div className="bg-white rounded-[3rem] p-12 shadow-3xl shadow-slate-200/50 border border-slate-100 ring-1 ring-slate-900/5 overflow-hidden relative group">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-4">
            <span className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-xl text-lg">⚡</span>
            Data Pipeline Status
          </h2>
          <div className="text-[10px] font-black tracking-[0.3em] text-slate-300 uppercase">Real-time sync active</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <DataStream label="Sales Ledger" count={data.orders.length} type="JSON/XML" />
          <DataStream label="Inventory Log" count={data.products.length} type="CSV/PDF" />
          <DataStream label="Identity Meta" count={data.users.length} type="ENCRYPTED" />
        </div>

        {/* Decorative backdrop */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 -z-10 group-hover:bg-blue-100/50 transition-colors duration-1000"></div>
      </div>
    </main>
  );
}

function ReportCard({ title, value, subtitle, icon, color }) {
  return (
    <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-slate-100/50 border border-slate-100 ring-1 ring-slate-900/5 group hover:shadow-4xl transition-all duration-700">
      <div className="flex items-center gap-4 mb-10">
        <div className={`p-5 rounded-2xl ${color} font-black text-2xl shadow-lg shadow-current/5 transition-transform group-hover:rotate-12`}>{icon}</div>
        <h3 className="font-black text-slate-300 uppercase tracking-[0.2em] text-[10px]">{title}</h3>
      </div>
      <div className="text-5xl font-black text-slate-900 mb-2 tracking-tighter tabular-nums">{value}</div>
      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest opacity-60">{subtitle}</div>
    </div>
  );
}

function DataStream({ label, count, type }) {
  return (
    <div className="group flex flex-col p-8 rounded-[2rem] bg-slate-50/50 border border-slate-100 hover:bg-[#0f172a] transition-all duration-500">
      <div className="flex items-center justify-between mb-8">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-slate-900 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
          {label.charAt(0)}
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{type}</span>
      </div>
      <h4 className="font-black text-xl text-slate-900 group-hover:text-white mb-1 transition-colors">{label}</h4>
      <div className="text-4xl font-black text-blue-600 group-hover:text-emerald-400 transition-colors mb-6">{count}</div>

      <button className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-white/40 hover:text-white transition-colors text-left">
        Request Access →
      </button>
    </div>
  );
}

