import React, { useState } from 'react';
import api from './api'; // Importa la configuración de Axios
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css'; // importar Bootstrap

const RegisterScreen = () => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userName, setUserName] = useState(''); // Nuevo campo para el nombre
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post('/register', {
        email: userEmail,
        password: userPassword,
        name: userName,
        role: 'miembro', // Agregamos el rol 'miembro' al enviar los datos
      });
      
      console.log(response.data); // Muestra la respuesta de la API
      alert('Registro exitoso');
      router.push('/login'); // Redirige al usuario a la página de inicio de sesión
    } catch (error) {
      console.error('Hubo un problema con el registro.', error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Hubo un problema con el registro, intente de nuevo.');
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Registrar Cuenta</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label htmlFor="name">Nombre</label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="Introduce tu nombre"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
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
          Registrar
        </button>
      </form>
    </div>
  );
};

export default RegisterScreen;
