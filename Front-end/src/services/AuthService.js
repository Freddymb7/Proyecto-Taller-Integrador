import axios from 'axios';

const API_URL = "http://localhost:4000/users";

export const loginUser = async (email, password) => {
  try {
    const response = await axios.get(API_URL);
    const user = response.data.find(u => u.email === email && u.password === password);
    
    if (user) {
      localStorage.setItem('isLogged', 'true');
      return user;
    } else {
      throw new Error('Credenciales incorrectas');
    }
  } catch (error) {
    throw new Error('Error en el servidor o credenciales incorrectas');
  }
};
