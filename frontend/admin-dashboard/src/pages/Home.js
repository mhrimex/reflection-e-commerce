// Home.js - Admin dashboard landing page
// Shows quick stats and links to main sections
export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Welcome to the Admin Dashboard</h1>
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
