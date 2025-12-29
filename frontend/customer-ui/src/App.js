

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



// Navbar component for site-wide navigation, styled with Tailwind CSS

function Navbar() {
  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between">
        {/* Logo/Brand */}
        <Link to="/" className="text-2xl font-bold text-blue-600 tracking-tight hover:scale-105 transition-transform">E-Shop</Link>
        {/* Navigation links */}
        <div className="hidden md:flex flex-wrap gap-4 text-gray-700 text-base font-medium items-center">
          <Link to="/products" className="hover:text-blue-600 transition">Products</Link>
          <Link to="/categories" className="hover:text-blue-600 transition">Categories</Link>
          <Link to="/cart" className="hover:text-blue-600 transition">Cart</Link>
          <Link to="/wishlist" className="hover:text-blue-600 transition">Wishlist</Link>
          <Link to="/profile" className="hover:text-blue-600 transition">Profile</Link>
          <Link to="/order-history" className="hover:text-blue-600 transition">Orders</Link>
          <Link to="/contact" className="hover:text-blue-600 transition">Contact</Link>
          <Link to="/about" className="hover:text-blue-600 transition">About</Link>
          <DarkModeToggle />
        </div>
        {/* Mobile cart button and dark mode toggle */}
        <div className="md:hidden flex gap-2 items-center">
          <Link to="/cart" className="relative group">
            <span className="inline-block bg-blue-600 text-white rounded-full p-2 shadow hover:bg-blue-700 transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437m0 0L7.5 15.75A2.25 2.25 0 009.664 18h4.672a2.25 2.25 0 002.164-2.25l1.344-10.477m-12.75 0h12.75" />
              </svg>
            </span>
          </Link>
          <DarkModeToggle />
        </div>
      </nav>
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


