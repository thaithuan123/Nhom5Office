import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext();
const AUTH_USERS_KEY = 'phonehub_registered_users';
const AUTH_CURRENT_USER_KEY = 'phonehub_current_user';
const demoUser = {
  id: 1,
  name: 'Khách hàng demo',
  email: 'user@phonehub.com',
  password: 'user123',
};

export const AuthProvider = ({ children }) => {
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    if (typeof window === 'undefined') {
      return [demoUser];
    }

    try {
      const storedUsers = window.localStorage.getItem(AUTH_USERS_KEY);
      return storedUsers ? JSON.parse(storedUsers) : [demoUser];
    } catch {
      return [demoUser];
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      const storedUser = window.localStorage.getItem(AUTH_CURRENT_USER_KEY);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(registeredUsers));
    }
  }, [registeredUsers]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (currentUser) {
      window.localStorage.setItem(AUTH_CURRENT_USER_KEY, JSON.stringify(currentUser));
    } else {
      window.localStorage.removeItem(AUTH_CURRENT_USER_KEY);
    }
  }, [currentUser]);

  const registerUser = ({ name, email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();

    if (registeredUsers.some((user) => user.email === normalizedEmail)) {
      return { success: false, message: 'Email này đã được đăng ký.' };
    }

    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: normalizedEmail,
      password,
    };

    setRegisteredUsers((prev) => [...prev, newUser]);
    setCurrentUser({ id: newUser.id, name: newUser.name, email: newUser.email });
    return { success: true };
  };

  const loginUser = ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const matchedUser = registeredUsers.find(
      (user) => user.email === normalizedEmail && user.password === password
    );

    if (!matchedUser) {
      return { success: false, message: 'Sai email hoặc mật khẩu.' };
    }

    setCurrentUser({
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
    });

    return { success: true };
  };

  const logoutUser = () => setCurrentUser(null);

  const value = useMemo(() => ({
    currentUser,
    isAuthenticated: Boolean(currentUser),
    loginUser,
    registerUser,
    logoutUser,
    demoCredentials: {
      email: demoUser.email,
      password: demoUser.password,
    },
  }), [currentUser, registeredUsers]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
