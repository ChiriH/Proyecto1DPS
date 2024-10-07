import axios from 'axios';

// Crear una instancia de Axios con la baseURL que apunta a tu API en XAMPP
const api = axios.create({
  baseURL: 'http://localhost/api/login.php', // Asegúrate de que esta sea la URL correcta de tu backend
  withCredentials: true, // Asegura que las cookies de sesión se envíen en las solicitudes
});

// Interceptor para registrar solicitudes
api.interceptors.request.use(
  (request) => {
    console.log('Iniciando Solicitud', request);
    return request;
  },
  (error) => {
    console.error('Error en la Solicitud', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    console.log('Respuesta Recibida', response);
    return response;
  },
  (error) => {
    console.error('Error en la Respuesta', error);
    // Puedes manejar errores globales aquí, como redireccionar en caso de 401
    return Promise.reject(error);
  }
);

// Función para verificar la sesión
export const checkSession = async () => {
  try {
    const response = await api.get('/session');
    console.log('Sesión verificada:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al verificar la sesión:', error);
    return { loggedIn: false };
  }
};

// Función para cerrar sesión
export const logout = async () => {
  try {
    const response = await api.post('/logout');
    console.log('Sesión cerrada:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return { success: false, message: 'Error al cerrar sesión' };
  }
};

// Función para iniciar sesión
export const login = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    console.log('Inicio de sesión exitoso:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
};

// Función para registrar un nuevo usuario
export const register = async (email, password, name) => {
  try {
    const response = await api.post('/register', { email, password, name });
    console.log('Registro exitoso:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    throw error;
  }
};

// Función para obtener proyectos del usuario autenticado
export const getProyectos = async () => {
  try {
    const response = await api.get('/proyectos');
    console.log('Proyectos obtenidos:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    throw error;
  }
};

// Función para obtener la lista de usuarios
export const getUsuarios = async () => {
  try {
    const response = await api.get('/usuarios');
    console.log('Usuarios obtenidos:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
};

// Función para crear un nuevo proyecto
export const createProyecto = async (proyectoData) => {
  try {
    const response = await api.post('/proyectos', proyectoData);
    console.log('Proyecto creado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al crear proyecto:', error);
    throw error;
  }
};

// Función para actualizar un proyecto existente
export const updateProyecto = async (id, proyectoData) => {
  try {
    const response = await api.put(`/proyectos/${id}`, proyectoData);
    console.log('Proyecto actualizado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar proyecto:', error);
    throw error;
  }
};

// Función para eliminar un proyecto por ID
export const deleteProyecto = async (id) => {
  try {
    const response = await api.delete(`/proyectos/${id}`);
    console.log(`Proyecto con ID ${id} eliminado`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar el proyecto con ID ${id}:`, error);
    throw error;
  }
};

export default api;
