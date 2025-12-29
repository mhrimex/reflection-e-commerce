

// About.js - About the store/company
// Simple about page for demonstration
export default function About() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">About Us</h1>
      <div className="bg-white rounded-lg shadow p-8">
        <p className="text-lg text-gray-700 mb-4">
          Welcome to <span className="font-bold text-blue-600">E-Shop</span>! We are passionate about bringing you the best tech gadgets and accessories at unbeatable prices. Our mission is to make online shopping easy, fast, and enjoyable for everyone.
        </p>
        <p className="text-gray-600 mb-2">
          <span className="font-semibold">Our Story:</span> Founded in 2025, E-Shop has quickly grown to become a trusted destination for quality electronics and customer service.
        </p>
        <p className="text-gray-600 mb-2">
          <span className="font-semibold">Our Team:</span> We are a small, dedicated team of tech enthusiasts who love helping customers find the perfect products.
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">Contact:</span> For any questions, visit our <a href="/contact" className="text-blue-600 hover:underline">Contact</a> page.
        </p>
      </div>
    </main>
  );
}