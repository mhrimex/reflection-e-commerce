
// Brands.js - Manage brands in the admin dashboard

import { useState, useEffect } from 'react';
import { fetchBrands, createBrand } from '../api';

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    loadBrands();
  }, []);

  async function loadBrands() {
    setLoading(true);
    setError('');
    try {
      const data = await fetchBrands();
      setBrands(data);
    } catch (err) {
      setError('Failed to load brands');
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createBrand({ name });
      setName('');
      await loadBrands();
    } catch (err) {
      setError('Failed to create brand');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Brands</h1>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="New brand name"
          className="border rounded px-3 py-2"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >Add</button>
      </form>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">ID</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Name</th>
            </tr>
          </thead>
          <tbody>
            {brands.map(brand => (
              <tr key={brand.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{brand.id}</td>
                <td className="py-3 px-4">{brand.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}