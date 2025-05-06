// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  
  // Mientras verifica la autenticación, puede mostrar un spinner
  if (loading) {
    return <div>Cargando...</div>;
  }
  
  // Si no está autenticado, redirige al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Si está autenticado, muestra el contenido de la ruta
  return <Outlet />;
};

export default ProtectedRoute;
