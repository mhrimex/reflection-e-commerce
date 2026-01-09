
// Checkout.js - Handles the checkout process
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCart, fetchUser, submitOrder } from '../api';
import { jwtDecode } from 'jwt-decode';

function Checkout() {
  const [form, setForm] = useState({ name: '', address: '', card: '', expiry: '', cvv: '' });
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    async function loadData() {
      try {
        const [cartData, userData] = await Promise.all([
          fetchCart(token),
          fetchUser(token) // Assuming this returns { id, username, ... }
        ]);

        if (cartData.length === 0) {
          navigate('/cart');
          return;
        }

        setCartItems(cartData);
        setUser(userData);
        setForm(f => ({ ...f, name: userData.username || '' }));
      } catch (err) {
        console.error(err);
        setError('Failed to load checkout data');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [navigate]);

  const total = cartItems.reduce((sum, item) => sum + (item.price || item.Price) * (item.qty || item.Quantity), 0);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setProcessing(true);
    setError('');

    const token = localStorage.getItem('token');
    // Decode token to get ID if user object doesn't have it (fallback)
    let userId = user?.id || user?.UserID;
    if (!userId && token) {
      try {
        const decoded = jwtDecode(token);
        userId = decoded.userId || decoded.id; // Adjust based on your JWT payload
      } catch (e) { }
    }

    const payload = {
      userId: userId,
      total: total,
      status: 'Processing',
      shippingAddress: form.address,
      items: cartItems.map(item => ({
        productId: item.id || item.ID || item.ProductID,
        quantity: item.qty || item.Quantity,
        price: item.price || item.Price
      }))
    };

    try {
      const result = await submitOrder(token, payload);
      // Clear cart (optional, backend should usually do this or frontend needs a clearCart API)
      // For now, assume success means we can go to confirmation
      navigate('/order-confirmation', { state: { orderId: result.orderId } });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Payment processing failed');
    } finally {
      setProcessing(false);
    }
  }

  if (loading) return <div className="p-12 text-center text-gray-500 font-bold">Loading secure checkout...</div>;

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">Secure Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-sm p-8 h-fit">
          <h2 className="text-xl font-bold mb-6 border-b pb-4">Order Summary</h2>
          <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto">
            {cartItems.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-500">{item.qty || item.Quantity}x</span>
                  <span>{item.name || item.Name}</span>
                </div>
                <span className="font-bold">${((item.price || item.Price) * (item.qty || item.Quantity)).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-gray-100 text-xl font-black text-blue-600">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8 flex flex-col gap-5">
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-bold">{error}</div>}

          <h2 className="text-xl font-bold mb-2">Shipping & Payment</h2>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Shipping Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="123 Market St, City, Country"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Card Number</label>
              <input
                type="text"
                name="card"
                value={form.card}
                onChange={handleChange}
                required
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="0000 0000 0000 0000"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Expiry</label>
              <input
                type="text"
                name="expiry"
                value={form.expiry}
                onChange={handleChange}
                required
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="MM/YY"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">CVV</label>
              <input
                type="text"
                name="cvv"
                value={form.cvv}
                onChange={handleChange}
                required
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="123"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={processing}
            className="btn w-full mt-6 bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {processing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
          </button>
        </form>
      </div>
    </main>
  );
}

export default Checkout;