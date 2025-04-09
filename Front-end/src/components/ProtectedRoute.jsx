// Importa el componente Navigate de react-router-dom para hacer redirecciones
import { Navigate } from 'react-router-dom';

// Componente funcional que recibe como "hijo" lo que debe renderizar si el usuario está logueado
const ProtectedRoute = ({ children }) => {
  // Revisa si el usuario está logueado leyendo el valor guardado en localStorage
  const isLogged = localStorage.getItem('isLogged') === 'true';

  // Si está logueado, muestra el contenido; si no, redirige a /login
  return isLogged ? children : <Navigate to="/login" />;
};


export default ProtectedRoute;
