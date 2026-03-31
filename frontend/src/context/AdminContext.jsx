import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AdminContext = createContext();
const ADMIN_STORAGE_KEY = 'phonehub_admin_session';
const DEMO_ADMIN_EMAIL = 'admin@phonehub.com';
const DEMO_ADMIN_PASSWORD = 'admin123';

export const AdminProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      const storedUser = window.localStorage.getItem(ADMIN_STORAGE_KEY);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (adminUser) {
      window.localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminUser));
    } else {
      window.localStorage.removeItem(ADMIN_STORAGE_KEY);
    }
  }, [adminUser]);

  const value = useMemo(() => ({
    adminUser,
    isAdmin: Boolean(adminUser),
    loginAsAdmin: ({ email, password }) => {
      if (email.trim().toLowerCase() !== DEMO_ADMIN_EMAIL || password !== DEMO_ADMIN_PASSWORD) {
        return {
          success: false,
          message: 'Sai tài khoản hoặc mật khẩu admin demo.',
        };
      }

      const nextUser = {
        name: 'Quản trị viên PhoneHub',
        email: DEMO_ADMIN_EMAIL,
      };

      setAdminUser(nextUser);
      return { success: true };
    },
    logoutAdmin: () => setAdminUser(null),
    demoCredentials: {
      email: DEMO_ADMIN_EMAIL,
      password: DEMO_ADMIN_PASSWORD,
    },
  }), [adminUser]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};
