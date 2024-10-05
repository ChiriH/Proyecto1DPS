import React, { useState } from 'react';
import api from './api'; // Importa la configuración de Axios
import { useRouter } from 'next/router';

const RegisterScreen = () => {
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const router = useRouter();

    const handleRegister = async (event) => {
        event.preventDefault();
        try {
          const response = await api.post('http://localhost/api/login.php/register', {
            email: userEmail, // Asigna el valor de email del formulario
            password: userPassword // Asigna el valor de la contraseña del formulario
          });
          console.log(response.data); // Muestra la respuesta de la API
          alert('Registro exitoso');
          router.push('/login');
        } catch (error) {
          console.error('Hubo un problema con el registro.', error);
        }
    };

    return (
        <form onSubmit={handleRegister}>
            <input
                type="email"
                placeholder="Email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Contraseña"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                required
            />
            <button type="submit">Registrar</button>
        </form>
    );
};

export default RegisterScreen;