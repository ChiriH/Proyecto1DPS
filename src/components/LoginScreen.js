// src/components/LoginScreen.js
import React, { useState } from 'react';
import api from './api'; // importa la configuración de Axios
import { useRouter } from 'next/router';

const LoginScreen = () => {
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

     
};

export default LoginScreen;
