// Importamos Bootstrap y los estilos globales
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa Bootstrap globalmente
import '../app/globals.css'; // Si global.css está en src/app

// Este es el componente principal de la aplicación
export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
