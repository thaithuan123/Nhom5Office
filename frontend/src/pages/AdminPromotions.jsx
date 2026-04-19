import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../config/api';
import './Promotions.css';

const initialForm = {
  code: '',
  title: '',
  description: '',
  discountType: 'percent',
  discountValue: '10',
  minPurchase: '0',
  active: true,
  startDate: '',
  endDate: '',
};

const AdminPromotions = () => {
  const { authToken } = useAuth();
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState(initialForm);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPromotionId, setEditingPromotionId] = useState(null);

  const fetchPromotions = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/api/admin/promotions?search=${encodeURIComponent(searchTerm)}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Không thể tải danh sách khuyến mãi');
      }
      setPromotions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Lỗi khi lấy khuyến mãi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, [searchTerm]);

  const visiblePromotions = useMemo(() => promotions, [promotions]);

  const resetForm = () => {
    setForm(initialForm);
    setIsEditing(false);
    setEditingPromotionId(null);
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = {
        code: form.code.trim().toUpperCase(),
        title: form.title.trim(),
        description: form.description.trim(),
        discountType: form.discountType,
        discountValue: Number(form.discountValue || 0),
        minPurchase: Number(form.minPurchase || 0),
        active: Boolean(form.active),
        startDate: form.startDate || null,
        endDate: form.endDate || null,
      };

      const url = isEditing
        ? `${API_BASE}/api/admin/promotions/${editingPromotionId}`
        : `${API_BASE}/api/admin/promotions`;
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Không thể lưu khuyến mãi');
      }
      resetForm();
      await fetchPromotions();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (promotion) => {
    setForm({
      code: promotion.code || '',
      title: promotion.title || '',
      description: promotion.description || '',
      discountType: promotion.discountType || 'percent',
      discountValue: String(promotion.discountValue || 0),
      minPurchase: String(promotion.minPurchase || 0),
      active: Boolean(promotion.active),
      startDate: promotion.startDate ? promotion.startDate.slice(0, 10) : '',
      endDate: promotion.endDate ? promotion.endDate.slice(0, 10) : '',
    });
    setIsEditing(true);
    setEditingPromotionId(promotion.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (promotionId) => {
    if (!window.confirm('Bạn có chắc muốn xóa khuyến mãi này?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/admin/promotions/${promotionId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Không thể xóa khuyến mãi');
      }
      await fetchPromotions();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="promotions-admin-page">
      <div className="container">
        <div className="page-heading">
          <div>
            <h1>Quản lý khuyến mãi</h1>
            <p>Thêm, chỉnh sửa, xóa và tìm kiếm mã giảm giá cho khách hàng.</p>
          </div>
          <Link className="btn btn-secondary" to="/admin">
            Về menu admin
          </Link>
        </div>

        <div className="promotions-overview">
          <div className="overview-card"><span>Tổng mã</span><strong>{promotions.length}</strong></div>
          <div className="overview-card"><span>Đang hiển thị</span><strong>{visiblePromotions.length}</strong></div>
        </div>

        <section className="promotion-form-section">
          <h2>{isEditing ? 'Chỉnh sửa khuyến mãi' : 'Thêm khuyến mãi mới'}</h2>
          <form className="promotion-form" onSubmit={handleSubmit}>
            <div className="input-group"><label>Mã khuyến mãi</label><input name="code" value={form.code} onChange={handleInputChange} required /></div>
            <div className="input-group"><label>Tiêu đề</label><input name="title" value={form.title} onChange={handleInputChange} required /></div>
            <div className="input-group full-width"><label>Mô tả</label><textarea name="description" value={form.description} onChange={handleInputChange} required rows="2" /></div>
            <div className="input-group"><label>Loại giảm</label><select name="discountType" value={form.discountType} onChange={handleInputChange}><option value="percent">Phần trăm</option><option value="fixed">Số tiền</option></select></div>
            <div className="input-group"><label>Giá trị giảm</label><input type="number" name="discountValue" value={form.discountValue} onChange={handleInputChange} required min="0" /></div>
            <div className="input-group"><label>Đơn tối thiểu</label><input type="number" name="minPurchase" value={form.minPurchase} onChange={handleInputChange} required min="0" /></div>
            <div className="input-group"><label>Trạng thái</label><label className="checkbox-label"><input type="checkbox" name="active" checked={form.active} onChange={handleInputChange} /> Hoạt động</label></div>
            <div className="input-group"><label>Ngày bắt đầu</label><input type="date" name="startDate" value={form.startDate} onChange={handleInputChange} /></div>
            <div className="input-group"><label>Ngày kết thúc</label><input type="date" name="endDate" value={form.endDate} onChange={handleInputChange} /></div>
            {error && <p className="error-text">{error}</p>}
            <div className="action-buttons full-width">
              <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Đang lưu...' : isEditing ? 'Cập nhật khuyến mãi' : 'Thêm khuyến mãi'}</button>
              <button className="btn btn-secondary" type="button" onClick={resetForm}>Làm mới</button>
            </div>
          </form>
        </section>

        <section className="promotion-filter-section">
          <div className="filter-item search-item"><label>Tìm kiếm</label><input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Tìm theo mã hoặc tiêu đề" /></div>
        </section>

        {loading && <p>Đang tải danh sách khuyến mãi...</p>}

        {!loading && (
          <div className="promotion-table-wrap">
            <table className="products-table">
              <thead>
                <tr><th>#</th><th>Mã</th><th>Tiêu đề</th><th>Giảm</th><th>Min</th><th>Trạng thái</th><th>Hành động</th></tr>
              </thead>
              <tbody>
                {visiblePromotions.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center' }}>Không có khuyến mãi phù hợp.</td></tr>
                ) : visiblePromotions.map((promotion) => (
                  <tr key={promotion.id}>
                    <td>{promotion.id}</td>
                    <td>{promotion.code}</td>
                    <td><strong>{promotion.title}</strong><p>{promotion.description}</p></td>
                    <td>{promotion.discountType === 'fixed' ? `${Number(promotion.discountValue).toLocaleString('vi-VN')} ₫` : `${promotion.discountValue}%`}</td>
                    <td>{Number(promotion.minPurchase).toLocaleString('vi-VN')} ₫</td>
                    <td>{promotion.active ? 'Hoạt động' : 'Tạm dừng'}</td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-secondary small" type="button" onClick={() => handleEdit(promotion)}>Sửa</button>
                        <button className="btn btn-danger small" type="button" onClick={() => handleDelete(promotion.id)}>Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminPromotions;
