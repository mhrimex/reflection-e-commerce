
// Cart API
export async function fetchCart(token) {
  const res = await fetch(`${API_BASE}/cart`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch cart');
  return res.json();
}

// Wishlist API
export async function fetchWishlist(token) {
  const res = await fetch(`${API_BASE}/wishlist`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch wishlist');
  return res.json();
}

// Order History API
export async function fetchUserOrders(token) {
  const res = await fetch(`${API_BASE}/orders`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch orders');
  const orders = await res.json();
  return orders.map(o => ({
    id: o.OrderID || o.id,
    total: o.Total || o.total,
    status: o.Status || o.status,
    createdAt: o.CreatedAt || o.createdAt
  }));
}

export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  const categories = await res.json();
  return categories.map(c => ({
    id: c.CategoryID || c.id,
    name: c.Name || c.name
  }));
}

export async function fetchProductById(id) {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  const p = await res.json();
  return {
    id: p.ProductID || p.id,
    name: p.Name || p.name,
    description: p.Description || p.description,
    price: p.Price !== undefined ? p.Price : p.price,
    stock: p.Stock || p.stock || 0,
    categoryId: p.CategoryID || p.categoryId,
    imageUrl: p.ImageUrl || p.imageUrl
  };
}
export async function fetchUser(token) {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) {
    throw new Error('Failed to fetch user info');
  }
  return res.json();
}
export async function register({ username, password, email, roleId = 2 }) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, email, roleId })
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Registration failed');
  }
  return res.json();
}
// src/api.js
// Centralized API utility for customer UI

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export async function fetchProducts() {
  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  const products = await res.json();
  return products.map(p => ({
    id: p.ProductID || p.id,
    name: p.Name || p.name,
    description: p.Description || p.description,
    price: p.Price !== undefined ? p.Price : p.price,
    stock: p.Stock || p.stock || 0,
    categoryId: p.CategoryID || p.categoryId,
    imageUrl: p.ImageUrl || p.imageUrl
  }));
}


export async function login({ username, password }) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Login failed');
  }
  return res.json();
}
