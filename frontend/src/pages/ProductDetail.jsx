import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const products = [
    {
      id: 1,
      name: 'iPhone 15 Pro Max',
      brand: 'Apple',
      price: 35900000,
      originalPrice: 39990000,
      specs: '6.7" AMOLED | A17 Pro | 256GB',
      rating: 4.8,
      reviews: 245,
      image: '📱',
      description: 'Flagship iPhone mới nhất với công nghệ camera tiên tiến',
      details: 'Màn hình AMOLED 6.7 inch, Chip A17 Pro, Camera 48MP, Pin 4685mAh, 5G, Titanium',
      fullDescription: `
        iPhone 15 Pro Max là chiếc iPhone mạnh nhất từng được tạo ra. Với chip A17 Pro mới nhất, 
        màn hình AMOLED siêu sáng, và hệ thống camera cải tiến, sản phẩm này sẽ thay đổi cách bạn 
        sử dụng điện thoại.
        
        Đặc điểm nổi bật:
        - Chip A17 Pro với hiệu năng vô cùng mạnh
        - Màn hình AMOLED 6.7 inch 120Hz
        - Hệ thống camera 4 ống kính
        - Thiết kế Titanium bền bỉ
        - Sạc nhanh 27W và sạc không dây MagSafe
      `
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24 Ultra',
      brand: 'Samsung',
      price: 32990000,
      originalPrice: 36990000,
      specs: '6.8" Dynamic AMOLED | Snapdragon 8 Gen 3',
      rating: 4.7,
      reviews: 189,
      image: '📱',
      description: 'Điện thoại flagship của Samsung với hiệu năng cực mạnh',
      details: 'Màn hình Dynamic AMOLED 120Hz, Snapdragon 8 Gen 3, Camera 50MP, 5000mAh, S Pen',
      fullDescription: `
        Galaxy S24 Ultra là đỉnh cao của công nghệ điện thoại Samsung. 
        Với S Pen tích hợp, Snapdragon 8 Gen 3 mạnh mẽ, và màn hình Dynamic AMOLED siêu sáng,
        bạn sẽ có trải nghiệm không tưởng.
      `
    },
  ];

  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="container not-found">
        <h2>Sản phẩm không tìm thấy</h2>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="container product-detail">
        <button className="btn btn-back" onClick={() => navigate(-1)}>
          ← Quay lại
        </button>

        <div className="product-detail-content">
          <div className="product-image-large">
            <div className="image-placeholder">📱</div>
          </div>

          <div className="product-details-info">
            <h1 className="product-title">{product.name}</h1>
            <p className="product-brand-tag">{product.brand}</p>

            <div className="rating-section">
              <div className="stars">⭐ {product.rating}</div>
              <span className="review-count">({product.reviews} đánh giá)</span>
            </div>

            <div className="price-section">
              <p className="price-main">{product.price.toLocaleString('vi-VN')} ₫</p>
              {product.originalPrice && (
                <>
                  <p className="price-original">{product.originalPrice.toLocaleString('vi-VN')} ₫</p>
                  <p className="discount">
                    Tiết kiệm {Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </p>
                </>
              )}
            </div>

            <div className="specs-section">
              <h3>Thông số kỹ thuật</h3>
              <p>{product.details}</p>
            </div>

            <div className="action-section">
              <div className="quantity-selector">
                <label>Số lượng:</label>
                <input type="number" min="1" defaultValue="1" />
              </div>
              <button 
                className="btn btn-primary btn-large"
                onClick={() => addToCart(product)}
              >
                🛒 Thêm vào giỏ hàng
              </button>
              <button className="btn btn-secondary btn-large">
                ❤️ Thêm vào yêu thích
              </button>
            </div>

            <div className="benefits-section">
              <div className="benefit-item">
                <span>🚚</span>
                <p><strong>Giao hàng miễn phí</strong> trên toàn thành phố</p>
              </div>
              <div className="benefit-item">
                <span>🛡️</span>
                <p><strong>Bảo hành 12 tháng</strong> từ hãng sản xuất</p>
              </div>
              <div className="benefit-item">
                <span>💬</span>
                <p><strong>Hỗ trợ 24/7</strong> qua chat, email, điện thoại</p>
              </div>
            </div>
          </div>
        </div>

        <div className="product-description-section">
          <h2>Mô tả chi tiết</h2>
          <div className="description-content">
            {product.fullDescription}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
