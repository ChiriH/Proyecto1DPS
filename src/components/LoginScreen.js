 
import React, { useState } from 'react';
import api from './api'; // importa la configuración de Axios
import { useRouter } from 'next/router';

const LoginScreen = () => {
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await api.post('http://localhost/api/login.php/login', {
                email: userEmail,
                password: userPassword,
            });
            console.log(response.data);
            alert('Inicio de sesión exitoso');
            // Redirigir al dashboard 
            router.push('/dashboard');
        } catch (error) {
            console.error('Hubo un problema con el inicio de sesión.', error);
            alert('Credenciales inválidas', error);
        }
    };

    return (
        <form onSubmit={handleLogin}>
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
            <button type="submit">Iniciar Sesión</button>
        </form>
    );
};

export default LoginScreen;
