
// Orders.js - Manage orders in the admin dashboard

import { useState, useEffect } from 'react';
import { fetchOrders, createOrder, updateOrder, deleteOrder } from '../api';




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

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Orders</h1>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Order ID</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Customer</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Total</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Status</th>
              <th className="py-3 px-4" colSpan={2}></th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{order.id}</td>
                <td className="py-3 px-4">{order.customer}</td>
                <td className="py-3 px-4">${order.total?.toFixed(2)}</td>
                <td className="py-3 px-4">
                  <span className={
                    order.status === 'Delivered'
                      ? 'text-green-600 font-semibold'
                      : 'text-yellow-600 font-semibold'
                  }>{order.status}</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition mr-2"
                    onClick={() => openModal(order)}
                  >Edit</button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                    onClick={() => handleDelete(order.id)}
                  >Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal for Edit */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              onClick={closeModal}
            >&#10005;</button>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {editOrder ? 'Edit Order' : 'Add Order'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Customer</label>
                <input
                  type="text"
                  name="customer"
                  value={form.customer}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Total</label>
                <input
                  type="number"
                  name="total"
                  value={form.total}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="Delivered">Delivered</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Processing">Processing</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full"
                disabled={loading}
              >
                {editOrder ? 'Update Order' : 'Add Order'}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}