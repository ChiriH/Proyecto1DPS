"use client"; // Indica que este es un componente del lado del cliente

import { useRouter } from 'next/navigation'; 
import 'bootstrap/dist/css/bootstrap.min.css';  
import styles from "./page.module.css"; // Estilos personalizados

export default function Home() {
  const router = useRouter(); // Instancia de useRouter para manejar la navegación

  const handleLoginClick = () => {
    router.push('/login'); // Redirigir a la página de Login
  };

  const handleRegisterClick = () => {
    router.push('/register'); // Redirigir a la página de Registro
  };

  return (
    <div className="container mt-5">
      <main className="text-center">
        <h1 className="display-4 mb-4">Bienvenido al Sistema de Gestión de Proyectos</h1>
        <p className="lead mb-4">Por favor, selecciona una opción para comenzar:</p>

        <div className="d-flex justify-content-center gap-3">
          <button onClick={handleLoginClick} className="btn btn-primary btn-lg">
            Iniciar Sesión
          </button>
          <button onClick={handleRegisterClick} className="btn btn-secondary btn-lg">
            Registrarse
          </button>
        </div>
      </main>

      <footer className="text-center mt-5">
        <p>Proyecto 1 - Sistema de Gestión de Proyectos</p>
      </footer>
    </div>
  );
}
