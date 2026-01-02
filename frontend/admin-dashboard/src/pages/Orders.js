
// Orders.js - Premium Order Management Console
import { useState, useEffect } from 'react';
import { fetchOrders, updateOrder, deleteOrder, createOrder } from '../api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editOrder, setEditOrder] = useState(null);
  const [form, setForm] = useState({ customer: '', total: '', status: 'Shipped' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setLoading(true);
    setError('');
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }

  const openModal = (order) => {
    setEditOrder(order);
    setForm(order ? { ...order } : { customer: '', total: '', status: 'Shipped' });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditOrder(null);
    setForm({ customer: '', total: '', status: 'Shipped' });
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (editOrder) {
        await updateOrder(editOrder.id, { ...form, total: Number(form.total) });
      } else {
        await createOrder({ ...form, total: Number(form.total) });
      }
      await loadOrders();
      closeModal();
    } catch (err) {
      setError('Failed to save order');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async id => {
    if (window.confirm('Delete this order?')) {
      setLoading(true);
      setError('');
      try {
        await deleteOrder(id);
        await loadOrders();
      } catch (err) {
        setError('Failed to delete order');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && orders.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <main className="max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Fulfillment Console</h1>
          <p className="text-slate-500 mt-2 font-medium">Monitor and manage transaction cycles</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 ring-1 ring-slate-900/5">
          <div className="px-4">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Queue</div>
            <div className="text-lg font-black text-slate-900 leading-none">{orders.length} Orders</div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-8 bg-rose-50 border border-rose-100 text-rose-600 px-6 py-4 rounded-2xl text-sm font-bold flex items-center gap-3">
          <span>⚠️</span> {error}
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden ring-1 ring-slate-900/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                <th className="py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest">Transaction ID</th>
                <th className="py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest">Customer Entity</th>
                <th className="py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Net Amount</th>
                <th className="py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Status Cluster</th>
                <th className="py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orders.map(order => (
                <tr key={order.id} className="group hover:bg-blue-50/30 transition-colors">
                  <td className="py-6 px-8">
                    <span className="font-mono text-xs font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                      #{order.id}
                    </span>
                  </td>
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">👤</div>
                      <span className="font-bold text-slate-900">{order.customer || 'Guest User'}</span>
                    </div>
                  </td>
                  <td className="py-6 px-8 text-center text-slate-900 font-black text-lg tabular-nums">
                    ${Number(order.total || 0).toFixed(2)}
                  </td>
                  <td className="py-6 px-8 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'Delivered'
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        : (order.status === 'Cancelled' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-blue-50 text-blue-600 border border-blue-100')
                      }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-6 px-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openModal(order)}
                        className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                      >✏️</button>
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                      >🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm z-50 p-4 transition-all">
          <div className="bg-white rounded-[2.5rem] shadow-3xl p-10 w-full max-w-md relative animate-in zoom-in-95 duration-300">
            <button
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all font-bold"
              onClick={closeModal}
            >✕</button>
            <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight text-center">
              {editOrder ? 'Update Fulfillment' : 'Manual Entry'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Customer Identifier</label>
                <input
                  type="text"
                  name="customer"
                  value={form.customer}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-900 ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500 transition-all outline-none font-bold"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Transaction Value ($)</label>
                <input
                  type="number"
                  name="total"
                  value={form.total}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-900 ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500 transition-all outline-none font-bold tabular-nums"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Order Lifecycle State</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-900 ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500 transition-all outline-none font-bold appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiI+PHBhdGggc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJNMTkgOWwtNyA3LTctNyIvPjwvc3ZnPg==')] bg-[length:24px] bg-[right_20px_center] bg-no-repeat"
                  required
                >
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98] disabled:opacity-50"
                  disabled={loading}
                >
                  {editOrder ? 'Update Intel' : 'Record Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}