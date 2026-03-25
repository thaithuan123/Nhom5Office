import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      alert('Cảm ơn bạn! Đơn hàng của bạn đã được đặt. Mã đơn hàng: #' + Math.floor(Math.random() * 100000));
      clearCart();
      navigate('/');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container cart-empty">
        <h1>Giỏ hàng của bạn</h1>
        <div className="empty-state">
          <p className="empty-icon">🛒</p>
          <h2>Giỏ hàng trống</h2>
          <p>Bạn chưa thêm sản phẩm nào vào giỏ hàng</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Giỏ hàng của bạn</h1>

        <div className="cart-content">
          <div className="cart-items">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Giá</th>
                  <th>Số lượng</th>
                  <th>Tổng cộng</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id} className="cart-item-row">
                    <td className="product-col">
                      <div className="product-info">
                        <span className="product-icon">📱</span>
                        <div>
                          <p className="product-name">{item.name}</p>
                          <p className="product-brand">{item.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="price-col">
                      {item.price.toLocaleString('vi-VN')} ₫
                    </td>
                    <td className="quantity-col">
                      <div className="quantity-control">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                        <input 
                          type="number" 
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                        />
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                    </td>
                    <td className="total-col">
                      <strong>{(item.price * item.quantity).toLocaleString('vi-VN')} ₫</strong>
                    </td>
                    <td className="action-col">
                      <button 
                        className="btn-remove"
                        onClick={() => removeFromCart(item.id)}
                        title="Xóa khỏi giỏ hàng"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="cart-summary">
            <div className="summary-box">
              <h2>Tóm tắt đơn hàng</h2>

              <div className="summary-item">
                <span>Tổng tiền hàng:</span>
                <span>{getTotalPrice().toLocaleString('vi-VN')} ₫</span>
              </div>

              <div className="summary-item">
                <span>Phí vận chuyển:</span>
                <span className="free-ship">Miễn phí</span>
              </div>

              <div className="summary-item discount">
                <span>Giảm giá:</span>
                <span>0 ₫</span>
              </div>

              <div className="divider"></div>

              <div className="summary-item total">
                <span>Tổng cộng:</span>
                <span>{getTotalPrice().toLocaleString('vi-VN')} ₫</span>
              </div>

              <button className="btn btn-primary btn-block" onClick={handleCheckout}>
                Tiến hành thanh toán
              </button>

              <button 
                className="btn btn-secondary btn-block"
                onClick={() => navigate('/')}
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
