import { Navigate } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth';

export const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
};

export const SecureRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/secure" />;
  }

  return children;
};


