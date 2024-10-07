import ProyectosScreen from '../components/ProyectosScreen';
import WithAuth from '../components/WithAuth'; // Importa el componente de autenticación

const ProyectosPage = () => {
  return (
    <div>
      <ProyectosScreen />
    </div>
  );
};

// Proteger la página de proyectos para que solo usuarios autenticados puedan acceder
export default WithAuth(ProyectosPage);
