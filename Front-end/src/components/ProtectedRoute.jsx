// Importa el componente Navigate de react-router-dom para hacer redirecciones
import { Navigate } from 'react-router-dom';

// Componente funcional que muestra su contenido solo si el usuario ha iniciado sesión
const ProtectedRoute = ({ children }) => {
  // Revisa si el usuario está logueado leyendo el valor guardado en localStorage
  const isLogged = localStorage.getItem('isLogged') === 'true';

  // Si está logueado, muestra el contenido; si no, redirige a /login
  return isLogged ? children : <Navigate to="/login" />;
};


export default ProtectedRoute;
