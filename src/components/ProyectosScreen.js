import React, { useState, useEffect } from 'react';
import api from './api';  

const ProyectosScreen = () => {
  const [proyectos, setProyectos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioActual, setUsuarioActual] = useState(null); // Estado para almacenar el usuario actual
  const [nuevoProyecto, setNuevoProyecto] = useState({
    nombre: '',
    descripcion: '',
    usuarioAsignado: '', // Aquí guardamos el ID del usuario
    fecha_inicio: '',
    fecha_fin: '',
    estado: 'pendiente',
  });
  const [editando, setEditando] = useState(false);
  const [proyectoActual, setProyectoActual] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const response = await api.get('/proyectos'); // Ruta para obtener todos los proyectos
        console.log('Proyectos obtenidos:', response.data); // Log para depuración
        setProyectos(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        setError('No se pudieron cargar los proyectos');
        console.error('Error al cargar proyectos:', error); // Log para depuración
      }
    };

    const fetchUsuarios = async () => {
      try {
        const response = await api.get('/usuarios'); // Ruta para obtener usuarios
        console.log('Usuarios obtenidos:', response.data); // Log para depuración
        setUsuarios(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        setError('No se pudieron cargar los usuarios');
        console.error('Error al cargar usuarios:', error); // Log para depuración
      }
    };

    const fetchUsuarioActual = async () => {
      try {
        const response = await api.get('/session'); // Ruta para obtener la sesión del usuario actual
        console.log('Usuario actual:', response.data);
        setUsuarioActual(response.data.user); // Almacena el usuario actual en el estado
        setNuevoProyecto((prevState) => ({
          ...prevState,
          usuarioAsignado: response.data.user.id, // Establecemos el ID como valor por defecto
        }));
      } catch (error) {
        console.error('Error al obtener el usuario actual:', error);
      }
    };

    fetchProyectos();
    fetchUsuarios();
    fetchUsuarioActual(); //  usuario actual cuando el componente se monte
  }, []);

  const handleCrearProyecto = async (e) => {
    e.preventDefault();
    
    // Validar que el usuario asignado existe
    const usuario = usuarios.find(u => u.id === parseInt(nuevoProyecto.usuarioAsignado));
    
    if (!usuario) {
      setError('El usuario asignado no existe');
      return;
    }

    try {
      // Crear un nuevo proyecto
      const response = await api.post('/proyectos', { 
        ...nuevoProyecto, 
        usuarioAsignado: usuario.id  // Enviamos el ID del usuario al backend
      });
      console.log('Proyecto creado:', response.data);
      setProyectos([...proyectos, response.data]); // Actualizamos la lista de proyectos con el nuevo proyecto creado
      
      // Reiniciar los valores del formulario
      setNuevoProyecto({
        nombre: '',
        descripcion: '',
        usuarioAsignado: usuarioActual ? usuarioActual.id : '', // Restablece el ID del usuario actual
        fecha_inicio: '',
        fecha_fin: '',
        estado: 'pendiente',
      });
    } catch (error) {
      setError('Error al crear el proyecto');
      console.error('Error al crear proyecto:', error);
    }
  };

  const handleActualizarProyecto = async (e) => {
    e.preventDefault();

    // Validar que el usuario asignado existe
    const usuario = usuarios.find(u => u.id === parseInt(nuevoProyecto.usuarioAsignado));
    
    if (!usuario) {
      setError('El usuario asignado no existe');
      return;
    }

    try {
      // Actualizar proyecto existente
      await api.put(`/proyectos/${proyectoActual.id}`, { 
        ...nuevoProyecto, 
        usuarioAsignado: usuario.id  // Enviamos el ID del usuario al backend
      });
      console.log('Proyecto actualizado');
      // Actualiza el proyecto en la lista
      setProyectos(proyectos.map(p => (p.id === proyectoActual.id ? { ...p, ...nuevoProyecto } : p)));
      
      // Reiniciar los valores del formulario y el estado de edición
      setNuevoProyecto({
        nombre: '',
        descripcion: '',
        usuarioAsignado: usuarioActual ? usuarioActual.id : '', // Restablece el ID del usuario actual
        fecha_inicio: '',
        fecha_fin: '',
        estado: 'pendiente',
      });
      setEditando(false);
      setProyectoActual(null);
    } catch (error) {
      setError('Error al actualizar el proyecto');
      console.error('Error al actualizar proyecto:', error);
    }
  };

  const handleEditarProyecto = (proyecto) => {
    setNuevoProyecto({
      nombre: proyecto.nombre,
      descripcion: proyecto.descripcion,
      usuarioAsignado: proyecto.usuario_asignado ? proyecto.usuario_asignado.toString() : '', // Colocamos el ID del usuario asignado
      fecha_inicio: proyecto.fecha_inicio,
      fecha_fin: proyecto.fecha_fin,
      estado: proyecto.estado || 'pendiente',
    });
    setEditando(true);
    setProyectoActual(proyecto);
  };

  const handleEliminarProyecto = async (id) => {
    try {
      await api.delete(`/proyectos/${id}`); // Ruta para eliminar un proyecto específico
      console.log(`Proyecto con ID ${id} eliminado`); // Log para depuración
      setProyectos(proyectos.filter(proyecto => proyecto.id !== id)); // Filtramos los proyectos para excluir el eliminado
    } catch (error) {
      setError('No se pudo eliminar el proyecto');
      console.error('Error al eliminar proyecto:', error); // Log para depuración
    }
  };

  // Función para obtener el nombre del usuario asignado a un proyecto
  const obtenerNombreUsuario = (usuarioId) => {
    const usuario = usuarios.find(u => u.id === parseInt(usuarioId));
    return usuario ? usuario.name : 'Sin asignar';
  };

  return (
    <div className="container">
      <h1 className="mb-4">Gestión de Proyectos</h1>
      
      <form onSubmit={handleCrearProyecto} className="mb-4">
        <div className="form-group">
          <label>Nombre del Proyecto:</label>
          <input
            type="text"
            value={nuevoProyecto.nombre}
            onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, nombre: e.target.value })}
            className="form-control"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Descripción del Proyecto:</label>
          <textarea
            value={nuevoProyecto.descripcion}
            onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, descripcion: e.target.value })}
            className="form-control"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Usuario Asignado:</label>
            <select
              value={nuevoProyecto.usuarioAsignado}
              onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, usuarioAsignado: e.target.value })}
              className="form-control"
              required
            >
              {usuarios.length === 0 ? (
                <option value="">Cargando usuarios...</option>
              ) : (
                usuarios.map((usuario) => (
                  <option key={usuario.id} value={usuario.id}>
                    {usuario.name}
                  </option>
                ))
              )}
            </select>
        </div>
        
        <div className="form-group">
          <label>Fecha Inicio del Proyecto:</label>
          <input
            type="datetime-local"
            value={nuevoProyecto.fecha_inicio}
            onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, fecha_inicio: e.target.value })}
            className="form-control"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Fecha Fin del Proyecto:</label>
          <input
            type="datetime-local"
            value={nuevoProyecto.fecha_fin}
            onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, fecha_fin: e.target.value })}
            className="form-control"
            required
          />
        </div>
        
        <button type="submit" className="btn btn-primary">
          Crear Proyecto
        </button>
        
        {editando && (
          <button type="button" onClick={handleActualizarProyecto} className="btn btn-secondary ml-2">
            Actualizar Proyecto
          </button>
        )}
      </form>
      
      {error && <p className="text-danger">{error}</p>}

      <ul className="list-group">
        {proyectos.length > 0 ? (
          proyectos.map((proyecto) => (
            <li key={proyecto.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{proyecto.nombre}</strong><br />
                Asignado a: {obtenerNombreUsuario(proyecto.usuario_asignado)}
              </div>
              <div>
                <button
                  className="btn btn-info btn-sm mr-2"
                  onClick={() => handleEditarProyecto(proyecto)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleEliminarProyecto(proyecto.id)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))
        ) : (
          <p>No hay proyectos disponibles.</p>
        )}
      </ul>
    </div>
  );
};

export default ProyectosScreen;
