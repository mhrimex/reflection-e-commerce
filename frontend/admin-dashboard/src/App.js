import { useState, useEffect } from 'react';
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

function Sidebar({ isOpen, toggle }) {
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
    <>
      {/* Mobile Overlay */}
      {!isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[40] lg:hidden"
          onClick={toggle}
        ></div>
      )}
      <aside className={`w-64 bg-slate-900 text-slate-300 min-h-screen fixed shadow-2xl flex flex-col font-sans border-r border-slate-800 z-[50] transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between gap-3 px-6 py-8 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/30">
              <span className="text-xl">⚡</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">Admin CMS</h2>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Control Panel</p>
            </div>
          </div>
          <button onClick={toggle} className="lg:hidden text-slate-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-700">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => { if (window.innerWidth < 1024) toggle(); }}
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
    </>
  );
}

function MainContent({ isSidebarOpen, toggleSidebar }) {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className={`${isLoginPage ? 'ml-0' : (isSidebarOpen ? 'ml-0 lg:ml-64' : 'ml-0')} min-h-screen bg-slate-50 transition-all duration-300 ease-in-out`}>
      {!isLoginPage && (
        <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 z-[30] flex items-center px-4 lg:hidden">
          <button onClick={toggleSidebar} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <span className="ml-4 font-bold text-slate-900 uppercase tracking-widest text-xs">Admin Panel</span>
        </header>
      )}
      <div className={`${isLoginPage ? '' : 'pt-16 lg:pt-0'} p-4 md:p-8`}>
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
    </div>
  );
}

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Close sidebar on small screens initially
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <Router>
      <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
      <MainContent isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </Router>
  );
}

export default App;
