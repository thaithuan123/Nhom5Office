import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AdminProvider } from './context/AdminContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import AdminRoute from './components/AdminRoute';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Products from './pages/Products';
import Auth from './pages/Auth';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminPromotions from './pages/AdminPromotions';
import AdminOrders from './pages/AdminOrders';
import ProductDetail from './pages/ProductDetail';
import Promotions from './pages/Promotions';
import Cart from './pages/Cart';
import Users from './pages/Users';
import NotFound from './pages/NotFound';
import StoreLocator from './pages/StoreLocator';
import ChatWidget from "./components/ChatWidget";
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminProvider>
          <CartProvider>
            <div className="app">
              <Header />
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/store-locator" element={<StoreLocator />} />
                <Route
                  path="/admin"
                  element={(
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  )}
                />
                <Route
                  path="/cart"
                  element={(
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  )}
                />
                <Route
                  path="/admin/products"
                  element={(
                    <AdminRoute>
                      <AdminProducts />
                    </AdminRoute>
                  )}
                />
                <Route
                  path="/admin/promotions"
                  element={(
                    <AdminRoute>
                      <AdminPromotions />
                    </AdminRoute>
                  )}
                />
                <Route
                  path="/admin/users"
                  element={(
                    <AdminRoute>
                      <Users />
                    </AdminRoute>
                  )}
                />
                <Route
                  path="/admin/orders"
                  element={(
                    <AdminRoute>
                      <AdminOrders />
                    </AdminRoute>
                  )}
                />
                <Route path="/promotions" element={<Promotions />} />
                <Route path="/users" element={<Navigate to="/admin/users" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </CartProvider>
        </AdminProvider>
      </AuthProvider>
     <ChatWidget />  
    </BrowserRouter>
  );
}

export default App;
