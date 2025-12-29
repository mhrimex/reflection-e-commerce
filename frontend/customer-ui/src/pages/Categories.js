

// Categories.js - Displays all product categories
// Uses mock categories for demonstration
const categories = [
  { id: 1, name: 'Electronics', icon: '💻' },
  { id: 2, name: 'Wearables', icon: '⌚' },
  { id: 3, name: 'Audio', icon: '🎧' },
  { id: 4, name: 'Fitness', icon: '🏋️' },
  { id: 5, name: 'Accessories', icon: '🖱️' },
];

export default function Categories() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">Categories</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {categories.map(cat => (
          <div key={cat.id} className="card flex flex-col items-center py-8 transition-transform hover:-translate-y-1 hover:shadow-xl">
            <span className="text-5xl mb-4">{cat.icon}</span>
            <h2 className="font-semibold text-lg text-gray-900">{cat.name}</h2>
          </div>
        ))}
      </div>
    </main>
  );
}