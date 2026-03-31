import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { API_BASE } from '../config/api';
import { fallbackProducts } from '../data/fallbackProducts';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const numericId = Number(id);

  const [product, setProduct] = useState(() => fallbackProducts.find((item) => item.id === numericId) || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    const loadProduct = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`${API_BASE}/api/products/${numericId}`);
        if (!response.ok) {
          throw new Error('Không thể tải chi tiết sản phẩm');
        }

        const data = await response.json();
        if (!ignore) {
          setProduct(data);
        }
      } catch (err) {
        if (!ignore) {
          const fallback = fallbackProducts.find((item) => item.id === numericId) || null;
          setProduct(fallback);
          if (fallback) {
            setError('Không tải được dữ liệu live, đang hiển thị dữ liệu mẫu.');
          }
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      ignore = true;
    };
  }, [numericId]);

  if (loading && !product) {
    return (
      <div className="container not-found">
        <h2>Đang tải sản phẩm...</h2>
      </div>
    );
  }

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

  const hasImageUrl = typeof product.image === 'string' && /^https?:/i.test(product.image);

  return (
    <div className="product-detail-page">
      <div className="container product-detail">
        <button className="btn btn-back" onClick={() => navigate(-1)}>
          ← Quay lại
        </button>

        <div className="product-detail-content">
          <div className="product-image-large">
            {hasImageUrl ? <img src={product.image} alt={product.name} /> : <div className="image-placeholder">{product.image || '📱'}</div>}
          </div>

          <div className="product-details-info">
            {error && <p>{error}</p>}
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
            {product.fullDescription || product.details || product.description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
