// Importa la librería axios, que permite hacer peticiones HTTP fácilmente
import axios from 'axios';

// Se define la URL base de la API que devuelve la lista de usuarios

const API_URL = "http://localhost:4000/users";

// Exporta una función loginUser que recibe email y contraseña
export const loginUser = async (email, password) => {
  try {
    // Hace una petición para obtener todos los usuarios
    const response = await axios.get(API_URL);

    // Busca dentro del array de usuarios si hay uno que coincida con el email y contraseña dados
    const user = response.data.find(u => u.email === email && u.password === password);

    // Si encontró un usuario con esas credenciales
    if (user) {
      // Guarda una marca en localStorage para indicar que el usuario está autenticado
      localStorage.setItem('isLogged', 'true');

      // Devuelve el objeto del usuario encontrado
      return user;
    } else {
      // Si no se encuentra ningún usuario con esas credenciales, lanza un error 
      throw new Error('Credenciales incorrectas');
    }

  } catch (error) {
    // Si hubo un error en la petición HTTP o cualquier otro fallo, lanza un error genérico
    throw new Error('Error en el servidor o credenciales incorrectas');
  }
};
