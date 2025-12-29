
// Profile.js - User profile page

import { useEffect, useState } from 'react';
import LogoutButton from '../components/LogoutButton';
import { fetchUser } from '../api';

function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetchUser(token)
      .then(res => setUser(res.user))
      .catch(() => {
        setError('Failed to load user info.');
        localStorage.removeItem('token');
        window.location.href = '/login';
      });
  }, []);
  if (!user) {
    return <div className="text-center py-12">Loading profile...</div>;
  }
  return (
    <main className="max-w-xl mx-auto px-4 py-12 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">Profile</h1>
      <div className="bg-white rounded-lg shadow p-8">
        <div className="mb-6">
          <label className="block font-semibold mb-1">Name</label>
          <input type="text" value={user.Username || ''} readOnly className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100" />
        </div>
        <div className="mb-6">
          <label className="block font-semibold mb-1">Email</label>
          <input type="email" value={user.Email || ''} readOnly className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100" />
        </div>
        <div className="mb-6">
          <label className="block font-semibold mb-1">Role</label>
          <input type="text" value={user.RoleID || ''} readOnly className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100" />
        </div>
        <button className="btn w-full mt-4">Edit Profile</button>
        <div className="mt-6 flex justify-center">
          <LogoutButton />
        </div>
      </div>
    </main>
  );
}

export default Profile;