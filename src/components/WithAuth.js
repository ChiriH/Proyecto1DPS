import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { checkSession } from './api'; // Función que verifica si hay una sesión activa

const WithAuth = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const router = useRouter();

    useEffect(() => {
      const verifySession = async () => {
        const sessionData = await checkSession();
        console.log('Sesión verificada:', sessionData); // Agrega este log para depurar
        if (!sessionData.loggedIn) {
          router.push('/login');
        }
      };
    
      verifySession();
    }, []);

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default WithAuth;
