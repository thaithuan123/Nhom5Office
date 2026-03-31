import { useMemo, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Auth = () => {
  const location = useLocation();
  const { isAuthenticated, loginUser, registerUser } = useAuth();
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const redirectTo = useMemo(() => location.state?.from || '/', [location.state]);

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const result = loginUser(loginForm);
    if (!result.success) {
      setError(result.message);
    } else {
      setError('');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Mật khẩu xác nhận chưa khớp.');
      return;
    }

    const result = registerUser(registerForm);
    if (!result.success) {
      setError(result.message);
    } else {
      setError('');
    }
  };

  return (
    <main className="auth-page">
      <div className="container auth-layout">
        <section className="auth-hero-card">
          <span className="auth-badge">PhoneHub Access</span>
          <h1>Đăng nhập hoặc đăng ký trước khi vào web chính</h1>
          <p>
            Người dùng cần đăng nhập để xem sản phẩm, thêm vào giỏ hàng và đặt đơn. Admin có menu riêng để quản trị dữ liệu hệ thống.
          </p>

          <div className="auth-links">
            <Link className="btn btn-secondary" to="/admin">
              Vào khu vực admin
            </Link>
          </div>
        </section>

        <section className="auth-form-card">
          <div className="auth-tabs">
            <button
              type="button"
              className={mode === 'login' ? 'active' : ''}
              onClick={() => {
                setMode('login');
                setError('');
              }}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              className={mode === 'register' ? 'active' : ''}
              onClick={() => {
                setMode('register');
                setError('');
              }}
            >
              Đăng ký
            </button>
          </div>

          {error && <p className="error-text">{error}</p>}

          {mode === 'login' ? (
            <form className="auth-form" onSubmit={handleLoginSubmit}>
              <div className="input-group">
                <label>Email</label>
                <input name="email" type="email" value={loginForm.email} onChange={handleLoginChange} required />
              </div>
              <div className="input-group">
                <label>Mật khẩu</label>
                <input name="password" type="password" value={loginForm.password} onChange={handleLoginChange} required />
              </div>
              <button className="btn btn-primary" type="submit">Vào web ngay</button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleRegisterSubmit}>
              <div className="input-group">
                <label>Họ và tên</label>
                <input name="name" value={registerForm.name} onChange={handleRegisterChange} required />
              </div>
              <div className="input-group">
                <label>Email</label>
                <input name="email" type="email" value={registerForm.email} onChange={handleRegisterChange} required />
              </div>
              <div className="input-group">
                <label>Mật khẩu</label>
                <input name="password" type="password" value={registerForm.password} onChange={handleRegisterChange} required />
              </div>
              <div className="input-group">
                <label>Xác nhận mật khẩu</label>
                <input name="confirmPassword" type="password" value={registerForm.confirmPassword} onChange={handleRegisterChange} required />
              </div>
              <button className="btn btn-primary" type="submit">Tạo tài khoản và vào web</button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
};

export default Auth;
