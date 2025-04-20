// src/pages/OrderTracking.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../services/api';
import axios from 'axios';

function OrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState(id || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(!!id);

  // Fetch order if ID is provided in URL
  useEffect(() => {
    if (id) {
      fetchOrder(id);
    }
  }, [id]);

  const fetchOrder = async (orderIdToFetch) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("https://fresh-bulk.onrender.com/api/orders/" + orderIdToFetch);
      setOrder(response.data);
      setSearched(true);
    } catch (err) {
      setError('Order not found. Please check your Order ID and try again.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!orderId.trim()) {
      setError('Please enter an Order ID');
      return;
    }
    fetchOrder(orderId);
  };

  // Status mapping for display with colors
  const statusStyles = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Processing': 'bg-blue-100 text-blue-800',
    'In Transit': 'bg-purple-100 text-purple-800',
    'Delivered': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800'
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Track Your Order</h1>
      
      {/* Order ID Search Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Enter your Order ID"
            className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Track Order'}
          </button>
        </form>
        
        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>
      
      {/* Order Details */}
      {searched && order && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Order #{order.id}</h2>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusStyles[order.status] || 'bg-gray-100 text-gray-800'}`}>
              {order.status}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Order Information</h3>
              <ul className="space-y-2 text-gray-600">
                <li><span className="font-medium">Order Date:</span> {formatDate(order.createdAt)}</li>
                <li><span className="font-medium">Delivery Date:</span> {formatDate(order.deliveryDate)}</li>
                <li><span className="font-medium">Total Amount:</span> ${order.totalAmount?.toFixed(2) || '0.00'}</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Delivery Information</h3>
              <ul className="space-y-2 text-gray-600">
                <li><span className="font-medium">Recipient:</span> {order.buyer_name}</li>
                <li><span className="font-medium">Address:</span> {order.delivery_address}</li>
                <li><span className="font-medium">Contact:</span> {order.buyer_contact}</li>
              </ul>
            </div>
          </div>
          
          {/* Order Items */}
          <h3 className="text-lg font-medium text-gray-800 mb-4">Ordered Items</h3>
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {JSON.parse(order.items)?.map((item) => (
                  <tr key={item.productId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${item.price?.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${item.total?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Order Progress */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Order Progress</h3>
            <div className="relative">
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200"></div>
              <div className="relative flex justify-between">
                {['Pending', 'Processing', 'In Transit', 'Delivered'].map((status, index) => {
                  const isCompleted = ['Pending', 'Processing', 'In Transit', 'Delivered'].indexOf(order.status) >= index;
                  return (
                    <div key={status} className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${isCompleted ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                        {index + 1}
                      </div>
                      <div className="text-sm font-medium mt-2">{status}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Return to home button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => navigate('/')}
              className="text-green-600 hover:text-green-800 font-medium flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Return to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderTracking;