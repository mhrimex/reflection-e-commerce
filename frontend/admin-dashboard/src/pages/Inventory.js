
// Inventory.js - Manage inventory in the admin dashboard

import { useState, useEffect } from 'react';
import { fetchInventory, updateInventory } from '../api';

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null);
  const [editStock, setEditStock] = useState('');

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    setLoading(true);
    setError('');
    try {
      const data = await fetchInventory();
      setInventory(data);
    } catch (err) {
      setError('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (id, stock) => {
    setEditId(id);
    setEditStock(stock);
  };

  const handleSave = async (id) => {
    setLoading(true);
    setError('');
    try {
      await updateInventory(id, Number(editStock));
      await loadInventory();
      setEditId(null);
      setEditStock('');
    } catch (err) {
      setError('Failed to update inventory');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Inventory Management</h1>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">ID</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Product</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Stock</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{item.id}</td>
                <td className="py-3 px-4">{item.product}</td>
                <td className="py-3 px-4">
                  {editId === item.id ? (
                    <input
                      type="number"
                      value={editStock}
                      onChange={e => setEditStock(e.target.value)}
                      className="border rounded px-2 py-1 w-20"
                    />
                  ) : (
                    item.stock
                  )}
                </td>
                <td className="py-3 px-4">
                  {editId === item.id ? (
                    <>
                      <button
                        className="bg-blue-600 text-white px-2 py-1 rounded mr-2"
                        onClick={() => handleSave(item.id)}
                        disabled={loading}
                      >Save</button>
                      <button
                        className="bg-gray-400 text-white px-2 py-1 rounded"
                        onClick={() => { setEditId(null); setEditStock(''); }}
                        disabled={loading}
                      >Cancel</button>
                    </>
                  ) : (
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                      onClick={() => handleEdit(item.id, item.stock)}
                    >Edit</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}