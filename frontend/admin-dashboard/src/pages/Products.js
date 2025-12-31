
// Products.js - Manage products in the admin dashboard


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

  // Fetch all data needed
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

  // Open modal for add or edit
  const openModal = (product = null) => {
    setEditProduct(product);
    setForm(product ?
      { ...product } :
      { name: '', stock: '', price: '', categoryId: '', brandId: '', description: '', imageUrl: '' }
    );
    setModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setEditProduct(null);
    setForm({ name: '', stock: '', price: '', categoryId: '', brandId: '', description: '', imageUrl: '' });
  };

  // Handle form input
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };


  // Add or update product via API
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
        // Update product
        const res = await fetch(`${API_BASE}/products/${editProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to update product');
      } else {
        // Add product
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

  // Delete product via API
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

  if (loading) return <div className="text-center py-12">Loading products...</div>;
  if (error) return <div className="text-center text-red-600 py-12">{error}</div>;

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Products</h1>
      <button
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        onClick={() => openModal()}
      >
        Add Product
      </button>
      <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left font-semibold text-gray-700">Img</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-700">ID</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-700">Name</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-700">Stock</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-700">Price</th>
            <th className="py-3 px-4"></th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-10 h-10 object-cover rounded shadow-sm" />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">No Img</div>
                )}
              </td>
              <td className="py-3 px-4">{product.id}</td>
              <td className="py-3 px-4">{product.name}</td>
              <td className="py-3 px-4 font-semibold text-blue-600">{product.stock}</td>
              <td className="py-3 px-4 font-semibold">${product.price.toFixed(2)}</td>
              <td className="py-3 px-4 text-right">
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition mr-2"
                  onClick={() => openModal(product)}
                >Edit</button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                  onClick={() => handleDelete(product.id)}
                >Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Add/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              onClick={closeModal}
            >&#10005;</button>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {editProduct ? 'Edit Product' : 'Add Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium text-sm text-gray-600">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-sm text-gray-600">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  rows="2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium text-sm text-gray-600">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-sm text-gray-600">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-1 font-medium text-sm text-gray-600">Category (Optional)</label>
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium text-sm text-gray-600">Brand (Optional)</label>
                <select
                  name="brandId"
                  value={form.brandId}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="">Select Brand</option>
                  {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium text-sm text-gray-600">Image URL (Optional)</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full font-bold shadow-sm"
              >
                {editProduct ? 'Update' : 'Add'} Product
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}