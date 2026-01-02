
// Reports.js - Modular Operational Intelligence Suite
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { fetchReports } from '../api';

export default function Reports() {
  const [reportType, setReportType] = useState('overview');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    try {
      const decoded = jwtDecode(token);
      if (Number(decoded.roleId) === 1) {
        setIsAdmin(true);
        loadReport(reportType);
      } else { navigate('/login'); }
    } catch (err) { navigate('/login'); }
  }, [navigate, reportType]);

  async function loadReport(type) {
    setLoading(true);
    setData(null); // Clear stale data to prevent race condition crashes
    try {
      const result = await fetchReports(type);
      setData(result);
    } catch (e) {
      console.error('Reports: Load failed', e);
    } finally {
      setLoading(false);
    }
  }

  const handleExport = () => {
    // Safety check: Don't export if data is missing or doesn't match report type
    if (!data) {
      alert("Intelligence data not synchronized. Please wait.");
      return;
    }

    let headers = [];
    let rows = [];
    let filename = `intel-${reportType}-${new Date().toISOString().split('T')[0]}.csv`;

    try {
      if (reportType === 'overview' && data.recentOrders) {
        headers = ["Order ID", "Username", "Total", "Status", "Date"];
        rows = data.recentOrders.map(o => [o.OrderID, o.Username, o.Total, o.Status, o.CreatedAt]);
      } else if (reportType === 'stock' && data.lowStock) {
        headers = ["Product ID", "Name", "Stock Level", "Price", "Position Value"];
        rows = data.lowStock.map(p => [p.ProductID, p.Name, p.Stock, p.Price, p.PositionValue]);
      } else if (reportType === 'sales' && data.topProducts) {
        headers = ["Product Name", "Units Sold", "Total Revenue"];
        rows = data.topProducts.map(p => [p.Name, p.UnitsSold, p.TotalRevenue]);
      } else {
        alert("Report format mismatch. Try again in a second.");
        return;
      }

      if (rows.length === 0) {
        alert("No records found to export in this cluster.");
        return;
      }

      const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failure:", err);
      alert("Failed to package the CSV intel. Check console.");
    }
  };

  if (!isAdmin) return null;

  return (
    <main className="max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Market <span className="text-blue-600">Intelligence</span></h1>
          <div className="flex items-center gap-4 mt-4">
            {['overview', 'stock', 'sales'].map(t => (
              <button
                key={t}
                onClick={() => setReportType(t)}
                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${reportType === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-400 border-slate-100 hover:border-blue-200'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={handleExport}
          className="bg-[#0f172a] text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-2xl shadow-slate-900/20 flex items-center gap-3 active:scale-95"
        >
          <span>📥</span> Export {reportType.toUpperCase()}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {reportType === 'overview' && data && <OverviewModule data={data} />}
          {reportType === 'stock' && data && <StockModule data={data} />}
          {reportType === 'sales' && data && <SalesModule data={data} />}
        </>
      )}
    </main>
  );
}

function OverviewModule({ data }) {
  const { metrics, recentOrders } = data;
  return (
    <div className="space-y-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ReportCard title="Total Revenue" value={`$${Number(metrics.TotalRevenue || 0).toLocaleString()}`} subtitle="Gross Inflow" icon="💎" color="bg-emerald-50 text-emerald-600" />
        <ReportCard title="Customer Cluster" value={metrics.TotalUsers} subtitle="Identities Registered" icon="👤" color="bg-blue-50 text-blue-600" />
        <ReportCard title="Ticket Count" value={metrics.TotalOrders} subtitle="Manual Transactions" icon="🎫" color="bg-purple-50 text-purple-600" />
      </div>
      <RecentActivityTable orders={recentOrders} />
    </div>
  );
}

function StockModule({ data }) {
  const { metrics, lowStock, byCategory } = data;
  return (
    <div className="space-y-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ReportCard title="Inventory Value" value={`$${Number(metrics.TotalInventoryValue || 0).toLocaleString()}`} subtitle="Warehouse Asset Logic" icon="🏗️" color="bg-amber-50 text-amber-600" />
        <ReportCard title="Stock Variation" value={metrics.TotalStockUnits} subtitle="Active Floating Units" icon="📦" color="bg-blue-50 text-blue-600" />
        <ReportCard title="Critical Nodes" value={metrics.LowStockAlerts} subtitle="Low Stock Interrupts" icon="⚠️" color="bg-rose-50 text-rose-600" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-100 ring-1 ring-slate-900/5 overflow-hidden">
          <h3 className="text-xl font-black text-slate-900 mb-8 uppercase tracking-widest flex items-center gap-3">
            <span className="w-2 h-8 bg-rose-500 rounded-full"></span>
            Replenishment Required
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="pb-4">Core Item</th>
                  <th className="pb-4">Units</th>
                  <th className="pb-4">Position Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {lowStock.map(p => (
                  <tr key={p.ProductID}>
                    <td className="py-4 font-bold text-slate-900">{p.Name}</td>
                    <td className={`py-4 font-black ${p.Stock <= 5 ? 'text-rose-600' : 'text-orange-500'}`}>{p.Stock}</td>
                    <td className="py-4 font-black text-slate-400">${Number(p.PositionValue).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="lg:col-span-1 bg-[#0f172a] rounded-[3rem] p-10 text-white shadow-3xl border border-white/5">
          <h3 className="text-xl font-black mb-8 uppercase tracking-widest">Logic Map</h3>
          <div className="space-y-6">
            {byCategory.map(c => (
              <div key={c.CategoryName}>
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  <span>{c.CategoryName}</span>
                  <span>{c.TotalUnits} Units</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: '60%' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SalesModule({ data }) {
  const { topProducts, byCategory } = data;
  return (
    <div className="space-y-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-100 ring-1 ring-slate-900/5">
          <h3 className="text-xl font-black text-slate-900 mb-8 uppercase tracking-widest">Performance Leaders</h3>
          <div className="space-y-6">
            {topProducts.map(p => (
              <div key={p.Name} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
                <div>
                  <div className="font-black text-slate-900">{p.Name}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.UnitsSold} Units Relocated</div>
                </div>
                <div className="text-lg font-black text-blue-600">${Number(p.TotalRevenue).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-100 ring-1 ring-slate-900/5">
          <h3 className="text-xl font-black text-slate-900 mb-8 uppercase tracking-widest">Category Distribution</h3>
          <div className="space-y-8">
            {byCategory.map(c => (
              <div key={c.CategoryName} className="flex items-center justify-between">
                <div className="font-bold text-slate-500">{c.CategoryName}</div>
                <div className="text-lg font-black text-slate-900">${Number(c.Revenue).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportCard({ title, value, subtitle, icon, color }) {
  return (
    <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-slate-100/50 border border-slate-100 ring-1 ring-slate-900/5 group hover:shadow-4xl transition-all duration-700">
      <div className="flex items-center gap-4 mb-10">
        <div className={`p-5 rounded-2xl ${color} font-black text-2xl shadow-lg transition-transform group-hover:rotate-12`}>{icon}</div>
        <h3 className="font-black text-slate-300 uppercase tracking-[0.2em] text-[10px]">{title}</h3>
      </div>
      <div className="text-5xl font-black text-slate-900 mb-2 tracking-tighter tabular-nums">{value}</div>
      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest opacity-60">{subtitle}</div>
    </div>
  );
}

function RecentActivityTable({ orders }) {
  return (
    <div className="bg-white rounded-[3rem] p-12 shadow-3xl shadow-slate-200/50 border border-slate-100 ring-1 ring-slate-900/5 overflow-hidden">
      <h2 className="text-2xl font-black text-slate-900 mb-12 flex items-center gap-4 uppercase tracking-widest">
        <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
        Latest Transactions
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="pb-6 px-4">Entity</th>
              <th className="pb-6 px-4">Operator</th>
              <th className="pb-6 px-4">Value</th>
              <th className="pb-6 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {orders.map(order => (
              <tr key={order.OrderID} className="group hover:bg-slate-50 transition-colors">
                <td className="py-6 px-4 text-sm font-black text-slate-900">#{order.OrderID}</td>
                <td className="py-6 px-4 text-sm font-bold text-slate-500">{order.Username}</td>
                <td className="py-6 px-4 text-sm font-black text-slate-900">${Number(order.Total).toFixed(2)}</td>
                <td className="py-6 px-4">
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${order.Status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                    }`}>{order.Status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
