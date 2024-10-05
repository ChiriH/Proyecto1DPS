import React, { useEffect, useState } from 'react';
import { checkSession } from './api';

const DashboardScreen = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const sessionData = await checkSession();
        if (sessionData.loggedIn) {
          setLoggedIn(true); // Usuario está logeado
        } else {
          setLoggedIn(false); // Usuario no está logeado
        }
      } catch (error) {
        alert("Error al verificar la sesión", error);
        console.error('Error al verificar la sesión:', error);
      }
    };

    verifySession();
  }, []);

  return (
    <div>
      {loggedIn ? (
        <h1>Bienvenido al Dashboard</h1>
      ) : (
        <h1>Por favor, inicia sesión</h1>
      )}
    </div>
  );
};



export default DashboardScreen;