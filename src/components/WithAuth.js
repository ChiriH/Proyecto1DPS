import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { checkSession } from './api'; 

const WithAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();

    useEffect(() => {
      const verifySession = async () => {
        const session = await checkSession();
        if (!session.loggedIn) {
          // Redirigir a la página de inicio de sesión si no está logeado
          router.push('/login');
        }
      };

      verifySession();
    }, [router]);

    return <WrappedComponent {...props} />;
  };
};

export default WithAuth;