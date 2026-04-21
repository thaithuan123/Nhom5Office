import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { isAdmin, adminUser, logoutAdmin } = useAdmin();
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    orders: 0,
    promotions: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
  try {
    const response = await fetch('http://localhost:4000/api/admin/stats');
    const data = await response.json();
    setStats(data);
  } catch (error) {
    console.error('Error fetching stats:', error);
  }
};

  if (!isAdmin) {
    return null;
  }

  return (
    <main className="admin-page">
      <div className="container admin-dashboard">
        {/* Header */}
        <div className="admin-header-block">
          <div>
            <span className="eyebrow">Menu admin</span>
            <h1>Xin chào, {adminUser.name}</h1>
            <p>Chọn một chức năng quản trị để cập nhật dữ liệu của hệ thống.</p>
          </div>
          <button className="btn btn-secondary" type="button" onClick={logoutAdmin}>
            Đăng xuất
          </button>
        </div>

        {/* Stats Row */}
        <div className="admin-stats-grid">
          <div className="stat-card stat-products">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <p className="stat-label">Sản phẩm</p>
              <p className="stat-number">{stats.products}</p>
            </div>
          </div>
          <div className="stat-card stat-users">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <p className="stat-label">Người dùng</p>
              <p className="stat-number">{stats.users}</p>
            </div>
          </div>
          <div className="stat-card stat-orders">
            <div className="stat-icon">🛒</div>
            <div className="stat-content">
              <p className="stat-label">Đơn hàng</p>
              <p className="stat-number">{stats.orders}</p>
            </div>
          </div>
          <div className="stat-card stat-promotions">
            <div className="stat-icon">🎁</div>
            <div className="stat-content">
              <p className="stat-label">Khuyến mãi</p>
              <p className="stat-number">{stats.promotions}</p>
            </div>
          </div>
        </div>

        {/* Menu Cards */}
        <div className="admin-menu-section">
          <h2 style={{ marginBottom: '20px' }}>Các chức năng quản trị</h2>
          <div className="admin-card-grid">
            <Link to="/admin/products" className="admin-card-link">
              <span className="card-icon">📦</span>
              <h3>Quản lý sản phẩm</h3>
              <p>Thêm, sửa, xóa sản phẩm và kiểm soát tồn kho.</p>
            </Link>
            <Link to="/admin/promotions" className="admin-card-link">
              <span className="card-icon">🎁</span>
              <h3>Quản lý khuyến mãi</h3>
              <p>Thêm, sửa, xóa mã giảm giá, chương trình ưu đãi.</p>
            </Link>
            <Link to="/admin/users" className="admin-card-link">
              <span className="card-icon">👥</span>
              <h3>Quản lý người dùng</h3>
              <p>Xem danh sách, chỉnh sửa vai trò và thông tin người dùng.</p>
            </Link>
            <Link to="/admin/orders" className="admin-card-link">
              <span className="card-icon">🛒</span>
              <h3>Đơn hàng đã bán</h3>
              <p>Xem các đơn đặt hàng, phương thức thanh toán.</p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;