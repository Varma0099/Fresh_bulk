// src/components/common/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">FreshBulk</h3>
            <p className="text-gray-300">
              Your trusted partner for fresh vegetable and fruit bulk orders.
              Quality guaranteed, direct from farms to your business.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link to="/products" className="text-gray-300 hover:text-white">Products</Link></li>
              <li><Link to="/track-order" className="text-gray-300 hover:text-white">Track Order</Link></li>
              <li><Link to="/login" className="text-gray-300 hover:text-white">Login</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="text-gray-300 not-italic">
              <p>Bhimavaram, AP</p>
              <p>Email: krishnasrivarma@freshbulk.com</p>
              <p>Phone: 9494343299</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} FreshBulk. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;