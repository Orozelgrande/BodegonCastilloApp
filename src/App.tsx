import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';

// Layouts
import ClientLayout from './layouts/ClientLayout';
import AdminLayout from './layouts/AdminLayout';

// Client Pages
import AgeGate from './pages/client/AgeGate';
import Login from './pages/client/Login';
import Register from './pages/client/Register';
import Home from './pages/client/Home';
import Cart from './pages/client/Cart';
import Checkout from './pages/client/Checkout';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import Orders from './pages/admin/Orders';
import Products from './pages/admin/Products';
import Clients from './pages/admin/Clients';

// Protected Route Wrapper
const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) => {
  const { isAgeVerified, isAdmin, currentUser } = useStore();
  
  if (!isAgeVerified) {
    return <Navigate to="/" replace />;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/home" replace />;
  }
  
  return <>{children}</>;
};

// Public Route Wrapper
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAgeVerified, currentUser, isAdmin } = useStore();
  
  if (!isAgeVerified) {
    return <Navigate to="/" replace />;
  }
  
  if (currentUser) {
    return <Navigate to={isAdmin ? "/admin" : "/home"} replace />;
  }
  
  return <>{children}</>;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Age Gate (Absolute Public) */}
        <Route path="/" element={<AgeGate />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Client Routes */}
        <Route element={<ProtectedRoute><ClientLayout /></ProtectedRoute>}>
          <Route path="/home" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<Products />} />
          <Route path="clients" element={<Clients />} />
          {/* Settings placeholder */}
          <Route path="settings" element={<div className="p-6">Configuración del Tenant (En desarrollo)</div>} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
