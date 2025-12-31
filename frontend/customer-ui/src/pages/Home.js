
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

    <div className="min-h-screen bg-slate-50 font-sans">
      {/* ================= Banner Section ================= */}
      <Banner />

      {/* ============= Featured Products Section ============= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-slate-800">Featured Products</h2>
          <a href="/products" className="text-blue-600 font-medium hover:text-blue-700 hover:underline">View All</a>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-red-50 text-red-600 rounded-xl border border-red-100">{error}</div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-20 text-slate-500">No featured products available at the moment.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <div key={product.id || product.ID} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-slate-100">
                <div className="relative h-64 overflow-hidden bg-slate-100">
                  <img
                    src={product.imageUrl || product.img || 'https://via.placeholder.com/400x300'}
                    alt={product.name || product.Name}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  <button className="absolute bottom-4 right-4 bg-white text-blue-600 p-3 rounded-full shadow-lg translate-y-12 group-hover:translate-y-0 transition-transform duration-300 hover:bg-blue-600 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">{product.name || product.Name}</h3>
                    <span className="font-bold text-blue-600 text-lg whitespace-nowrap">${(product.price || product.Price).toFixed ? (product.price || product.Price).toFixed(2) : product.price || product.Price}</span>
                  </div>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2">{product.desc || product.Description}</p>
                  <button className="w-full py-2.5 rounded-lg border border-slate-200 font-semibold text-slate-600 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ============= Info Section ============= */}
      <section className="bg-white py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-12 text-center">
          <div className="p-6 rounded-2xl bg-blue-50 hover:bg-blue-100 transition-colors">
            <div className="w-12 h-12 mx-auto bg-blue-600 text-white rounded-xl flex items-center justify-center mb-4 text-2xl">🚀</div>
            <h4 className="font-bold text-slate-900 mb-2">Fast Delivery</h4>
            <p className="text-slate-600 text-sm">Lightning fast shipping for all your needs.</p>
          </div>
          <div className="p-6 rounded-2xl bg-purple-50 hover:bg-purple-100 transition-colors">
            <div className="w-12 h-12 mx-auto bg-purple-600 text-white rounded-xl flex items-center justify-center mb-4 text-2xl">🔒</div>
            <h4 className="font-bold text-slate-900 mb-2">Secure Payment</h4>
            <p className="text-slate-600 text-sm">100% secure payment processing powered by Stripe.</p>
          </div>
          <div className="p-6 rounded-2xl bg-green-50 hover:bg-green-100 transition-colors">
            <div className="w-12 h-12 mx-auto bg-green-600 text-white rounded-xl flex items-center justify-center mb-4 text-2xl">💬</div>
            <h4 className="font-bold text-slate-900 mb-2">24/7 Support</h4>
            <p className="text-slate-600 text-sm">Dedicated support team ready to help anytime.</p>
          </div>
        </div>
      </section>

      {/* ============= Footer ============= */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-1">
              <div className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-blue-500">⚡</span> E-Shop
              </div>
              <p className="text-sm text-slate-400">Premium e-commerce experience aimed at providing the best quality products for our customers.</p>
            </div>
            <div>
              <h5 className="text-white font-bold mb-4">Shop</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="/products" className="hover:text-blue-400 transition">All Products</a></li>
                <li><a href="/categories" className="hover:text-blue-400 transition">Categories</a></li>
                <li><a href="/deals" className="hover:text-blue-400 transition">Deals</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold mb-4">Support</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="/contact" className="hover:text-blue-400 transition">Contact Us</a></li>
                <li><a href="/faq" className="hover:text-blue-400 transition">FAQs</a></li>
                <li><a href="/returns" className="hover:text-blue-400 transition">Returns</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold mb-4">Legal</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="/privacy" className="hover:text-blue-400 transition">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-blue-400 transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <div>&copy; {new Date().getFullYear()} E-Shop. All rights reserved.</div>
            <div className="flex gap-4">
              {/* Social icons placeholders */}
              <div className="w-8 h-8 rounded-full bg-slate-800 hover:bg-blue-600 transition-colors cursor-pointer"></div>
              <div className="w-8 h-8 rounded-full bg-slate-800 hover:bg-blue-600 transition-colors cursor-pointer"></div>
              <div className="w-8 h-8 rounded-full bg-slate-800 hover:bg-blue-600 transition-colors cursor-pointer"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}