
// Coupons.js - Manage discounts with premium UI
import { useState, useEffect } from 'react';
import { fetchCoupons, createCoupon, updateCoupon, deleteCoupon } from '../api';

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadCoupons();
  }, []);

  async function loadCoupons() {
    setLoading(true);
    setError('');
    try {
      const data = await fetchCoupons();
      setCoupons(data);
    } catch (err) {
      setError('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createCoupon({ code, discount, expiresAt });
      setCode(''); setDiscount(''); setExpiresAt('');
      await loadCoupons();
    } catch (err) {
      setError('Failed to create coupon');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, data) => {
    setLoading(true);
    setError('');
    try {
      await updateCoupon(id, data);
      setEditingId(null);
      await loadCoupons();
    } catch (err) {
      setError('Failed to update coupon');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    setLoading(true);
    setError('');
    try {
      await deleteCoupon(id);
      await loadCoupons();
    } catch (err) {
      setError('Failed to delete coupon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Promotional Codes</h1>
          <p className="text-slate-500 mt-2 font-medium">Drive sales with targeted discount strategies</p>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 flex items-center gap-3 animate-in slide-in-from-top-4 duration-500">
          <span className="text-xl">⚠️</span> {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-10">
        <div className="bg-white rounded-[2rem] p-8 shadow-2xl shadow-slate-200/50 border border-slate-100 ring-1 ring-slate-900/5">
          <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl text-lg">🎟️</span>
            Create New Offer
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Voucher Code</label>
              <input value={code} onChange={e => setCode(e.target.value)} placeholder="SUMMER2025" className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-slate-900 ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Discount Value</label>
              <input value={discount} onChange={e => setDiscount(e.target.value)} placeholder="10%" className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-slate-900 ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Expiry Date</label>
              <input type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-slate-900 ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none" />
            </div>
            <button type="submit" className="bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-900/10">Generate Coupon</button>
          </form>
        </div>

        <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden ring-1 ring-slate-900/5">
          <table className="w-full text-left">
            <thead className="border-b border-slate-50 bg-slate-50/50">
              <tr>
                <th className="py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest">Coupon Detail</th>
                <th className="py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Benefit</th>
                <th className="py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Valid Until</th>
                <th className="py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {coupons.map(coupon => (
                <tr key={coupon.id} className="group hover:bg-indigo-50/30 transition-colors">
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-4">
                      <div className="px-3 py-1 bg-slate-100 text-slate-700 font-mono font-black text-sm rounded-lg border border-slate-200 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-500 transition-all">
                        {coupon.code}
                      </div>
                      <span className="text-xs text-slate-400 font-bold italic">#{coupon.id}</span>
                    </div>
                  </td>
                  <td className="py-6 px-8 text-center font-black text-indigo-600">{coupon.discount}</td>
                  <td className="py-6 px-8 text-center text-slate-600 font-medium">{coupon.expiresAt ? coupon.expiresAt.split('T')[0] : 'Indefinite'}</td>
                  <td className="py-6 px-8 text-right flex justify-end gap-2">
                    <button onClick={() => handleDelete(coupon.id)} className="p-3 text-slate-400 hover:text-red-600 hover:bg-white rounded-2xl transition shadow-sm ring-1 ring-slate-200">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
