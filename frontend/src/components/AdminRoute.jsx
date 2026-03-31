import { Navigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

const AdminRoute = ({ children }) => {
  const { isAdmin } = useAdmin();
  const location = useLocation();

  if (!isAdmin) {
    return <Navigate to="/admin" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default AdminRoute;
