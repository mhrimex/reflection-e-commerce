

// Register.js - User registration form
// Simple registration form for demonstration

import { useState } from 'react';
import { register } from '../api';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);


  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      await register(form);
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    }
  }

  if (submitted) {
    return (
      <main className="max-w-md mx-auto px-4 py-12 min-h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h1 className="text-2xl font-bold mb-4 text-green-600">Registration Successful!</h1>
          <p className="text-gray-700 mb-4">Your account has been created.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto px-4 py-12 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">Register</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 flex flex-col gap-6">
        {error && <div className="text-red-600 text-center mb-2">{error}</div>}
        <div>
          <label className="block font-semibold mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button type="submit" className="btn w-full mt-4">Register</button>
      </form>
    </main>
  );
}