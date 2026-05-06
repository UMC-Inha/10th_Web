import { Navigate, Outlet, useLocation } from 'react-router';
import { isAuthenticated } from '../utils/authToken';

function ProtectedRoute() {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/auth/signin" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
