
// Coupons.js - Manage discounts and coupons in the admin dashboard

import { useState, useEffect } from 'react';
import { fetchCoupons, createCoupon } from '../api';

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

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
      setCode('');
      setDiscount('');
      setExpiresAt('');
      await loadCoupons();
    } catch (err) {
      setError('Failed to create coupon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Discounts & Coupons</h1>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="mb-6 flex gap-2 flex-wrap">
        <input
          type="text"
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="Coupon code"
          className="border rounded px-3 py-2"
          required
        />
        <input
          type="text"
          value={discount}
          onChange={e => setDiscount(e.target.value)}
          placeholder="Discount (e.g. 10% or Free Shipping)"
          className="border rounded px-3 py-2"
          required
        />
        <input
          type="date"
          value={expiresAt}
          onChange={e => setExpiresAt(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >Add</button>
      </form>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">ID</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Code</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Discount</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Expires At</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map(coupon => (
              <tr key={coupon.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{coupon.id}</td>
                <td className="py-3 px-4">{coupon.code}</td>
                <td className="py-3 px-4">{coupon.discount}</td>
                <td className="py-3 px-4">{coupon.expiresAt ? coupon.expiresAt.split('T')[0] : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}