import React, { useEffect, useState } from 'react';
import { checkSession, logout, getProyectos } from './api';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/router';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { isSameDay, parseISO, format } from 'date-fns';

const DashboardScreen = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [proyectos, setProyectos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const verifySession = async () => {
      try {
        const sessionData = await checkSession();
        console.log('Datos de sesión:', sessionData);

        if (sessionData.loggedIn) {
          setLoggedIn(true);
          setUserData(sessionData.user);

          const proyectosAsignados = await getProyectos();
          console.log('Proyectos recibidos:', proyectosAsignados);

          if (proyectosAsignados && proyectosAsignados.length > 0) {
            setProyectos(proyectosAsignados);
            console.log('Proyectos almacenados:', proyectosAsignados);
          } else {
            console.log('No hay proyectos asignados.');
          }
        } else {
          setLoggedIn(false);
          router.push('/login');
        }
      } catch (error) {
        setError('Error al verificar la sesión o cargar los proyectos.');
        console.error('Error al verificar la sesión:', error);
      }
    };

    verifySession();
  }, [router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      setError('Error al cerrar sesión.');
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Función para determinar qué días se deben resaltar en el calendario
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const isToday = isSameDay(date, new Date());

      // Verificar si la fecha es una fecha de inicio de algún proyecto
      const isStartDate = proyectos.some((p) => {
        const startDate = parseISO(p.fecha_inicio);
        return isSameDay(startDate, date);
      });

      // Verificar si la fecha es una fecha de fin de algún proyecto
      const isEndDate = proyectos.some((p) => {
        const endDate = parseISO(p.fecha_fin);
        return isSameDay(endDate, date);
      });

      let classNames = [];
      if (isToday) {
        classNames.push('today');
      }
      if (isStartDate) {
        classNames.push('start-date');
      }
      if (isEndDate) {
        classNames.push('end-date');
      }

      return classNames.length > 0 ? classNames.join(' ') : null;
    }
    return null;
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          {error && <div className="alert alert-danger">{error}</div>}
          {loggedIn ? (
            <>
              <h1 className="display-4">Bienvenido al Dashboard</h1>
              {userData && <p className="lead">Hola, {userData.name}</p>}

              {/* Botones de Cerrar Sesión e Ir a Proyectos */}
              <div className="mt-3">
                <button className="btn btn-danger" onClick={handleLogout}>
                  Cerrar Sesión
                </button>
                <button
                  className="btn btn-primary ml-2"
                  onClick={() => router.push('/proyectos')}
                >
                  Ir a proyectos
                </button>
              </div>

              {/* Sección de Proyectos Asignados */}
              <div className="mt-5">
                <h3>Proyectos Asignados</h3>
                {proyectos.length > 0 ? (
                  <ul className="list-group">
                    {proyectos.map((proyecto) => (
                      <li key={proyecto.id} className="list-group-item">
                        <strong>{proyecto.nombre}</strong>
                        <br />
                        Fecha Inicio: {format(parseISO(proyecto.fecha_inicio), 'Pp')}
                        <br />
                        Fecha Fin: {format(parseISO(proyecto.fecha_fin), 'Pp')}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No tienes proyectos asignados.</p>
                )}
              </div>

              {/* Calendario para mostrar proyectos */}
              <div className="mt-5">
                <h3>Calendario de Proyectos</h3>
                <Calendar
                  value={selectedDate}
                  onChange={setSelectedDate}
                  tileClassName={tileClassName}
                />
              </div>
            </>
          ) : (
            <h1 className="display-4 text-danger">Por favor, inicia sesión</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
