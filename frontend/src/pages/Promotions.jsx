import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../config/api';
import './Promotions.css';

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadPromotions = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${API_BASE}/api/promotions`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Không thể tải khuyến mãi');
        }
        setPromotions(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Lỗi tải chương trình khuyến mãi');
      } finally {
        setLoading(false);
      }
    };

    loadPromotions();
  }, []);

  const filteredPromotions = useMemo(() => {
    const term = String(searchTerm || '').trim().toLowerCase();
    return promotions.filter((promotion) => {
      return (
        !term ||
        promotion.code.toLowerCase().includes(term) ||
        promotion.title.toLowerCase().includes(term) ||
        promotion.description.toLowerCase().includes(term)
      );
    });
  }, [promotions, searchTerm]);

  const handleApplyPromo = (code) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('phonehub_selected_promo', code);
    }
    setMessage(`Đã chọn mã ${code}. Vui lòng vào giỏ hàng để hoàn tất đặt hàng.`);
    navigate('/cart');
  };

  return (
    <main className="promotions-page">
      <div className="container">
        <div className="page-heading">
          <div>
            <h1>Khuyến mãi PhoneHub</h1>
            <p>Xem danh sách mã giảm giá, chọn chương trình phù hợp và áp dụng tại giỏ hàng.</p>
          </div>
        </div>

        <div className="promotions-overview">
          <div className="overview-card"><span>Tổng khuyến mãi</span><strong>{promotions.length}</strong></div>
          <div className="overview-card"><span>Khuyến mãi đang hoạt động</span><strong>{filteredPromotions.length}</strong></div>
        </div>

        <div className="promotions-actions">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm mã, tiêu đề hoặc mô tả"
          />
        </div>

        {message && <p className="promo-action-message success">{message}</p>}
        {error && <p className="promo-action-message error">{error}</p>}

        {loading ? (
          <p>Đang tải khuyến mãi...</p>
        ) : (
          <div className="promotion-grid">
            {filteredPromotions.length === 0 ? (
              <div className="empty-state">
                <p>Không tìm thấy mã khuyến mãi phù hợp.</p>
              </div>
            ) : (
              filteredPromotions.map((promotion) => (
                <div key={promotion.id} className="promotion-card">
                  <div className="promotion-card-top">
                    <span className="promotion-code">{promotion.code}</span>
                    <span className="promotion-badge">
                      {promotion.discountType === 'fixed'
                        ? `${Number(promotion.discountValue).toLocaleString('vi-VN')} ₫`
                        : `${promotion.discountValue}%`}
                    </span>
                  </div>
                  <h2>{promotion.title}</h2>
                  <p>{promotion.description}</p>
                  <div className="promotion-meta">
                    <span>Đơn tối thiểu: {Number(promotion.minPurchase).toLocaleString('vi-VN')} ₫</span>
                    <span>Trạng thái: {promotion.active ? 'Hoạt động' : 'Tạm dừng'}</span>
                  </div>
                  <button type="button" className="btn btn-primary promo-apply-button" onClick={() => handleApplyPromo(promotion.code)}>
                    Áp dụng mã này
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default Promotions;
