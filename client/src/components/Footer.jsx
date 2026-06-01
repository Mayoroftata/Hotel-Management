// components/Footer.js
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';

export default function Footer() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      message: formData.message.trim(),
    };
    
    // Basic validation
    if (!payload.name || !payload.email || !payload.message) {
      toast.error('Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      
      if (response.ok) {
        toast.success(result.message || 'Feedback sent successfully. We\'ll get back to you soon.');
        // Reset form after successful submission
        setFormData({ name: '', email: '', message: '' });
      } else {
        toast.error(result.error || 'Failed to send feedback. Please try again later.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Could not send feedback. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-white text-blue-900 py-8 border-t border-gray-200">
      <div className="container mx-auto px-4 md:flex md:items-start md:justify-between">
        {/* Left Section */}
        <div className="mb-6 md:mb-0 md:w-1/3">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">DEELUCK</h2>
          <div className="flex space-x-4 mb-4">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-900 hover:text-yellow-500 transition-colors"
              aria-label="Facebook"
            >
              <i className="fab fa-facebook-f text-xl"></i>
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-900 hover:text-yellow-500 transition-colors"
              aria-label="Twitter"
            >
              <i className="fab fa-twitter text-xl"></i>
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-900 hover:text-yellow-500 transition-colors"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram text-xl"></i>
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-900 hover:text-yellow-500 transition-colors"
              aria-label="LinkedIn"
            >
              <i className="fab fa-linkedin-in text-xl"></i>
            </a>
          </div>
          <div className="space-y-1 text-sm">
            <p>
              <strong>Support:</strong> +234 80 227 00 482
            </p>
            <p>
              <strong>Email:</strong> <a href="mailto:deeluck@gmail.com" className="hover:text-yellow-500">deeluck@gmail.com</a>
            </p>
            <p>
              <strong>Address:</strong> Your Hotel Address Here
            </p>
          </div>
        </div>

        {/* Middle Section - Quick Links */}
        <div className="mb-6 md:mb-0 md:w-1/3">
          <h3 className="text-lg font-bold mb-4">Quick Links</h3>
          <nav className="space-y-2">
            <Link href="/rooms" className="block text-blue-900 hover:text-yellow-500 transition-colors">
              ROOMS & SUITES
            </Link>
            <Link href="/events" className="block text-blue-900 hover:text-yellow-500 transition-colors">
              MEETINGS & EVENTS
            </Link>
            <Link href="/dining" className="block text-blue-900 hover:text-yellow-500 transition-colors">
              DINING
            </Link>
            <Link href="/recreation" className="block text-blue-900 hover:text-yellow-500 transition-colors">
              RECREATION CENTER
            </Link>
            <Link href="/support" className="block text-blue-900 hover:text-yellow-500 transition-colors">
              SUPPORT
            </Link>
            <Link href="/blog" className="block text-blue-900 hover:text-yellow-500 transition-colors">
              BLOG
            </Link>
          </nav>
        </div>

        {/* Right Section - Feedback Form */}
        <div className="md:w-1/3">
          <h3 className="text-lg font-bold mb-4">Send Feedback</h3>
          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent text-gray-900"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent text-gray-900"
              required
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Share your feedback or question"
              rows="3"
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent text-gray-900"
              required
            ></textarea>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send Feedback'}
            </button>
          </form>
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-600">
          Thank you for choosing DEELUCK, your Home Away from Home. Happy Staying!
        </p>
        <p className="text-xs text-gray-500 mt-2">
          © {new Date().getFullYear()} DEELUCK Hotel. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
