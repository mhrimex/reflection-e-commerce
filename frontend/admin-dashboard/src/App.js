
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// Only import components that are used in routes below

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Users from './pages/Users';
import Categories from './pages/Categories';
import Brands from './pages/Brands';
import Inventory from './pages/Inventory';
import Images from './pages/Images';
import Coupons from './pages/Coupons';
import Reports from './pages/Reports';


// Sidebar component with Tailwind styling and Home link
function Sidebar() {
  return (
    <aside className="w-60 bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen p-6 fixed shadow-lg flex flex-col">
      {/* Logo/Header */}
      <div className="flex items-center gap-2 mb-10">
        <span className="text-3xl font-extrabold text-blue-400">🛒</span>
        <h2 className="text-2xl font-bold text-blue-400 tracking-wide">Admin CMS</h2>
      </div>
      {/* Navigation Links */}
      <nav className="flex flex-col gap-3 text-lg font-medium">
        <Link to="/" className="hover:bg-gray-700 px-4 py-2 rounded transition">Home</Link>
        <Link to="/dashboard" className="hover:bg-gray-700 px-4 py-2 rounded transition">Dashboard</Link>
        <Link to="/products" className="hover:bg-gray-700 px-4 py-2 rounded transition">Products</Link>
        <Link to="/categories" className="hover:bg-gray-700 px-4 py-2 rounded transition">Categories</Link>
        <Link to="/brands" className="hover:bg-gray-700 px-4 py-2 rounded transition">Brands</Link>
        <Link to="/orders" className="hover:bg-gray-700 px-4 py-2 rounded transition">Orders</Link>
        <Link to="/users" className="hover:bg-gray-700 px-4 py-2 rounded transition">Users</Link>
        <Link to="/inventory" className="hover:bg-gray-700 px-4 py-2 rounded transition">Inventory</Link>
        <Link to="/images" className="hover:bg-gray-700 px-4 py-2 rounded transition">Images</Link>
        <Link to="/coupons" className="hover:bg-gray-700 px-4 py-2 rounded transition">Coupons</Link>
        <Link to="/reports" className="hover:bg-gray-700 px-4 py-2 rounded transition">Reports</Link>
      </nav>
      {/* Footer */}
      <div className="mt-auto pt-8 text-xs text-gray-400">&copy; {new Date().getFullYear()} E-Commerce CMS</div>
    </aside>
  );
}

// App layout with sidebar and main content, styled with Tailwind
function App() {
  return (
    <Router>
      {/* Sidebar stays fixed on the left */}
      <Sidebar />
      {/* Main content area with left margin for sidebar */}
      <div className="ml-60 min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/users" element={<Users />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/images" element={<Images />} />
          <Route path="/coupons" element={<Coupons />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </div>
    </Router>
  );
}

// Export the main App component
export default App;
