
// Images.js - Manage product images in the admin dashboard
export default function Images() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Product Images Upload</h1>
      <div className="bg-white rounded-lg shadow p-8 flex flex-col items-center">
        <input type="file" className="mb-4" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Upload</button>
      </div>
    </main>
  );
}