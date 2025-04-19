import { useState, useEffect } from 'react';
import { Trash2, Edit, Search, RefreshCw, PlusCircle, Package, ShoppingCart, ExternalLink } from 'lucide-react';

export default function OrderProductManagement() {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Placeholder API URLs - replace with your actual APIs
  const API_URLS = {
    orders: 'http://localhost:5000/api/orders',
    products: 'http://localhost:5000/api/products'
  };

  // Redirect URLs for update operations
  const EDIT_URLS = {
    orders: '/updateorder/',
    products: '/updateproduct/'
  };

  // Fetch data based on active tab
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URLS[activeTab]);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${activeTab}`);
      }
      const data = await response.json();
      if (activeTab === 'orders') {
        setOrders(data);
      } else {
        setProducts(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URLS[activeTab]}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete ${activeTab.slice(0, -1)}`);
      }
      
      // Remove the deleted item from state
      if (activeTab === 'orders') {
        setOrders(orders.filter(order => order.id !== id));
      } else {
        setProducts(products.filter(product => product.id !== id));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (id) => {
    // Redirect to the edit page for the selected item
    window.location.href = `${EDIT_URLS[activeTab]}${id}`;
  };

  // Filter items based on search term
  const filteredItems = activeTab === 'orders' 
    ? orders.filter(order => order.id.toString().includes(searchTerm) || 
        (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase())))
    : products.filter(product => product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.id.toString().includes(searchTerm));

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Inventory Management System</h1>
      
      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button 
          onClick={() => setActiveTab('orders')} 
          className={`flex items-center px-4 py-2 mr-2 ${activeTab === 'orders' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-t`}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Orders
        </button>
        <button 
          onClick={() => setActiveTab('products')} 
          className={`flex items-center px-4 py-2 ${activeTab === 'products' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-t`}
        >
          <Package className="mr-2 h-5 w-5" />
          Products
        </button>
      </div>
      
      {/* Controls */}
      <div className="flex justify-between mb-4">
        <div className="flex items-center">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              className="pl-10 py-2 px-4 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={fetchData}
            className="flex items-center bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </button>
          <button 
            onClick={() => window.location.href = "/addproduct"}
            className="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New
          </button>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}
      
      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {/* Data Table */}
      {!loading && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                {activeTab === 'orders' ? (
                  <>
                    <th className="py-3 px-4 text-left">Customer</th>
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Total</th>
                  </>
                ) : (
                  <>
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Price</th>
                    <th className="py-3 px-4 text-left">Stock</th>
                    <th className="py-3 px-4 text-left">Category</th>
                  </>
                )}
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4">{item.id}</td>
                    {activeTab === 'orders' ? (
                      <>
                        <td className="py-3 px-4">{item.buyer_name || 'N/A'}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2 py-1 rounded text-xs ${
                            item.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            item.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            item.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                            item.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {item.status || 'Pending'}
                          </span>
                        </td>
                        <td className="py-3 px-4">${item.total?.toFixed(2) || '0.00'}</td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 px-4">{item.name || 'N/A'}</td>
                        <td className="py-3 px-4">${item.price?.toFixed(2) || '0.00'}</td>
                        <td className="py-3 px-4">{item.stock || '0'}</td>
                        <td className="py-3 px-4">{item.category || 'Uncategorized'}</td>
                      </>
                    )}
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleUpdate(item.id)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={activeTab === 'orders' ? 6 : 6} className="py-8 text-center text-gray-500">
                    No {activeTab} found. Add some or try a different search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}