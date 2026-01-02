
// Products.js - Professional Product Inventory Management
import { useState, useEffect } from 'react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({ name: '', stock: '', price: '', categoryId: '', brandId: '', description: '', imageUrl: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prodRes, catRes, brandRes] = await Promise.all([
        fetch(`${API_BASE}/products`),
        fetch(`${API_BASE}/categories`),
        fetch(`${API_BASE}/brands`)
      ]);

      if (!prodRes.ok || !catRes.ok || !brandRes.ok) throw new Error('Failed to fetch data');

      const [prodData, catData, brandData] = await Promise.all([
        prodRes.json(),
        catRes.json(),
        brandRes.json()
      ]);

      const mappedProducts = Array.isArray(prodData) ? prodData.map(p => ({
        id: p.ProductID || p.id,
        name: p.Name || p.name,
        description: p.Description || p.description || '',
        stock: p.Stock !== undefined ? p.Stock : (p.stock || 0),
        price: p.Price !== undefined ? p.Price : (p.price || 0),
        categoryId: p.CategoryID || p.categoryId || '',
        brandId: p.BrandID || p.brandId || '',
        imageUrl: p.ImageUrl || p.imageUrl || ''
      })) : [];

      setProducts(mappedProducts);
      setCategories(Array.isArray(catData) ? catData.map(c => ({ id: c.CategoryID || c.id, name: c.Name || c.name })) : []);
      setBrands(Array.isArray(brandData) ? brandData.map(b => ({ id: b.BrandID || b.id, name: b.Name || b.name })) : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (product = null) => {
    setEditProduct(product);
    setForm(product ?
      { ...product } :
      { name: '', stock: '', price: '', categoryId: '', brandId: '', description: '', imageUrl: '' }
    );
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditProduct(null);
    setForm({ name: '', stock: '', price: '', categoryId: '', brandId: '', description: '', imageUrl: '' });
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: form.stock !== '' ? Number(form.stock) : 0,
        categoryId: form.categoryId ? Number(form.categoryId) : null,
        brandId: form.brandId ? Number(form.brandId) : null,
        imageUrl: form.imageUrl || null
      };

      if (editProduct) {
        const res = await fetch(`${API_BASE}/products/${editProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to update product');
      } else {
        const res = await fetch(`${API_BASE}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to add product');
      }
      await fetchData();
      closeModal();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDelete = async id => {
    if (window.confirm('Delete this product?')) {
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete product');
        await fetchData();
      } catch (e) {
        setError(e.message);
      }
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <main className="max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Product Inventory</h1>
          <p className="text-slate-500 mt-2 font-medium">Manage your catalog and stock levels</p>
        </div>
        <button
          onClick={() => openModal()}
          className="w-full md:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
        >
          Add New Product
        </button>
      </div>

      {error && (
        <div className="mb-8 bg-rose-50 border border-rose-100 text-rose-600 px-6 py-4 rounded-2xl text-sm font-bold flex items-center gap-3">
          <span>⚠️</span> {error}
        </div>
      )}

      <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden ring-1 ring-slate-900/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                <th className="py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest">Product</th>
                <th className="py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest text-center">In Stock</th>
                <th className="py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Unit Price</th>
                <th className="py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.map(product => (
                <tr key={product.id} className="group hover:bg-blue-50/30 transition-colors">
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 overflow-hidden ring-1 ring-slate-200 group-hover:ring-blue-500/30 transition-all">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl grayscale opacity-30">📦</div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900 text-lg leading-tight group-hover:text-blue-600 transition-colors">{product.name}</span>
                        <span className="text-xs text-slate-400 font-bold tracking-wider uppercase">ID: {product.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-8 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${product.stock > 10 ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                      {product.stock} Units
                    </span>
                  </td>
                  <td className="py-6 px-8 text-center text-slate-900 font-black text-lg tabular-nums">
                    ${Number(product.price).toFixed(2)}
                  </td>
                  <td className="py-6 px-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openModal(product)}
                        className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        title="Edit Product"
                      >✏️</button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                        title="Delete Product"
                      >🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm z-50 p-4 md:p-6 transition-all">
          <div className="bg-white rounded-[2.5rem] shadow-3xl p-8 md:p-10 w-full max-w-xl relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300 scrollbar-hide">
            <button
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all font-bold"
              onClick={closeModal}
            >✕</button>
            <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">
              {editProduct ? 'Modify Product Entity' : 'Establish New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Display Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-900 ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500 transition-all outline-none font-bold"
                  required
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Description / Meta Data</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-900 ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500 transition-all outline-none font-bold min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Inventory Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-900 ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500 transition-all outline-none font-bold tabular-nums"
                  required
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Market Price ($)</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-900 ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500 transition-all outline-none font-bold tabular-nums"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Categorization</label>
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-900 ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500 transition-all outline-none font-bold appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiI+PHBhdGggc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJNMTkgOWwtNyA3LTctNyIvPjwvc3ZnPg==')] bg-[length:24px] bg-[right_20px_center] bg-no-repeat"
                >
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Brand Identity</label>
                <select
                  name="brandId"
                  value={form.brandId}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-900 ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500 transition-all outline-none font-bold appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiI+PHBhdGggc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJNMTkgOWwtNyA3LTctNyIvPjwvc3ZnPg==')] bg-[length:24px] bg-[right_20px_center] bg-no-repeat"
                >
                  <option value="">Select Brand</option>
                  {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Resource Image URL</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-900 ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500 transition-all outline-none font-bold"
                />
              </div>
              <div className="md:col-span-2 pt-4">
                <button
                  type="submit"
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98]"
                >
                  {editProduct ? 'Synchronize Updates' : 'Authorize New Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}