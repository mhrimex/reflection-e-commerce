


// Products.js - Displays a list of all products in the store
// Now fetches real data from backend API

import { useEffect, useState } from 'react';
import { fetchProducts, fetchCategories } from '../api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sort, setSort] = useState('');

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
        p => (p.categoryId || p.CategoryID) === Number(selectedCategory)
      );
    }
    if (sort === 'price-asc') {
      filtered = [...filtered].sort((a, b) => (a.price || a.Price) - (b.price || b.Price));
    } else if (sort === 'price-desc') {
      filtered = [...filtered].sort((a, b) => (b.price || b.Price) - (a.price || a.Price));
    }
    return filtered;
  }

  if (loading) return <div className="text-center py-12">Loading products...</div>;
  if (error) return <div className="text-center text-red-600 py-12">{error}</div>;

  const filteredProducts = getFilteredProducts();

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">All Products</h1>

      {/* Filter and Sort Controls */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id || cat.ID} value={cat.id || cat.ID}>
              {cat.name || cat.Name}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Sort By</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredProducts.map(product => (
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
    </main>
  );
}

