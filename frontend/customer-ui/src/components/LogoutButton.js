// LogoutButton.js - Simple logout button for customer UI
export default function LogoutButton({ onLogout }) {
  function handleLogout() {
    localStorage.removeItem('token');
    if (onLogout) onLogout();
    window.location.href = '/login';
  }
  return (
    <button onClick={handleLogout} className="btn bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
      Logout
    </button>
  );
}
