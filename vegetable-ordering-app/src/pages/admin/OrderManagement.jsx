// src/pages/admin/OrderManagement.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OrdersList from '../../components/admin/OrdersList';
import api from '../../services/api';

const OrderManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch specific order if ID is provided
  useEffect(() => {
    if (id) {
      fetchOrderDetails(id);
    }
  }, [id]);

  const fetchOrderDetails = async (orderId) => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/${orderId}`);
      setSelectedOrder(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('Failed to fetch order details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      await api.put(`/orders/${selectedOrder.id}`, { status: newStatus });
      setSelectedOrder(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status. Please try again.');
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // If an order ID is provided, show order details
  if (id) {
    if (loading) {
      return <div className="flex justify-center py-8"><div className="loader"></div></div>;
    }

    if (error) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
          <button 
            onClick={() => navigate('/admin/orders')}
            className="ml-4 underline"
          >
            Back to Orders
          </button>
        </div>
      );
    }

    if (!selectedOrder) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">Order not found</p>
          <button 
            onClick={() => navigate('/admin/orders')}
            className="mt-4 text-blue-600 hover:text-blue-800 underline"
          >
            Back to Orders
          </button>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Order Details</h1>
          <button 
            onClick={() => navigate('/admin/orders')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded"
          >
            Back to Orders
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">Order #{selectedOrder.id}</h2>
                <p className="text-gray-500">Placed on {formatDate(selectedOrder.created_at)}</p>
              </div>
              <div>
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusClass(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Customer Information</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <p><strong>Name:</strong> {selectedOrder.buyer_name}</p>
                  <p><strong>Email:</strong> {selectedOrder.buyer_email}</p>
                  <p><strong>Phone:</strong> {selectedOrder.buyer_contact}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Delivery Information</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <p><strong>Address:</strong> {selectedOrder.delivery_address}</p>
                  <p><strong>Delivery Date:</strong> {new Date(selectedOrder.delivery_date).toLocaleDateString()}</p>
                  {selectedOrder.notes && <p><strong>Notes:</strong> {selectedOrder.notes}</p>}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Order Items</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {item.image && (
                              <img src={item.image} alt={item.name} className="h-10 w-10 rounded-full mr-3" />
                            )}
                            <div>
                              <div className="font-medium">{item.name}</div>
                              {item.product_id && <div className="text-xs text-gray-500">ID: {item.product_id}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">${parseFloat(item.price).toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">${(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-right font-medium">Total:</td>
                      <td className="px-6 py-4 font-bold">${parseFloat(selectedOrder.total_price).toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium mb-4">Update Order Status</h3>
              <div className="flex items-center">
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleUpdateStatus(e.target.value)}
                  className="mr-4 border rounded px-4 py-2"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="in progress">In Progress</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.status)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If no order ID is provided, show the orders list
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Order Management</h1>
      <OrdersList />
    </div>
  );
};

export default OrderManagement;