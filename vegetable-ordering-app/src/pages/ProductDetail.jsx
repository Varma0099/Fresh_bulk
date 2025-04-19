// src/pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/api';
import { useCart } from '../context/CartContext';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productService.getById(id);
        setProduct(response.data);
        setQuantity(response.data.minOrder || 1);
        setError(null);
      } catch (err) {
        setError('Failed to load product details. Please try again later.');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
    // Show a success message or notification here if desired
  };
  
  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded mb-6">
        <p>{error || 'Product not found'}</p>
        <button 
          onClick={() => navigate('/products')}
          className="mt-4 text-blue-600 hover:underline"
        >
          Return to Product Catalog
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={() => navigate('/products')}
        className="flex items-center mb-6 text-green-600 hover:text-green-800"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Products
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-white p-4 rounded-lg shadow">
          <img 
            src={product.imageUrl || 'https://via.placeholder.com/600x600?text=Product'} 
            alt={product.name}
            className="w-full h-auto object-cover rounded"
          />
        </div>
        
        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
          
          <div className="mt-4">
            <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}/{product.unit}</span>
            <span className="ml-2 text-gray-500">
              (Min. order: {product.minOrder} {product.unit})
            </span>
          </div>
          
          {product.availability ? (
            <div className="mt-2 text-green-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              In Stock
            </div>
          ) : (
            <div className="mt-2 text-red-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              Out of Stock
            </div>
          )}
          
          {/* Product description */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800">Description</h3>
            <p className="mt-2 text-gray-600">{product.description}</p>
          </div>
          
          {/* Origin and quality */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-800">Origin</h4>
              <p className="text-gray-600">{product.origin || 'Local'}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Quality</h4>
              <p className="text-gray-600">{product.quality || 'Premium'}</p>
            </div>
            {product.category && (
              <div>
                <h4 className="font-medium text-gray-800">Category</h4>
                <p className="text-gray-600">{product.category}</p>
              </div>
            )}
            {product.seasons && (
              <div>
                <h4 className="font-medium text-gray-800">Season</h4>
                <p className="text-gray-600">{product.seasons}</p>
              </div>
            )}
          </div>
          
          {/* Quantity selector and buttons */}
          {product.availability && (
            <div className="mt-8">
              <div className="flex items-center mb-4">
                <label htmlFor="quantity" className="mr-4 text-gray-700">Quantity:</label>
                <div className="flex items-center border rounded">
                  <button 
                    onClick={() => quantity > (product.minOrder || 1) && setQuantity(quantity - 1)}
                    className="px-3 py-2 border-r hover:bg-gray-100"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    min={product.minOrder || 1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(product.minOrder || 1, Number(e.target.value)))}
                    className="w-16 text-center p-2 focus:outline-none"
                  />
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 border-l hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <span className="ml-2 text-gray-600">{product.unit}</span>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded hover:bg-green-700 transition-colors"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded hover:bg-blue-700 transition-colors"
                >
                  Buy Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;