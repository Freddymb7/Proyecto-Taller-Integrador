import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/AuthService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // limpia errores anteriores

    try {
      const user = await loginUser(email, password); // llama a backend Flask vía AuthService

      // Si llega aquí, el login fue exitoso
      console.log('Usuario autenticado:', user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form className="bg-white p-6 rounded shadow-md" onSubmit={handleLogin}>
        <h2 className="text-xl font-bold mb-4">Iniciar Sesión</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          className="w-full p-2 border rounded mb-3"
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="w-full p-2 border rounded mb-3"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;
