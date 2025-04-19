import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function ProductUpdateForm() {
  const [product, setProduct] = useState({
    id: 0,
    name: '',
    price: '',
    img: ''
  });
  const nav=useNavigate()
  const [originalProduct, setOriginalProduct] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // For demo purposes - in a real app, you'd get this from props or URL params
  const productId = useParams().id

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:5000/api/products/${productId}`);
        
        if (!response.ok) {
          throw new Error('Product not found');
        }
        
        const data = await response.json();
        setProduct(data);
        setOriginalProduct({...data});
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId,nav]);

  // Check for changes
  useEffect(() => {
    if (!isLoading) {
      const hasChanged = 
        product.name !== originalProduct.name ||
        parseFloat(product.price) !== parseFloat(originalProduct.price) ||
        product.img !== originalProduct.img;
      
      setHasChanges(hasChanged);
    }
  }, [product, originalProduct, isLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await fetch(`http://localhost:5000/api/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: product.name,
          price: parseFloat(product.price),
          img: product.img
        }),
      });
      nav("/")

      
      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      
      const updatedProduct = await response.json();
      setProduct(updatedProduct.product);
      setOriginalProduct({...updatedProduct.product});
      setSuccess(true);
      setHasChanges(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setProduct({...originalProduct});
    setHasChanges(false);
    setError(null);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">Loading product data...</p>
        </div>
      </div>
    );
  }

  if (error && !product.id) {
    return (
      <div className="w-full max-w-md mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Update Product</h2>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700">
            Product updated successfully!
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
          />
        </div>
        
        {product.img && (
          <div className="mb-4 p-4 border border-gray-200 rounded-md">
            <h3 className="text-sm text-gray-600 mb-2">Image Preview</h3>
            <div className="h-48 flex items-center justify-center bg-gray-100">
              <img 
                src="/api/placeholder/240/160" 
                alt="Product preview" 
                className="max-h-full object-contain"
              />
            </div>
          </div>
        )}
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            disabled={!hasChanges || isSubmitting}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className={`px-4 py-2 rounded-md ${
              hasChanges && !isSubmitting
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-blue-300 text-white cursor-not-allowed'
            }`}
            disabled={!hasChanges || isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update Product'}
          </button>
        </div>
      </form>
    </div>
  );
}