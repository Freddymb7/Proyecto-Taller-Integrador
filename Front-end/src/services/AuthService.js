// Importa la librería axios, que permite hacer peticiones HTTP fácilmente
import axios from 'axios';

// Cambiar 
const API_URL = "https://tu-ngrok-id.ngrok.io/api";

// Función para iniciar sesión
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password
    });

    if (response.data.success) {
      // Guarda la sesión en localStorage
      localStorage.setItem('isLogged', 'true');
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data.user;
    } else {
      throw new Error(response.data.error || 'Credenciales incorrectas');
    }
  } catch (error) {
    throw new Error('Error al conectar con el servidor');
  }
};
