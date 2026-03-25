import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Header.css';

const Header = () => {
  const { getTotalItems } = useCart();

  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo">
          <h1>📱 PhoneHub</h1>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">Trang chủ</Link>
          <Link to="/products" className="nav-link">Sản phẩm</Link>
          <Link to="/about" className="nav-link">Về chúng tôi</Link>
          <Link to="/contact" className="nav-link">Liên hệ</Link>
          <Link to="/users" className="nav-link">Users</Link>
        </nav>
        <Link to="/cart" className="cart-link">
          🛒 Giỏ hàng
          {getTotalItems() > 0 && <span className="cart-badge">{getTotalItems()}</span>}
        </Link>
      </div>
    </header>
  );
};

export default Header;
