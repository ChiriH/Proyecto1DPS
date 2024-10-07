import DashboardScreen from '../components/DashboardScreen';
import Link from 'next/link'; // Para utilizar enlaces de navegación
import WithAuth from '../components/WithAuth'; // Importamos WithAuth

const DashboardPage = () => {
  return (
    <div>
      {/* Renderizamos el contenido del Dashboard */}
      <DashboardScreen />
    </div>
  );
};

// Exportamos la página con la protección de WithAuth
export default WithAuth(DashboardPage);
