// Home.js - Premium Admin Dashboard Welcome
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main className="p-12 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-1000">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-12 mb-20">
        <div className="max-w-2xl">
          <h1 className="text-7xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.9]">
            System <span className="text-blue-600">Commander</span>
          </h1>
          <p className="text-xl text-slate-500 font-bold leading-relaxed">
            Welcome to the central intelligence hub. Monitor global infrastructure, manage product ecosystems, and oversee fulfillment pipelines from one unified interface.
          </p>
        </div>
        <div className="flex items-center gap-6 bg-white p-6 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 ring-1 ring-slate-900/5">
          <div className="w-20 h-20 rounded-3xl bg-slate-900 flex items-center justify-center text-3xl shadow-xl">👤</div>
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Access Level</div>
            <div className="text-xl font-black text-slate-900 uppercase">Super Admin</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
        <StatPreview label="Total Volume" value="128.4k" icon="📈" color="text-emerald-600 bg-emerald-50" />
        <StatPreview label="Global Users" value="8.2k" icon="👥" color="text-blue-600 bg-blue-50" />
        <StatPreview label="Service Health" value="100%" icon="🛡️" color="text-purple-600 bg-purple-50" />
      </div>

      <div className="bg-[#0f172a] rounded-[3.5rem] p-16 text-white relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(15,23,42,0.3)] border border-white/5">
        <div className="relative z-10">
          <h2 className="text-3xl font-black tracking-tight mb-12 flex items-center gap-4">
            <span className="w-12 h-1 h-px bg-blue-500"></span>
            Operational Control
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <QuickControl to="/dashboard" label="Intelligence" icon="📊" sub="Platform Metrics" />
            <QuickControl to="/products" label="Inventory" icon="📦" sub="Catalog Control" />
            <QuickControl to="/orders" label="Fulfillment" icon="🛒" sub="Live Streams" />
            <QuickControl to="/reports" label="Analytics" icon="📈" sub="Export Intelligence" />
          </div>
        </div>

        {/* Decorative background blur */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
      </div>
    </main>
  );
}

function StatPreview({ label, value, icon, color }) {
  return (
    <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-slate-100/50 border border-slate-100 ring-1 ring-slate-900/5 hover:shadow-3xl transition-all duration-500 group">
      <div className="flex items-center justify-between mb-8">
        <div className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center text-3xl shadow-inner transition-transform group-hover:scale-110 group-hover:rotate-3`}>{icon}</div>
        <div className="h-[2px] w-12 bg-slate-100"></div>
      </div>
      <div className="text-5xl font-black text-slate-900 mb-2 tracking-tighter">{value}</div>
      <div className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{label}</div>
    </div>
  );
}

function QuickControl({ to, label, icon, sub }) {
  return (
    <Link to={to} className="group block p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white hover:text-slate-900 transition-all duration-500 active:scale-95 text-left h-full">
      <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/10 text-white text-2xl group-hover:bg-slate-900 transition-all mb-8 shadow-xl">
        {icon}
      </div>
      <h3 className="text-2xl font-black tracking-tighter mb-2">{label}</h3>
      <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">{sub}</p>
      <div className="mt-8 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 duration-500 text-blue-600 font-black text-[10px] uppercase tracking-widest">
        Command Center →
      </div>
    </Link>
  );
}
