// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/api';
import ProductCard from '../components/buyer/ProductCard';
import axios from 'axios';

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://fresh-bulk.onrender.com/api/products");
        // For featured products, we'll just take the first 4 items
        // In a real app, you might have a 'featured' flag in your product data
        setFeaturedProducts(response.data.slice(0, 4));
      } catch (err) {
        setError('Failed to load featured products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-green-600 text-white py-16 rounded-lg mb-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Fresh Produce at Wholesale Prices
            </h1>
            <p className="text-lg md:text-xl mb-6">
              Quality vegetables and fruits delivered directly from farms to your business.
              Place bulk orders and save time and money.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Link 
                to="/products" 
                className="bg-white text-green-600 hover:bg-gray-100 py-3 px-6 rounded-lg font-medium text-center"
              >
                Browse Products
              </Link>
              <Link 
                to="/track-order" 
                className="bg-green-700 hover:bg-green-800 text-white py-3 px-6 rounded-lg font-medium text-center"
              >
                Track Your Order
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <img 
              src="data:image/jpeg;base64,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" 
              alt="Fresh Produce" 
              className="rounded-lg shadow-xl mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mb-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Featured Products</h2>
            <Link to="/products" className="text-green-600 hover:text-green-800 font-medium">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-6">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-100 py-12 rounded-lg mb-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse & Order</h3>
              <p className="text-gray-600">
                Browse our selection of fresh produce, add items to your cart, and place your bulk order.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">We Process</h3>
              <p className="text-gray-600">
                We carefully select and package your order to ensure freshness and quality.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                We deliver your fresh produce directly to your business on your selected delivery date.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mb-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  <span className="text-xl font-semibold text-gray-700">JR</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">John Rodriguez</h3>
                  <p className="text-gray-600">Restaurant Owner</p>
                </div>
              </div>
              <p className="text-gray-700">
                "FreshBulk has simplified our ordering process. The quality of produce is exceptional, and delivery is always on time. Highly recommend their service!"
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  <span className="text-xl font-semibold text-gray-700">SP</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Sarah Parker</h3>
                  <p className="text-gray-600">Grocery Store Manager</p>
                </div>
              </div>
              <p className="text-gray-700">
                "Since switching to FreshBulk, we've seen a significant improvement in the freshness of our produce section. Our customers have noticed the difference!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 text-white py-12 rounded-lg">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Order Fresh Produce?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Join hundreds of businesses that trust FreshBulk for their fresh produce needs.
          </p>
          <Link 
            to="/register" 
            className="bg-white text-green-600 hover:bg-gray-100 py-3 px-8 rounded-lg font-medium inline-block"
          >
            Create an Account
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;