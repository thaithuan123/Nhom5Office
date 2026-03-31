import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AdminProvider } from './context/AdminContext';
import Header from './components/Header';
import AdminRoute from './components/AdminRoute';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Users from './pages/Users';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AdminProvider>
        <CartProvider>
          <div className="app">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route
                path="/admin/products"
                element={(
                  <AdminRoute>
                    <AdminProducts />
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
              <Route path="/users" element={<Navigate to="/admin/users" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </div>
        </CartProvider>
      </AdminProvider>
    </BrowserRouter>
  );
}

export default App;
