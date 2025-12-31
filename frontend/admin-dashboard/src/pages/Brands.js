
// Brands.js - Manage brands with premium UI
import { useState, useEffect } from 'react';
import { fetchBrands, createBrand, updateBrand, deleteBrand } from '../api';

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

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
    if (!name.trim()) return;
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

  const handleUpdate = async (id) => {
    if (!editName.trim()) return;
    setLoading(true);
    setError('');
    try {
      await updateBrand(id, { name: editName });
      setEditingId(null);
      await loadBrands();
    } catch (err) {
      setError('Failed to update brand');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this brand?')) return;
    setLoading(true);
    setError('');
    try {
      await deleteBrand(id);
      await loadBrands();
    } catch (err) {
      setError('Failed to delete brand');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8 max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Product Brands</h1>
          <p className="text-slate-500 mt-2 font-medium">Manage the manufacturers and labels in your store</p>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 flex items-center gap-3 animate-in slide-in-from-top-4 duration-500">
          <span className="text-xl">⚠️</span> {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[2rem] p-8 shadow-2xl shadow-slate-200/50 border border-slate-100 ring-1 ring-slate-900/5">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="p-2 bg-amber-50 text-amber-600 rounded-xl text-lg">🏷️</span>
              New Brand
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Brand Identity</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Apple, Nike"
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-slate-900 placeholder-slate-400 ring-1 ring-slate-200 focus:ring-2 focus:ring-amber-500 transition-all outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 active:scale-[0.98] transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Register Brand'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden ring-1 ring-slate-900/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-50 bg-slate-50/50">
                    <th className="py-5 px-8 text-sm font-bold text-slate-400 uppercase tracking-widest">Brand Name</th>
                    <th className="py-5 px-8 text-sm font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {brands.length === 0 ? (
                    <tr>
                      <td colSpan="2" className="py-20 text-center text-slate-400 font-medium italic">No brands registered.</td>
                    </tr>
                  ) : (
                    brands.map(brand => (
                      <tr key={brand.id} className="group hover:bg-amber-50/30 transition-colors">
                        <td className="py-6 px-8">
                          {editingId === brand.id ? (
                            <input
                              type="text"
                              value={editName}
                              onChange={e => setEditName(e.target.value)}
                              className="bg-white ring-1 ring-amber-200 rounded-xl px-4 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-amber-500"
                              autoFocus
                            />
                          ) : (
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-xs ring-1 ring-amber-100 group-hover:bg-amber-600 group-hover:text-white transition-all">
                                {brand.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-bold text-slate-900 text-lg">{brand.name}</span>
                            </div>
                          )}
                        </td>
                        <td className="py-6 px-8 text-right">
                          <div className="flex justify-end gap-2">
                            {editingId === brand.id ? (
                              <button onClick={() => handleUpdate(brand.id)} className="p-2 bg-green-500 text-white rounded-xl">Save</button>
                            ) : (
                              <>
                                <button onClick={() => { setEditingId(brand.id); setEditName(brand.name); }} className="p-3 text-slate-400 hover:text-amber-600 hover:bg-white rounded-2xl transition shadow-sm ring-1 ring-slate-200">Edit</button>
                                <button onClick={() => handleDelete(brand.id)} className="p-3 text-slate-400 hover:text-red-600 hover:bg-white rounded-2xl transition shadow-sm ring-1 ring-slate-200">Delete</button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
