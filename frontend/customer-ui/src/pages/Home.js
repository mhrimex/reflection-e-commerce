
// Import the Banner component for the top section

import Banner from '../components/Banner';
import { useEffect, useState } from 'react';
import { fetchProducts } from '../api';

// Home.js - Main landing page with banner and featured sections
// This page is the first thing users see. It includes:
// 1. A banner (hero section)
// 2. Featured products (example cards)
// 3. Info section (delivery, payment, support)
export default function Home() {

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts()
      .then(products => {
        // Optionally, pick a subset as "featured"
        setFeaturedProducts(products.slice(0, 3));
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ================= Banner Section ================= */}
      <Banner />

      {/* ============= Featured Products Section ============= */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">Featured Products</h2>
        {loading ? (
          <div className="text-center py-8">Loading featured products...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-8">{error}</div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No featured products available.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <div key={product.id || product.ID} className="card flex flex-col items-center transition-transform hover:-translate-y-1 hover:shadow-xl">
                <img src={product.img || 'https://via.placeholder.com/200x150'} alt={product.name || product.Name} className="mb-4 rounded-lg w-full h-40 object-cover" />
                <h3 className="font-semibold text-lg mb-1 text-gray-900">{product.name || product.Name}</h3>
                <p className="text-gray-600 mb-3 text-center">{product.desc || product.Description}</p>
                <span className="font-bold text-blue-600 mb-2 text-lg">${(product.price || product.Price).toFixed ? (product.price || product.Price).toFixed(2) : product.price || product.Price}</span>
                <button className="btn w-full mt-2">Add to Cart</button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ============= Info Section ============= */}
      <section className="bg-white py-12 mt-12 border-t">
        <div className="max-w-4xl mx-auto px-4 grid md:grid-cols-3 gap-8 text-center">
          {/* Info card 1: Delivery */}
          <div>
            <h4 className="font-bold text-blue-600 mb-2">Fast Delivery</h4>
            <p className="text-gray-600">Get your products delivered quickly and safely to your doorstep.</p>
          </div>
          {/* Info card 2: Payment */}
          <div>
            <h4 className="font-bold text-blue-600 mb-2">Secure Payment</h4>
            <p className="text-gray-600">All transactions are encrypted and your data is protected.</p>
          </div>
          {/* Info card 3: Support */}
          <div>
            <h4 className="font-bold text-blue-600 mb-2">24/7 Support</h4>
            <p className="text-gray-600">Our team is here to help you anytime, anywhere.</p>
          </div>
        </div>
      </section>

      {/* ============= Footer (Home only) ============= */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-lg font-bold text-blue-400">E-Shop</div>
          <div className="text-gray-400">&copy; {new Date().getFullYear()} E-Shop. All rights reserved.</div>
          <div className="flex gap-4">
            <a href="/about" className="hover:text-blue-400 transition">About</a>
            <a href="/contact" className="hover:text-blue-400 transition">Contact</a>
            <a href="/products" className="hover:text-blue-400 transition">Products</a>
          </div>
        </div>
      </footer>
    </div>
  );
}