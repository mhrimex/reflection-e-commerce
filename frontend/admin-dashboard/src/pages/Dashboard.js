
// Dashboard.js - Admin dashboard overview
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export default function Dashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    try {
      const decoded = jwtDecode(token);
      // Assuming admin role is RoleID === 1
      if (decoded.roleId === 1) {
        setIsAdmin(true);
      } else {
        window.location.href = '/login';
      }
    } catch {
      window.location.href = '/login';
    }
  }, []);
  if (!isAdmin) return null;
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="bg-blue-100 rounded-lg p-6 text-center shadow">
          <div className="text-4xl font-bold text-blue-600 mb-2">120</div>
          <div className="text-gray-700">Products</div>
        </div>
        <div className="bg-green-100 rounded-lg p-6 text-center shadow">
          <div className="text-4xl font-bold text-green-600 mb-2">45</div>
          <div className="text-gray-700">Orders</div>
        </div>
        <div className="bg-yellow-100 rounded-lg p-6 text-center shadow">
          <div className="text-4xl font-bold text-yellow-600 mb-2">8</div>
          <div className="text-gray-700">Users</div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Quick Links</h2>
        <ul className="flex flex-wrap gap-4">
          <li><a href="/products" className="text-blue-600 hover:underline">Manage Products</a></li>
          <li><a href="/orders" className="text-blue-600 hover:underline">View Orders</a></li>
          <li><a href="/users" className="text-blue-600 hover:underline">User Accounts</a></li>
          <li><a href="/reports" className="text-blue-600 hover:underline">Reports</a></li>
        </ul>
      </div>
    </main>
  );
}