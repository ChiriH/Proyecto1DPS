export const metadata = {
  title: 'Gestión de Proyectos',
  description: 'Sistema de gestión de proyectos y tareas',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}