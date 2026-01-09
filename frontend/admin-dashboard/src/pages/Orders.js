// Orders.js - Premium Order Management Console
import { useState, useEffect } from 'react';
import { fetchOrders, updateOrder, deleteOrder, createOrder, fetchUsers, fetchProducts, fetchOrderItems } from '../api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editOrder, setEditOrder] = useState(null);

  // Form State
  const [form, setForm] = useState({ userId: '', status: 'Processing', paymentId: '' });
  const [orderItems, setOrderItems] = useState([]); // Array of { productId, name, price, quantity }
  const [currentItem, setCurrentItem] = useState({ productId: '', quantity: 1 });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const [ordersData, usersData, productsData] = await Promise.all([
        fetchOrders(),
        fetchUsers(),
        fetchProducts()
      ]);
      setOrders(ordersData);
      setUsers(usersData);
      setProducts(productsData);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  const generateOrdersPDF = () => {
    const doc = new jsPDF();
    const dateStr = new Date().toLocaleDateString();

    doc.setFontSize(22);
    doc.setTextColor(40);
    doc.text("Reflection E-Commerce", 14, 20);

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("Order Fulfillment Report", 14, 30);
    doc.text(`Generated: ${dateStr}`, 14, 36);

    doc.setDrawColor(200);
    doc.line(14, 40, 196, 40);

    const tableBody = orders.map(order => {
      const user = users.find(u => u.id === order.userId);
      return [
        order.id,
        user ? user.username : 'Guest',
        `$${Number(order.total).toFixed(2)}`,
        order.status,
        order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'
      ];
    });

    autoTable(doc, {
      startY: 45,
      head: [['Order ID', 'Customer', 'Total', 'Status', 'Date']],
      body: tableBody,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 3 },
    });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`Page ${i} of ${pageCount}`, 196, 285, { align: 'right' });
    }

    doc.save(`Orders_Report_${Date.now()}.pdf`);
  };

  const openModal = async (order) => {
    setEditOrder(order);
    if (order) {
      setForm({
        userId: order.userId || '',
        status: order.status || 'Processing',
        shippingAddress: order.shippingAddress || '',
        paymentId: order.paymentId || ''
      });
      // Fetch Items
      try {
        const items = await fetchOrderItems(order.id);
        console.log('Fetched Items for Edit:', items);
        setOrderItems(Array.isArray(items) ? items : []);
      } catch (e) {
        console.error(e);
        setOrderItems([]);
      }
    } else {
      setForm({ userId: '', status: 'Processing', shippingAddress: '', paymentId: '' });
      setOrderItems([]);
    }
    setCurrentItem({ productId: '', quantity: 1 });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditOrder(null);
    setForm({ userId: '', status: 'Processing', shippingAddress: '', paymentId: '' });
    setOrderItems([]);
  };

  const handleFormChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!currentItem.productId || currentItem.quantity < 1) return;

    const product = products.find(p => p.id === Number(currentItem.productId));
    if (!product) return;

    const newItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: Number(currentItem.quantity)
    };

    setOrderItems([...orderItems, newItem]);
    setCurrentItem({ productId: '', quantity: 1 });
  };

  const handleRemoveItem = (index) => {
    const newItems = [...orderItems];
    newItems.splice(index, 1);
    setOrderItems(newItems);
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (orderItems.length === 0 && !editOrder) {
      setError('Please add at least one item to the order');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const total = calculateTotal();
      const payload = {
        ...form,
        paymentId: form.paymentId ? Number(form.paymentId) : null, // Send null if empty
        total: total,
        items: orderItems
      };

      if (editOrder) {
        await updateOrder(editOrder.id, { ...payload });
      } else {
        await createOrder(payload);
      }
      await loadData();
      closeModal();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to save order');
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
        await loadData();
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
          <button
            onClick={generateOrdersPDF}
            className="bg-white text-slate-900 w-10 h-10 rounded-xl flex items-center justify-center font-bold hover:bg-slate-50 border border-slate-200 transition"
            title="Download PDF"
          >📄</button>
          <button
            onClick={() => openModal(null)}
            className="bg-blue-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold hover:bg-blue-700 transition"
          >+</button>
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
              {orders.map(order => {
                const user = users.find(u => u.id === order.userId);
                return (
                  <tr key={order.id} className="group hover:bg-blue-50/30 transition-colors">
                    <td className="py-6 px-8">
                      <span className="font-mono text-xs font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                        #{order.id}
                      </span>
                    </td>
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">👤</div>
                        <span className="font-bold text-slate-900">{user ? user.username : 'Guest User'}</span>
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
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm z-50 p-4 transition-all overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] shadow-3xl p-10 w-full max-w-2xl relative animate-in zoom-in-95 duration-300 my-10">
            <button
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all font-bold"
              onClick={closeModal}
            >✕</button>
            <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight text-center">
              {editOrder ? 'Update Fulfillment' : 'Manual Entry'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Header Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Customer Entity</label>
                  <select
                    name="userId"
                    value={form.userId}
                    onChange={handleFormChange}
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-900 ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500 transition-all outline-none font-bold appearance-none"
                    required
                  >
                    <option value="">Select User</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.username} ({u.email})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Shipping Address</label>
                  <input
                    type="text"
                    name="shippingAddress"
                    value={form.shippingAddress || ''}
                    onChange={handleFormChange}
                    placeholder="Street, City, Zip"
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-900 ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500 transition-all outline-none font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Lifecycle State</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleFormChange}
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-900 ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500 transition-all outline-none font-bold appearance-none"
                    required
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Payment Ref (Optional)</label>
                  <input
                    type="number"
                    name="paymentId"
                    value={form.paymentId || ''}
                    onChange={handleFormChange}
                    placeholder="ID"
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-900 ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500 transition-all outline-none font-bold"
                  />
                </div>
              </div>

              {/* Item Selection */}
              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Manage Products</h3>
                <div className="flex gap-3 mb-4">
                  <select
                    className="flex-1 bg-white border-none rounded-xl px-4 py-3 text-sm font-bold ring-1 ring-slate-200"
                    value={currentItem.productId}
                    onChange={e => setCurrentItem({ ...currentItem, productId: e.target.value })}
                  >
                    <option value="">Select Product...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (${Number(p.price).toFixed(2)})</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    className="w-24 bg-white border-none rounded-xl px-4 py-3 text-sm font-bold ring-1 ring-slate-200"
                    placeholder="Qty"
                    min="1"
                    value={currentItem.quantity}
                    onChange={e => setCurrentItem({ ...currentItem, quantity: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="bg-blue-600 text-white px-6 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors"
                  >Add</button>
                </div>

                {/* Items List */}
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs">
                          {item.quantity}x
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{item.name}</div>
                          <div className="text-xs text-slate-400 font-bold">${Number(item.price).toFixed(2)} / unit</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="font-black text-slate-900">${(item.price * item.quantity).toFixed(2)}</div>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="text-rose-400 hover:text-rose-600 font-bold"
                        >✕</button>
                      </div>
                    </div>
                  ))}
                  {orderItems.length === 0 && (
                    <div className="text-center text-slate-400 text-xs font-medium py-4">No items added</div>
                  )}
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Total Valuation</span>
                <span className="text-3xl font-black text-slate-900 tracking-tight">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98] disabled:opacity-50"
                  disabled={loading}
                >
                  {editOrder ? 'Update Status Details' : 'Execute Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
