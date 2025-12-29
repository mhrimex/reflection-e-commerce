
// Banner.js - Main banner/hero section for homepage
// This component is reusable and can be customized for any landing page
export default function Banner() {
  return (
    // Banner wrapper with gradient background and padding
    <div className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-12 px-4 rounded-lg shadow-lg mb-8 flex flex-col items-center">
      {/* Main headline */}
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
        Welcome to Your E-Commerce Store
      </h1>
      {/* Subheadline/description */}
      <p className="text-lg md:text-xl mb-6 text-center max-w-2xl">
        Discover the best products, enjoy fast delivery, and experience a seamless shopping journey. Start exploring now!
      </p>
      {/* Call to action button */}
      <a
        href="/products"
        className="bg-white text-blue-600 font-semibold px-6 py-3 rounded shadow hover:bg-blue-100 transition"
      >
        Shop Now
      </a>
    </div>
  );
}
