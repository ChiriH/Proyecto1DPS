import React, { useState } from 'react';
import api from './api'; // Importa la configuración de Axios
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de importar Bootstrap

const LoginScreen = () => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post('/login', {
        email: userEmail,
        password: userPassword,
      });
  
      if (response.data.message === 'Inicio de sesión exitoso') {
        // Re-verificar la sesión para asegurar que el usuario está logueado
        const sessionCheck = await api.get('/session');
        console.log('Resultado de la verificación de sesión:', sessionCheck.data);
  
        if (sessionCheck.data.loggedIn) {
          // Si la sesión es válida, redirigir al dashboard
          alert('Inicio de sesión exitoso');
          router.push('/dashboard');
        } else {
          setError('Error al iniciar sesión. Intente de nuevo.');
        }
      } else {
        setError('Error al iniciar sesión.');
      }
    } catch (error) {
      console.error('Hubo un problema con el inicio de sesión.', error.response?.data);
      setError(error.response?.data?.error || 'Error desconocido al iniciar sesión');
    }
  };
  

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Iniciar Sesión</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Introduce tu correo"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Introduce tu contraseña"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
};

export default LoginScreen;
