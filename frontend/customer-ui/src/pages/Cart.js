

import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchCart } from '../api';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetchCart(token)
      .then(setCartItems)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const total = cartItems.reduce((sum, item) => sum + (item.price || item.Price) * (item.qty || item.Quantity), 0);

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">Your Cart</h1>
      <div className="bg-white rounded-lg shadow p-6">
        {loading ? (
          <p className="text-center py-8">Loading cart...</p>
        ) : error ? (
          <p className="text-center text-red-600 py-8">{error}</p>
        ) : cartItems.length === 0 ? (
          <p className="text-gray-600 text-center">Your cart is empty.</p>
        ) : (
          <>
            <ul className="divide-y divide-gray-200 mb-6">
              {cartItems.map(item => (
                <li key={item.id || item.ID} className="flex items-center py-4 gap-4">
                  <img src={item.img || 'https://via.placeholder.com/100x100'} alt={item.name || item.Name} className="w-20 h-20 rounded object-cover" />
                  <div className="flex-1">
                    <h2 className="font-semibold text-lg text-gray-900">{item.name || item.Name}</h2>
                    <span className="text-gray-600">${(item.price || item.Price).toFixed ? (item.price || item.Price).toFixed(2) : item.price || item.Price} x {item.qty || item.Quantity}</span>
                  </div>
                  <span className="font-bold text-blue-600 text-lg">${((item.price || item.Price) * (item.qty || item.Quantity)).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between items-center border-t pt-4">
              <span className="font-bold text-xl">Total:</span>
              <span className="font-bold text-blue-600 text-2xl">${total.toFixed(2)}</span>
            </div>
            <button onClick={() => navigate('/checkout')} className="btn w-full mt-6 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">Proceed to Checkout</button>
          </>
        )}
      </div>
    </main>
  );
}