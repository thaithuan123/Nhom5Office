import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const location = useLocation();
  const { isAdmin, adminUser, loginAsAdmin, logoutAdmin } = useAdmin();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const redirectMessage = useMemo(() => {
    if (!location.state?.from) {
      return '';
    }
    return `Bạn cần đăng nhập admin để vào ${location.state.from}.`;
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = loginAsAdmin(form);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setError('');
  };

  if (!isAdmin) {
    return (
      <main className="admin-page">
        <div className="container admin-auth-layout">
          <section className="admin-auth-card">
            <span className="eyebrow">Khu vực quản trị</span>
            <h1>Đăng nhập admin</h1>
            <p>
              Chỉ tài khoản quản trị mới được truy cập các chức năng như quản lý sản phẩm và quản lý người dùng.
            </p>

            {redirectMessage && <p className="admin-note">{redirectMessage}</p>}
            {error && <p className="error-text">{error}</p>}

            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Email admin</label>
                <input name="email" value={form.email} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Mật khẩu</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} required />
              </div>
              <button className="btn btn-primary" type="submit">Đăng nhập quản trị</button>
            </form>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="container admin-dashboard">
        <div className="admin-header-block">
          <div>
            <span className="eyebrow">Menu admin</span>
            <h1>Xin chào, {adminUser.name}</h1>
            <p>Chọn một chức năng quản trị để cập nhật dữ liệu của hệ thống.</p>
          </div>
          <button className="btn btn-secondary" type="button" onClick={logoutAdmin}>
            Đăng xuất admin
          </button>
        </div>

        <div className="admin-card-grid">
          <Link to="/admin/products" className="admin-card-link">
            <h2>Quản lý sản phẩm</h2>
            <p>Thêm, sửa, xóa sản phẩm và kiểm soát tồn kho trong cửa hàng.</p>
          </Link>
          <Link to="/admin/users" className="admin-card-link">
            <h2>Quản lý người dùng</h2>
            <p>Xem danh sách nhân sự, chỉnh sửa vai trò và cập nhật thông tin người dùng.</p>
          </Link>
          <Link to="/products" className="admin-card-link">
            <h2>Xem trang sản phẩm</h2>
            <p>Kiểm tra giao diện khách hàng đang hiển thị sản phẩm ngoài trang công khai.</p>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
