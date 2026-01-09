

// App.js - Main entry point for the customer UI
// Handles routing and navigation for all main pages
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import DarkModeToggle from './components/DarkModeToggle';
import { ToastProvider } from './components/ToastProvider';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Categories from './pages/Categories';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import OrderHistory from './pages/OrderHistory';
import Wishlist from './pages/Wishlist';
import Contact from './pages/Contact';
import About from './pages/About';



import { useState } from 'react';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo/Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-1.5 rounded-lg shadow-sm group-hover:shadow-md transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72l1.189-1.19A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
            </svg>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Reflection E-Commerce</span>
        </Link>

        {/* Navigation links - Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6 text-sm font-medium text-slate-600">
            <Link to="/products" className="hover:text-blue-600 transition-colors">Products</Link>
            <Link to="/categories" className="hover:text-blue-600 transition-colors">Categories</Link>
            <Link to="/about" className="hover:text-blue-600 transition-colors">About</Link>
            <Link to="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
          </div>

          <div className="flex items-center gap-4 pl-8 border-l border-slate-200">
            <Link to="/wishlist" className="p-2 text-slate-400 hover:text-red-500 transition-colors">
              <span className="sr-only">Wishlist</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </Link>

            <Link to="/cart" className="relative group p-2 text-slate-400 hover:text-blue-600 transition-colors">
              <span className="sr-only">Cart</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 5c.07.286.074.58.074.876 0 2.409-1.855 4.373-4.246 4.373H9.813c-2.391 0-4.246-1.964-4.246-4.373 0-.296.004-.59.074-.876l1.263-5c.236-.94-.035-2.016-.948-2.674a2.98 2.98 0 01-1.32-2.386C4.444 3.298 5.6 2.5 7.009 2.5H16.99c1.409 0 2.565.798 2.656 1.945a2.98 2.98 0 01-1.32 2.386c-.913.658-1.184 1.734-.948 2.674z" />
              </svg>
              <span className="absolute top-0 right-0 h-4 w-4 bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full ring-2 ring-white">2</span>
            </Link>

            <Link to="/profile" className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M10 2a4 4 0 100 8 4 4 0 000-8zm-6.5 15a.5.5 0 01.5-.5h12a.5.5 0 01.5.5v.5a.5.5 0 01-.5.5H4a.5.5 0 01-.5-.5v-.5z" clipRule="evenodd" />
                </svg>
              </div>
            </Link>

            {/* <DarkModeToggle /> */}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <Link to="/cart" className="relative text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437m0 0L7.5 15.75A2.25 2.25 0 009.664 18h4.672a2.25 2.25 0 002.164-2.25l1.344-10.477m-12.75 0h12.75" />
            </svg>
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border border-white"></span>
          </Link>
          <button
            className="text-slate-600 p-2 hover:bg-slate-100 rounded-xl transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white animate-in slide-in-from-top duration-300">
          <div className="px-4 py-6 space-y-4">
            <Link to="/products" className="block text-lg font-bold text-slate-900" onClick={() => setIsMenuOpen(false)}>Products</Link>
            <Link to="/categories" className="block text-lg font-bold text-slate-900" onClick={() => setIsMenuOpen(false)}>Categories</Link>
            <Link to="/about" className="block text-lg font-bold text-slate-900" onClick={() => setIsMenuOpen(false)}>About</Link>
            <Link to="/contact" className="block text-lg font-bold text-slate-900" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            <div className="pt-4 border-t border-slate-50 flex items-center gap-4">
              <Link to="/profile" className="flex items-center gap-3 text-slate-600 font-bold" onClick={() => setIsMenuOpen(false)}>
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">👤</div>
                Profile
              </Link>
              <Link to="/wishlist" className="flex items-center gap-3 text-slate-600 font-bold" onClick={() => setIsMenuOpen(false)}>
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">❤️</div>
                Wishlist
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default App;


// App component wraps the whole site with Router and Navbar
function App() {
  return (
    <ToastProvider>
      <Router>
        {/* Navbar is always visible */}
        <Navbar />
        {/* Define all routes for the app */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}


