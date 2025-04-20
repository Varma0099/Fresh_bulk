import { useState, useEffect } from 'react';

export default function OrderUpdateForm() {
  const statusOptions = [
    'Pending',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled'
  ];

  const [order, setOrder] = useState({
    id: 0,
    buyer_name: '',
    buyer_contact: '',
    delivery_address: '',
    items: [],
    status: 'Pending'
  });
  
  const [originalOrder, setOriginalOrder] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [itemInput, setItemInput] = useState({ name: '', price: '', quantity: 1 });
  
  // For demo purposes - in a real app, you'd get this from props or URL params
  const orderId = 1;

  // Fetch order data
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`https://fresh-bulk.onrender.com/api/orders/${orderId}`);
        
        if (!response.ok) {
          throw new Error('Order not found');
        }
        
        const data = await response.json();
        setOrder(data);
        setOriginalOrder(JSON.parse(JSON.stringify(data)));
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId]);

  // Check for changes
  useEffect(() => {
    if (!isLoading) {
      const originalJSON = JSON.stringify(originalOrder);
      const currentJSON = JSON.stringify(order);
      setHasChanges(originalJSON !== currentJSON);
    }
  }, [order, originalOrder, isLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder({
      ...order,
      [name]: value
    });
  };

  const handleItemInputChange = (e) => {
    const { name, value } = e.target;
    setItemInput({
      ...itemInput,
      [name]: name === 'quantity' || name === 'price' ? parseFloat(value) || 0 : value
    });
  };

  const addItem = () => {
    if (!itemInput.name || !itemInput.price) return;
    
    setOrder({
      ...order,
      items: [...JSON.parse(order.items), { ...itemInput }]
    });
    
    // Reset item input
    setItemInput({ name: '', price: '', quantity: 1 });
  };

  const removeItem = (index) => {
    const updatedItems = [...JSON.parse(order.items)];
    updatedItems.splice(index, 1);
    
    setOrder({
      ...order,
      items: updatedItems
    });
  };

  const updateItemQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedItems = [...JSON.parse(order.items)];
    updatedItems[index].quantity = newQuantity;
    
    setOrder({
      ...order,
      items: updatedItems
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await fetch(`https://fresh-bulk.onrender.com/api/orders/${order.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update order');
      }
      
      const updatedOrder = await response.json();
      setOrder(updatedOrder);
      setOriginalOrder(JSON.parse(JSON.stringify(updatedOrder)));
      setSuccess(true);
      setHasChanges(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setOrder(JSON.parse(JSON.stringify(originalOrder)));
    setHasChanges(false);
    setError(null);
  };

  const calculateTotal = () => {
    return JSON.parse(order.items).reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-lg mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">Loading order data...</p>
        </div>
      </div>
    );
  }

  if (error && !order.id) {
    return (
      <div className="w-full max-w-lg mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Update Order #{order.id}</h2>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700">
            Order updated successfully!
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
            Error: {error}
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="buyer_name">
            Buyer Name
          </label>
          <input
            id="buyer_name"
            name="buyer_name"
            type="text"
            value={order.buyer_name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="buyer_contact">
            Buyer Contact
          </label>
          <input
            id="buyer_contact"
            name="buyer_contact"
            type="text"
            value={order.buyer_contact}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="delivery_address">
            Delivery Address
          </label>
          <textarea
            id="delivery_address"
            name="delivery_address"
            value={order.delivery_address}
            onChange={handleChange}
            required
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="status">
            Order Status
          </label>
          <select
            id="status"
            name="status"
            value={order.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Order Items
          </label>
          
          <div className="mb-4 p-4 border border-gray-200 rounded-md">
            <h3 className="font-medium text-gray-700 mb-2">Current Items</h3>
            
            {JSON.parse(order.items).length === 0 ? (
              <p className="text-gray-500 italic">No items in this order</p>
            ) : (
              <>
                <ul className="mb-3">
                  {JSON.parse(order.items).map((item, index) => (
                    <li key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                      <div className="flex-grow">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          ${parseFloat(item.price).toFixed(2)} × 
                          <button 
                            type="button"
                            onClick={() => updateItemQuantity(index, item.quantity - 1)}
                            className="px-1 text-gray-700 hover:text-gray-900"
                          >
                            -
                          </button>
                          <span className="mx-1">{item.quantity}</span>
                          <button 
                            type="button"
                            onClick={() => updateItemQuantity(index, item.quantity + 1)}
                            className="px-1 text-gray-700 hover:text-gray-900"
                          >
                            +
                          </button>
                          = ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeItem(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="font-medium text-right">
                  Total: ${calculateTotal()}
                </div>
              </>
            )}
          </div>
          
          <div className="p-4 border border-gray-200 rounded-md">
            <h3 className="font-medium text-gray-700 mb-2">Add New Item</h3>
            <div className="flex flex-wrap -mx-2">
              <div className="px-2 w-full sm:w-1/2 mb-2">
                <input
                  type="text"
                  name="name"
                  value={itemInput.name}
                  onChange={handleItemInputChange}
                  placeholder="Item name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="px-2 w-full sm:w-1/4 mb-2">
                <input
                  type="number"
                  name="price"
                  value={itemInput.price}
                  onChange={handleItemInputChange}
                  placeholder="Price"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="px-2 w-full sm:w-1/4 mb-2">
                <input
                  type="number"
                  name="quantity"
                  value={itemInput.quantity}
                  onChange={handleItemInputChange}
                  placeholder="Qty"
                  min="1"
                  step="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="mt-2">
              <button 
                type="button"
                onClick={addItem}
                className="w-full px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                disabled={!itemInput.name || !itemInput.price}
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
        
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
            {isSubmitting ? 'Updating...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}