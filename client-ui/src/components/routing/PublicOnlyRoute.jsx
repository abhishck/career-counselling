import { Navigate, Outlet } from 'react-router-dom';
import Loader from '../ui/Loader.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function PublicOnlyRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loader fullScreen />;

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
