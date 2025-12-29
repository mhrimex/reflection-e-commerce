// Coupons API
export async function fetchCoupons() {
  const res = await fetch(`${API_BASE}/coupons`);
  if (!res.ok) throw new Error('Failed to fetch coupons');
  return res.json();
}

export async function createCoupon(coupon) {
  const res = await fetch(`${API_BASE}/coupons`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(coupon)
  });
  if (!res.ok) throw new Error('Failed to create coupon');
  return res.json();
}
// Brands API
export async function fetchBrands() {
  const res = await fetch(`${API_BASE}/brands`);
  if (!res.ok) throw new Error('Failed to fetch brands');
  return res.json();
}

export async function createBrand(brand) {
  const res = await fetch(`${API_BASE}/brands`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(brand)
  });
  if (!res.ok) throw new Error('Failed to create brand');
  return res.json();
}
// Categories API
export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function createCategory(category) {
  const res = await fetch(`${API_BASE}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category)
  });
  if (!res.ok) throw new Error('Failed to create category');
  return res.json();
}
// Inventory API
export async function fetchInventory() {
  // For now, use products endpoint and map to inventory structure
  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) throw new Error('Failed to fetch inventory');
  const products = await res.json();
  // Assume each product has id, name, and stock fields
  return products.map(p => ({ id: p.id, product: p.name, stock: p.stock }));
}

export async function updateInventory(id, stock) {
  // PATCH or PUT to /products/:id with new stock value
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stock })
  });
  if (!res.ok) throw new Error('Failed to update inventory');
  return res.json();
}
// src/api.js
// Centralized API utility for admin dashboard

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export async function fetchOrders() {
  const res = await fetch(`${API_BASE}/orders`);
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}

export async function createOrder(order) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  });
  if (!res.ok) throw new Error('Failed to create order');
  return res.json();
}

// Add updateOrder and deleteOrder if backend supports them
export async function updateOrder(id, order) {
  const res = await fetch(`${API_BASE}/orders/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  });
  if (!res.ok) throw new Error('Failed to update order');
  return res.json();
}

export async function deleteOrder(id) {
  const res = await fetch(`${API_BASE}/orders/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete order');
  return res.json();
}
