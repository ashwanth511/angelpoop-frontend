import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useTonConnectUI } from '@tonconnect/ui-react';

export const AuthGuard = () => {
  const [tonConnectUI] = useTonConnectUI();
  const location = useLocation();

  if (!tonConnectUI.connected) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
};