// Importa hooks de React y navegación de React Router
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Importa el servicio que hace la autenticación (debe estar definido en otro archivo)
import { loginUser } from '../services/AuthService';

const Login = () => {
  // Estados para manejar el input del formulario
  const [email, setEmail] = useState('');        // Email ingresado por el usuario
  const [password, setPassword] = useState('');  // Contraseña ingresada
  const [error, setError] = useState('');        // Mensaje de error si algo sale mal

  // Hook de navegación para redirigir a otras rutas
  const navigate = useNavigate();

  // Función que se ejecuta al enviar el formulario
  const handleLogin = async (e) => {
    e.preventDefault(); // Evita que el formulario recargue la página por defecto

    try {
      // Llama al servicio de autenticación con email y contraseña
      await loginUser(email, password);

      // Si es exitoso, marca el login como "activo" guardando en localStorage
      localStorage.setItem('isLogged', 'true');

      // Redirige a la ruta principal ("/")
      navigate('/');
    } catch (err) {
      // Si hay un error (por ejemplo, credenciales inválidas), muestra el mensaje
      setError(err.message);
    }
  };

  return (
    // Contenedor centrado vertical y horizontalmente
    <div className="flex items-center justify-center h-screen bg-gray-100">
      
      {/* Formulario de login */}
      <form className="bg-white p-6 rounded shadow-md" onSubmit={handleLogin}>
        <h2 className="text-xl font-bold mb-4">Iniciar Sesión</h2>

        {/* Muestra el mensaje de error si existe */}
        {error && <p className="text-red-500 mb-2">{error}</p>}

        {/* Input para el correo electrónico */}
        <input
          className="w-full p-2 border rounded mb-3"
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}  // Actualiza el estado al escribir
          required
        />

        {/* Input para la contraseña */}
        <input
          className="w-full p-2 border rounded mb-3"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}  // Actualiza el estado
          required
        />

        {/* Botón para enviar el formulario */}
        <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
          Entrar
        </button>
      </form>
    </div>
  );
};

// Exporta el componente para que pueda ser usado en la app
export default Login;
