

import { useEffect, useState } from 'react';
import { fetchWishlist } from '../api';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetchWishlist(token)
      .then(setWishlist)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">Your Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {loading ? (
          <p className="text-center py-8">Loading wishlist...</p>
        ) : error ? (
          <p className="text-center text-red-600 py-8">{error}</p>
        ) : wishlist.length === 0 ? (
          <p className="text-gray-600 text-center">Your wishlist is empty.</p>
        ) : (
          wishlist.map(item => (
            <div key={item.id || item.ID} className="card flex flex-col items-center transition-transform hover:-translate-y-1 hover:shadow-xl">
              <img src={item.img || 'https://via.placeholder.com/200x150'} alt={item.name || item.Name} className="mb-4 rounded-lg w-full h-40 object-cover" />
              <h3 className="font-semibold text-lg mb-1 text-gray-900">{item.name || item.Name}</h3>
              <span className="font-bold text-blue-600 mb-2 text-lg">${(item.price || item.Price).toFixed ? (item.price || item.Price).toFixed(2) : item.price || item.Price}</span>
              <button className="btn w-full mt-2">Add to Cart</button>
            </div>
          ))
        )}
      </div>
    </main>
  );
}