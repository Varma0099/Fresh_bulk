// src/components/buyer/ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1); // Reset quantity after adding
  };
  
  return (
    <div className="border rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transition-shadow">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
        <img 
          src={product.img || 'https://via.placeholder.com/300x300?text=Product'} 
          alt={product.name}
          className="w-full h-64 object-cover"
        />
      </div>
      
      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-green-600">{product.name}</h3>
        </Link>
        
        <div className="mt-2 flex justify-between items-center">
          <span className="font-bold text-gray-900">${product.price.toFixed(2)}/{product.unit}</span>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center space-x-2 mb-3">
            <label htmlFor={`quantity-${product.id}`} className="text-gray-700">Qty:</label>
            <input
              type="number"
              id={`quantity-${product.id}`}
              min={product.minOrder || 1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20 border rounded p-1 text-center"
            />
          </div>
          
          <button
            onClick={handleAddToCart}
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;