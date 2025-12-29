

import { useEffect, useState } from 'react';
import { fetchUserOrders } from '../api';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetchUserOrders(token)
      .then(setOrders)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="max-w-3xl mx-auto px-4 py-12 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">Order History</h1>
      <div className="bg-white rounded-lg shadow p-8">
        {loading ? (
          <p className="text-center py-8">Loading orders...</p>
        ) : error ? (
          <p className="text-center text-red-600 py-8">{error}</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-600 text-center">You have no past orders.</p>
        ) : (
          <ul className="space-y-6">
            {orders.map(order => (
              <li key={order.id || order.ID} className="border-b pb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-lg">Order #{order.id || order.ID}</span>
                  <span className="text-sm text-gray-500">{order.date || order.Date}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(order.items || order.Items || []).map((item, idx) => (
                    <span key={idx} className="bg-gray-100 rounded px-2 py-1 text-sm">{item.name || item.Name} x{item.qty || item.Quantity}</span>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-blue-600">${(order.total || order.Total).toFixed ? (order.total || order.Total).toFixed(2) : order.total || order.Total}</span>
                  <span className="text-sm font-medium text-green-600">{order.status || order.Status}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}