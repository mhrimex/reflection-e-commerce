

// Contact.js - Contact form for users
// Simple contact form for demonstration
import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="max-w-xl mx-auto px-4 py-12 min-h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h1 className="text-2xl font-bold mb-4 text-green-600">Message Sent!</h1>
          <p className="text-gray-700 mb-4">Thank you for contacting us. We'll get back to you soon.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-12 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">Contact Us</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 flex flex-col gap-6">
        <div>
          <label className="block font-semibold mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
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
          <label className="block font-semibold mb-1">Message</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button type="submit" className="btn w-full mt-4">Send Message</button>
      </form>
    </main>
  );
}