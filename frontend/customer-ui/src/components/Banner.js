
// Banner.js - Main banner/hero section for homepage
// This component is reusable and can be customized for any landing page
// Banner.js - Modern Hero Section
export default function Banner() {
  return (
    <div className="relative w-full bg-slate-900 overflow-hidden isolate">
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] opacity-20" />
      <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl lg:max-w-none flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 sm:text-6xl mb-6">
            Discover Exceptional Style
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl">
            Experience the future of shopping with our curated collection of premium products.
            Fast delivery, secure payments, and 24/7 support at your fingertips.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <a href="/products" className="rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all hover:scale-105">
              Shop Now
            </a>
            <a href="/about" className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors">
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
