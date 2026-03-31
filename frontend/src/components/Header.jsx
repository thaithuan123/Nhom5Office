import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';
import './Header.css';

const Header = () => {
  const { getTotalItems } = useCart();
  const { isAdmin, logoutAdmin } = useAdmin();

  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo">
          <h1>📱 PhoneHub</h1>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">Trang chủ</Link>
          <Link to="/products" className="nav-link">Sản phẩm</Link>
          {isAdmin && <Link to="/admin" className="nav-link nav-link-admin">Menu admin</Link>}
        </nav>
        <div className="header-actions">
          {isAdmin ? (
            <>
              <Link to="/admin" className="admin-button">Quản trị</Link>
              <button type="button" className="logout-button" onClick={logoutAdmin}>
                Đăng xuất
              </button>
            </>
          ) : (
            <Link to="/admin" className="admin-button">Đăng nhập admin</Link>
          )}

          <Link to="/cart" className="cart-link">
            🛒 Giỏ hàng
            {getTotalItems() > 0 && <span className="cart-badge">{getTotalItems()}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
