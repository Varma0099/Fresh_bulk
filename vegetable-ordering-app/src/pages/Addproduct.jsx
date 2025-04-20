import { useState } from 'react';

export default function AddProductForm() {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    img: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value
    });
  };

  const togglePreview = () => {
    setPreviewVisible(!previewVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await fetch('https://fresh-bulk.onrender.com/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: product.name,
          price: parseFloat(product.price),
          img: product.img
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add product');
      }
      
      const data = await response.json();
      console.log('Product added:', data);
      setSuccess(true);
      
      // Reset form
      setProduct({
        name: '',
        price: '',
        img: ''
      });
      setPreviewVisible(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setProduct({
      name: '',
      price: '',
      img: ''
    });
    setPreviewVisible(false);
    setError(null);
  };

  const formIsValid = product.name && product.price && product.img;

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Add New Product</h2>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700">
            Product added successfully!
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
            Error: {error}
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
            Product Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={product.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter product name"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="price">
            Price
          </label>
          <input
            id="price"
            name="price"
            type="number"
            value={product.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="img">
            Image URL
          </label>
          <input
            id="img"
            name="img"
            type="url"
            value={product.img}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        
        {product.img && (
          <div className="mb-6">
            <button 
              type="button" 
              onClick={togglePreview} 
              className="text-blue-500 hover:text-blue-700 underline mb-2"
            >
              {previewVisible ? 'Hide Preview' : 'Show Preview'}
            </button>
            
            {previewVisible && (
              <div className="mt-2 p-4 border border-gray-200 rounded-md">
                <h3 className="font-bold text-lg">{product.name || 'Product Name'}</h3>
                <p className="text-green-600 font-medium my-1">
                  ${parseFloat(product.price || 0).toFixed(2)}
                </p>
                <div className="mt-2 h-40 bg-gray-100 flex items-center justify-center">
                  <img 
                    src="/api/placeholder/200/160" 
                    alt="Product preview" 
                    className="max-h-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            disabled={isSubmitting}
          >
            Clear
          </button>
          
          <button
            type="submit"
            className={`px-4 py-2 rounded-md ${
              formIsValid && !isSubmitting
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-blue-300 text-white cursor-not-allowed'
            }`}
            disabled={!formIsValid || isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
}