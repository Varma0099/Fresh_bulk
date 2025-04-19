// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Page imports
import Home from './pages/Home';
import ProductCatalog from './pages/ProductCatalog';
import ProductDetail from './pages/ProductDetail';
import OrderCheckout from './pages/OrderCheckout';
import OrderTracking from './pages/OrderTracking';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin page imports
import AdminDashboard from './pages/admin/Dashboard';
import AdminOrderManagement from './pages/admin/OrderManagement';
import AdminProductManagement from './pages/admin/ProductManagement';
import ProductForm from './pages/Addproduct';
import ProductUpdateForm from './pages/updateproduct';
import OrderUpdateForm from './pages/updateorder';
import OrderProductManagement from './pages/admin';

// Private route wrapper for admin routes
const PrivateAdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user?.role === 'admin';
  
  if (!isAdmin) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<ProductCatalog />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/checkout" element={<OrderCheckout />} />
                <Route path="/track-order/:id?" element={<OrderTracking />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path='/addproduct' element={<ProductForm/>} />
                <Route path='/updateproduct/:id' element={<ProductUpdateForm/>} />
                <Route path='/updateorder/:id' element={<OrderUpdateForm/>} />
                <Route path="/admin" element={<OrderProductManagement/>} />
                
                {/* Admin routes */}
                <Route path="/admin" element={
                  <PrivateAdminRoute>
                    <AdminDashboard />
                  </PrivateAdminRoute>
                } />
                <Route path="/admin/orders" element={
                  <PrivateAdminRoute>
                    <AdminOrderManagement />
                  </PrivateAdminRoute>
                } />
                <Route path="/admin/products" element={
                  <PrivateAdminRoute>
                    <AdminProductManagement />
                  </PrivateAdminRoute>
                } />
                
                {/* 404 route */}
                <Route path="*" element={
                  <div className="text-center py-20">
                    <h1 className="text-4xl font-bold text-gray-800">404</h1>
                    <p className="text-xl text-gray-600">Page not found</p>
                  </div>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;