
// Reports.js - View reports in the admin dashboard
export default function Reports() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Reports</h1>
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-700">Download sales, inventory, and user reports here.</p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mt-4">Download Report</button>
      </div>
    </main>
  );
}