

// ProductDetails.js - Shows detailed info for a single product
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchProductById } from '../api';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProductById(id)
      .then(setProduct)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-12">Loading product...</div>;
  if (error) return <div className="text-center text-red-600 py-12">{error}</div>;
  if (!product) return <div className="text-center py-12 text-gray-500">Product not found.</div>;

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg shadow p-8 flex flex-col md:flex-row gap-8">
        {/* Product Image */}
        <div className="flex-1 flex items-center justify-center">
          <img src={product.img || 'https://via.placeholder.com/200x150'} alt={product.name || product.Name} className="rounded-lg w-full max-w-xs object-cover" />
        </div>
        {/* Product Info */}
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">{product.name || product.Name}</h1>
          <p className="text-gray-600 mb-4 text-lg">{product.desc || product.Description}</p>
          <span className="font-bold text-blue-600 text-2xl mb-4">${(product.price || product.Price).toFixed ? (product.price || product.Price).toFixed(2) : product.price || product.Price}</span>
          <button className="btn w-full md:w-1/2">Add to Cart</button>
        </div>
      </div>
    </main>
  );
}