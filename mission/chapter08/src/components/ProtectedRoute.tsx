import { Navigate, Outlet, useLocation } from 'react-router';
import { ROUTES } from '../constants/paths';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute() {
  const location = useLocation();
  const { loggedIn } = useAuth();

  if (!loggedIn) {
    return <Navigate to={ROUTES.authSignin} replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
