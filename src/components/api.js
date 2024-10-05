import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost/api/login.php',
  withCredentials: true, // Asegura que las cookies de sesión se envíen
});

// Función para verificar la sesión
export const checkSession = async () => {
  try {
    const response = await api.get('/session', { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error al verificar la sesión:', error);
    return { loggedIn: false };
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/logout');
    console.log('Sesión cerrada');
    return response.data; // Respuesta del backend
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
};

export default api;