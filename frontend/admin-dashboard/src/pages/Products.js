
// Products.js - Manage products in the admin dashboard


import { useState, useEffect } from 'react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';



export default function Products() {
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({ name: '', stock: '', price: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from backend API
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Open modal for add or edit
  const openModal = (product = null) => {
    setEditProduct(product);
    setForm(product ? { ...product } : { name: '', stock: '', price: '' });
    setModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setEditProduct(null);
    setForm({ name: '', stock: '', price: '' });
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
      if (editProduct) {
        // Update product
        const res = await fetch(`${API_BASE}/products/${editProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...form,
            stock: Number(form.stock),
            price: Number(form.price),
          }),
        });
        if (!res.ok) throw new Error('Failed to update product');
      } else {
        // Add product
        const res = await fetch(`${API_BASE}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name,
            stock: Number(form.stock),
            price: Number(form.price),
          }),
        });
        if (!res.ok) throw new Error('Failed to add product');
      }
      await fetchProducts();
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
        await fetchProducts();
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
            <th className="py-3 px-4 text-left font-semibold text-gray-700">ID</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-700">Name</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-700">Stock</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-700">Price</th>
            <th className="py-3 px-4" colSpan={2}></th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">{product.id}</td>
              <td className="py-3 px-4">{product.name}</td>
              <td className="py-3 px-4">{product.stock}</td>
              <td className="py-3 px-4">${product.price.toFixed(2)}</td>
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
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              onClick={closeModal}
            >&#10005;</button>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {editProduct ? 'Edit Product' : 'Add Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Price</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full"
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