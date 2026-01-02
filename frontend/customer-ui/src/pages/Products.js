
// Products.js - Professional Product Catalog
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts, fetchCategories } from '../api';

export default function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState('');

  useEffect(() => {
    const categoryId = searchParams.get('category');
    if (categoryId) {
      setSelectedCategory(categoryId);
    }
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([fetchProducts(), fetchCategories()])
      .then(([products, categories]) => {
        setProducts(products);
        setCategories(categories);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  function getFilteredProducts() {
    let filtered = products;
    if (selectedCategory) {
      filtered = filtered.filter(
        p => Number(p.categoryId) === Number(selectedCategory)
      );
    }
    if (sort === 'price-asc') {
      filtered = [...filtered].sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sort === 'price-desc') {
      filtered = [...filtered].sort((a, b) => Number(b.price) - Number(a.price));
    }
    return filtered;
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
      <p className="text-slate-500 font-bold animate-pulse">Curating products for you...</p>
    </div>
  );

  if (error) return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-red-50 rounded-[2rem] border border-red-100 text-center">
      <span className="text-4xl mb-4 block">🔌</span>
      <h2 className="text-red-900 font-black text-xl mb-2">Connection Issues</h2>
      <p className="text-red-600 font-medium">{error}</p>
    </div>
  );

  const filteredProducts = getFilteredProducts();

  return (
    <main className="max-w-7xl mx-auto px-6 py-16 min-h-screen bg-transparent">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">Our Collection</h1>
        <p className="text-slate-400 font-medium max-w-2xl mx-auto">Explore our curated selection of high-quality products, handpicked just for you.</p>
      </div>

      {/* Filter and Sort Controls */}
      <div className="flex flex-wrap gap-6 mb-16 justify-center items-center">
        <div className="flex items-center bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="bg-transparent text-slate-600 font-bold px-4 py-2 outline-none border-none focus:ring-0 cursor-pointer min-w-[160px]"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="bg-transparent text-slate-600 font-bold px-4 py-2 outline-none border-none focus:ring-0 cursor-pointer min-w-[160px]"
          >
            <option value="">Default Sorting</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[3rem] shadow-inner border-2 border-dashed border-slate-100">
          <span className="text-6xl mb-6 block grayscale">🔍</span>
          <h3 className="text-2xl font-black text-slate-900">No products found</h3>
          <p className="text-slate-400 font-medium mt-2">Try adjusting your filters to find what you're looking for.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {filteredProducts.map(product => (
            <div key={product.id} className="group flex flex-col bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-50 relative">
              <div className="relative h-72 overflow-hidden bg-slate-50">
                <img
                  src={product.imageUrl || product.img || 'https://via.placeholder.com/400x500'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-slate-900 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase shadow-sm border border-white/20">
                  New Arrival
                </div>
              </div>
              <div className="p-8 space-y-4">
                <div className="space-y-1">
                  <h3 className="font-extrabold text-xl text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">{product.name}</h3>
                  <p className="text-slate-400 font-medium text-sm line-clamp-2 leading-relaxed">{product.description}</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <span className="font-black text-2xl text-slate-900">${Number(product.price).toFixed(2)}</span>
                  <button className="bg-slate-900 text-white p-3 rounded-2xl hover:bg-blue-600 transition-all active:scale-90 shadow-lg shadow-slate-900/10">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}


