// Coupons API
export async function fetchCoupons() {
  const res = await fetch(`${API_BASE}/coupons?_t=${Date.now()}`);
  if (!res.ok) throw new Error('Failed to fetch coupons');
  const coupons = await res.json();
  return coupons.map(c => ({
    id: c.CouponID || c.id,
    code: c.Code || c.code,
    discount: c.Discount || c.discount,
    expiresAt: c.ExpiresAt || c.expiresAt
  }));
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

export async function updateCoupon(id, coupon) {
  const res = await fetch(`${API_BASE}/coupons/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(coupon)
  });
  if (!res.ok) throw new Error('Failed to update coupon');
  return res.json();
}

export async function deleteCoupon(id) {
  const res = await fetch(`${API_BASE}/coupons/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete coupon');
  return res.json();
}

// Brands API
export async function fetchBrands() {
  const res = await fetch(`${API_BASE}/brands?_t=${Date.now()}`);
  if (!res.ok) throw new Error('Failed to fetch brands');
  const brands = await res.json();
  return brands.map(b => ({
    id: b.BrandID || b.id,
    name: b.Name || b.name
  }));
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

export async function updateBrand(id, brand) {
  const res = await fetch(`${API_BASE}/brands/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(brand)
  });
  if (!res.ok) throw new Error('Failed to update brand');
  return res.json();
}

export async function deleteBrand(id) {
  const res = await fetch(`${API_BASE}/brands/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete brand');
  return res.json();
}

// Categories API
export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/categories?_t=${Date.now()}`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  const categories = await res.json();
  return categories.map(c => ({
    id: c.CategoryID || c.id,
    name: c.Name || c.name,
    icon: c.Icon || c.icon
  }));
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

export async function updateCategory(id, category) {
  const res = await fetch(`${API_BASE}/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category)
  });
  if (!res.ok) throw new Error('Failed to update category');
  return res.json();
}

export async function deleteCategory(id) {
  const res = await fetch(`${API_BASE}/categories/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete category');
  return res.json();
}

// Inventory API
export async function fetchInventory() {
  // For now, use products endpoint and map to inventory structure
  const res = await fetch(`${API_BASE}/products?_t=${Date.now()}`);
  if (!res.ok) throw new Error('Failed to fetch inventory');
  const products = await res.json();
  // Assume each product has id, name, and stock fields
  return products.map(p => ({
    id: p.ProductID || p.id,
    product: p.Name || p.name,
    stock: p.Stock || p.stock || 0
  }));
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

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export async function fetchOrders() {
  const res = await fetch(`${API_BASE}/orders?_t=${Date.now()}`);
  if (!res.ok) throw new Error('Failed to fetch orders');
  const orders = await res.json();
  return orders.map(o => ({
    id: o.OrderID || o.id,
    userId: o.UserID || o.userId,
    total: o.Total || o.total,
    status: o.Status || o.status,
    shippingAddress: o.ShippingAddress || o.shippingAddress,
    createdAt: o.CreatedAt || o.createdAt
  }));
}

export async function fetchOrderItems(orderId) {
  const res = await fetch(`${API_BASE}/orders/${orderId}?_t=${Date.now()}`);
  if (!res.ok) throw new Error('Failed to fetch order items');
  const items = await res.json();
  return items.map(i => ({
    orderItemId: i.OrderItemID || i.orderItemId,
    productId: i.ProductID || i.productId,
    name: i.Name || i.name,
    quantity: i.Quantity || i.quantity,
    price: i.Price || i.price
  }));
}

export async function createOrder(order) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create order');
  }
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

// Products API
export async function fetchProducts() {
  const res = await fetch(`${API_BASE}/products?_t=${Date.now()}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  const products = await res.json();
  return products.map(p => ({
    id: p.ProductID || p.id,
    name: p.Name || p.name,
    description: p.Description || p.description,
    price: p.Price || p.price,
    categoryId: p.CategoryID || p.categoryId,
    brandId: p.BrandID || p.brandId,
    stock: p.Stock || p.stock || 0,
    imageUrl: p.ImageUrl || p.imageUrl
  }));
}

export async function createProduct(product) {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  });
  if (!res.ok) throw new Error('Failed to create product');
  return res.json();
}

export async function updateProduct(id, product) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  });
  if (!res.ok) throw new Error('Failed to update product');
  return res.json();
}

export async function deleteProduct(id) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete product');
  return res.json();
}

// Users API
export async function fetchUsers() {
  const res = await fetch(`${API_BASE}/users?_t=${Date.now()}`);
  if (!res.ok) throw new Error('Failed to fetch users');
  const users = await res.json();
  return users.map(u => ({
    id: u.UserID || u.id,
    username: u.Username || u.username,
    email: u.Email || u.email,
    roleId: u.RoleID || u.roleId,
    createdAt: u.CreatedAt || u.createdAt
  }));
}

export async function createUser(user) {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to create user');
  }
  return res.json();
}

export async function updateUser(id, user) {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to update user');
  }
  return res.json();
}

export async function deleteUser(id) {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to delete user');
  }
  return res.json();
}

export async function fetchReports(type = 'overview', filters = {}) {
  const params = new URLSearchParams();
  if (filters.categoryId) params.append('categoryId', filters.categoryId);
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);

  const queryString = params.toString() ? `?${params.toString()}&_t=${Date.now()}` : `?_t=${Date.now()}`;
  const res = await fetch(`${API_BASE}/reports/${type}${queryString}`);

  if (!res.ok) throw new Error('Failed to fetch reports');
  return res.json();
}
