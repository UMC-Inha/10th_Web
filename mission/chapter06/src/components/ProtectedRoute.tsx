import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute() {
  const location = useLocation();
  const { loggedIn } = useAuth();

  if (!loggedIn) {
    return <Navigate to="/auth/signin" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
