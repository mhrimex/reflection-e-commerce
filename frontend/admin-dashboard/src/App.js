
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
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
import Login from './pages/Login';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  if (location.pathname === '/login') return null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Products', path: '/products', icon: '📦' },
    { name: 'Orders', path: '/orders', icon: '🛒' },
    { name: 'Users', path: '/users', icon: '👥' },
    { name: 'Categories', path: '/categories', icon: '🏷️' },
    { name: 'Brands', path: '/brands', icon: '✨' },
    { name: 'Inventory', path: '/inventory', icon: '📋' },
    { name: 'Images', path: '/images', icon: '🖼️' },
    { name: 'Coupons', path: '/coupons', icon: '🎟️' },
    { name: 'Reports', path: '/reports', icon: '📈' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen fixed shadow-2xl flex flex-col font-sans border-r border-slate-800">
      <div className="flex items-center gap-3 px-6 py-8 border-b border-slate-800 bg-slate-900">
        <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/30">
          <span className="text-xl">⚡</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">Admin CMS</h2>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Control Panel</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-700">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-all duration-200 group relative ${location.pathname === item.path ? 'bg-slate-800 text-white' : ''}`}
          >
            <span className="text-lg group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500"></div>
          <div>
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-slate-500">Super Admin</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-rose-600 hover:bg-rose-700 text-white px-4 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl active:scale-95"
        >
          <span>🚪</span>
          <span>Sign Out</span>
        </button>
        <p className="text-xs text-slate-600 text-center mt-4">&copy; {new Date().getFullYear()} E-Commerce CMS</p>
      </div>
    </aside>
  );
}

function MainContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className={`${isLoginPage ? 'ml-0' : 'ml-64'} min-h-screen bg-slate-50`}>
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
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Sidebar />
      <MainContent />
    </Router>
  );
}

export default App;
