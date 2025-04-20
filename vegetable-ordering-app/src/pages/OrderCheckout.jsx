// src/pages/OrderCheckout.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';
import { useForm } from 'react-hook-form';
import axios from 'axios';

function OrderCheckout() {
  const { cart, items, total, clearCart, updateQuantity, removeFromCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      buyerName: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      address: currentUser?.address || '',
      city: currentUser?.city || '',
      state: currentUser?.state || '',
      zipCode: currentUser?.zipCode || '',
      deliveryDate: '',
      deliveryInstructions: '',
    }
  });
  
  // If cart is empty, redirect to products
  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-6">Add some products before proceeding to checkout.</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 transition-colors"
        >
          Browse Products
        </button>
      </div>
    );
  }
  
  // If order was successfully placed
  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your order. We've received your order and will process it shortly.
          </p>
          <p className="text-lg font-medium mb-6">
            Your Order ID: <span className="text-green-600">{orderId}</span>
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => navigate(`/track-order/${orderId}`)}
              className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 transition-colors"
            >
              Track Your Order
            </button>
            <button
              onClick={() => navigate('/products')}
              className="bg-gray-600 text-white py-2 px-6 rounded hover:bg-gray-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      const orderData = {
        ...data,
        items: items.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity
        })),
        totalAmount: total,
        status: 'Pending'
      };
      
      const response = await axios.post("https://fresh-bulk.onrender.com/api/orders",{buyer_name: data.buyerName, buyer_contact:data.email,delivery_address:data.address,items:JSON.stringify(orderData.items),status:"Pending"});   
      setOrderId(response.data.id);
      setOrderSuccess(true);
      clearCart();
    } catch (err) {
      setSubmitError('Failed to place your order. Please try again or contact support.');
      console.error('Error placing order:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
            
            <div className="border-b pb-4 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex py-2">
                  <div className="flex-grow">
                    <h3 className="font-medium">{item.name}</h3>
                    <div className="flex items-center mt-1">
                      <div className="flex items-center border rounded mr-2">
                        <button 
                          onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-sm hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="px-2">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-sm hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm text-gray-500">
                        @ ${item.price.toFixed(2)}/{item.unit}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm text-red-600 hover:text-red-800 mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center font-medium">
              <span>Total:</span>
              <span className="text-xl">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        {/* Order Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Delivery Information</h2>
            
            {submitError && (
              <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {submitError}
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="buyerName" className="block text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    id="buyerName"
                    className={`w-full p-2 border rounded ${errors.buyerName ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="John Doe"
                    {...register('buyerName', { required: 'Name is required' })}
                  />
                  {errors.buyerName && (
                    <p className="text-red-500 text-sm mt-1">{errors.buyerName.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    id="email"
                    className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="john@example.com"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  className={`w-full p-2 border rounded ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="(123) 456-7890"
                  {...register('phone', { required: 'Phone number is required' })}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="address" className="block text-gray-700 mb-1">Delivery Address *</label>
                <input
                  type="text"
                  id="address"
                  className={`w-full p-2 border rounded ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="123 Main St"
                  {...register('address', { required: 'Address is required' })}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="city" className="block text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    id="city"
                    className={`w-full p-2 border rounded ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="New York"
                    {...register('city', { required: 'City is required' })}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="state" className="block text-gray-700 mb-1">State *</label>
                  <input
                    type="text"
                    id="state"
                    className={`w-full p-2 border rounded ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="NY"
                    {...register('state', { required: 'State is required' })}
                  />
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="zipCode" className="block text-gray-700 mb-1">ZIP Code *</label>
                  <input
                    type="text"
                    id="zipCode"
                    className={`w-full p-2 border rounded ${errors.zipCode ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="10001"
                    {...register('zipCode', { required: 'ZIP code is required' })}
                  />
                  {errors.zipCode && (
                    <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="deliveryDate" className="block text-gray-700 mb-1">Preferred Delivery Date *</label>
                <input
                  type="date"
                  id="deliveryDate"
                  className={`w-full p-2 border rounded ${errors.deliveryDate ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('deliveryDate', { required: 'Delivery date is required' })}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.deliveryDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.deliveryDate.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="deliveryInstructions" className="block text-gray-700 mb-1">Delivery Instructions</label>
                <textarea
                  id="deliveryInstructions"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Special instructions for delivery (optional)"
                  rows="3"
                  {...register('deliveryInstructions')}
                ></textarea>
              </div>
              
              <div className="flex justify-between items-center pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/products')}
                  className="text-gray-600 hover:text-gray-800"
                >
                  ← Continue Shopping
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-green-600 text-white py-3 px-8 rounded hover:bg-green-700 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderCheckout;