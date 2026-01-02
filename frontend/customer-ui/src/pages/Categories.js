import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = 'http://localhost:5000/api';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/categories`)
      .then(res => res.json())
      .then(data => {
        setCategories(data.map(c => ({
          id: c.CategoryID || c.id,
          name: c.Name || c.name,
          icon: c.Icon || c.icon || '🏷️'
        })));
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch categories failed:', err);
        setError('Failed to load categories');
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <main className="max-w-7xl mx-auto px-4 py-20 min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </main>
  );

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 md:py-20 min-h-screen bg-gray-50/50 transition-all duration-500">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black mb-4 text-slate-900 tracking-tight">Our Collections</h1>
        <p className="text-slate-500 font-medium max-w-xl mx-auto">Browse through our meticulously curated categories to find exactly what you're looking for.</p>
      </div>

      {error && (
        <div className="max-w-md mx-auto p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-center mb-8">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
        {categories.map(cat => (
          <Link
            key={cat.id}
            to={`/products?category=${cat.id}`}
            className="group relative bg-white rounded-3xl p-8 md:p-10 flex flex-col items-center justify-center text-center transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 border border-slate-100 ring-1 ring-slate-900/5"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-4xl md:text-5xl mb-6 group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-500 shadow-inner group-hover:shadow-blue-500/30">
              <span className="group-hover:filter group-hover:drop-shadow-lg transition-all">{cat.icon}</span>
            </div>
            <div className="font-black text-blue-600 uppercase text-[10px] tracking-[0.2em] mb-2 opacity-50">Category</div>
            <h3 className="font-black text-xl text-slate-900 tracking-tight">{cat.name}</h3>

            <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 text-blue-600 font-black text-xs tracking-widest uppercase">
              Explore →
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}