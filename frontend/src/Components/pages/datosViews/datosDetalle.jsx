import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './datosDetalle.css'; // Importa el archivo CSS
import { format, parseISO } from 'date-fns'; // Importa las funciones format y parseISO de date-fns

// Función para obtener la clase CSS según el estado
function getClassForEstado(estado) {
  switch (estado) {
    case 'Pendiente':
      return 'estado-pendiente';
    case 'Completado':
    case 'Facturado':
    case 'Pegado':
      return 'estado-completado';
    case 'Incompleto':
      return 'estado-incompleto';
    default:
      return '';
  }
}

function DatosDetalle() {
  const [dataCliente, setDataCliente] = useState([]);
  const [dataEstado, setDataEstado] = useState([]);
  const [dataVisita, setDataVisita] = useState([]);
  const [dataEquipamiento, setDataEquipamiento] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener el id de la visita de las props
  const { id } = useParams();

  useEffect(() => {
    axios.get("http://localhost:8081/cliente")
      .then(res => {
        setDataCliente(res.data);
      })
      .catch(error => {
        setError("Error al cargar datos de cliente");
      });

    axios.get("http://localhost:8081/estado")
      .then(res => {
        setDataEstado(res.data);
      })
      .catch(error => {
        setError("Error al cargar datos de estado");
      });
    
    axios.get("http://localhost:8081/equipamiento")
      .then(res => {
        setDataEquipamiento(res.data); // Establece los datos del equipamiento
      })
      .catch(error => {
        setError("Error al cargar datos de equipamiento");
      });

    axios.get("http://localhost:8081/visita")
      .then(res => {
        setDataVisita(res.data);
        setLoading(false);
      })
      .catch(error => {
        setError("Error al cargar datos de visita");
      });
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  const visitaActual = dataVisita.find(visita => visita.IdVisita === parseInt(id));
  const IdClienteVisitaActual = visitaActual ? visitaActual.IdCliente : ''; 
  const clienteActual = dataCliente.find(cliente => cliente.IdCliente === IdClienteVisitaActual);
  const nombreCliente = clienteActual ? clienteActual.Nombre : '';
  const direccionCliente = clienteActual ? clienteActual.Direccion: ''; 
  const dniCliente = clienteActual ? clienteActual.DNI: '';
  const ciudadCliente = clienteActual ? clienteActual.Ciudad: '';
  const telefonoCliente= clienteActual ? clienteActual.Telefono: '';
  const equipaminetoCliente = clienteActual ? clienteActual.Equipamiento: '';

  const precioVisita = visitaActual ? visitaActual.Precio: '';
  const descripcionVisita = visitaActual ? visitaActual.Descripcion: '';
  
  const fechaVisita = visitaActual ? visitaActual.Fecha: '';
  let fechaFormateada;

if (fechaVisita === null) {
  fechaFormateada = "-";
} else {
  const fechaISO = parseISO(fechaVisita);
  if (isNaN(fechaISO.getTime())) {
    fechaFormateada = "-";
  } else {
    fechaFormateada = format(fechaISO, 'dd-MM-yyyy');
  }
}


  const IdEstadoVisitaActual = visitaActual ? visitaActual.IdEstado: '';
  const estadoActual = dataEstado.find(estado => estado.IdEstado === IdEstadoVisitaActual);
  const estadoVisita = estadoActual ? estadoActual.Estado : '';

  const IdEquipamientoVisita = visitaActual ? visitaActual.IdEquipamineto: '';
  const equipaminetoActual = dataEquipamiento.find(equipamineto => equipamineto.IdEsquipamiento === IdEquipamientoVisita);
  const equipamientoVisita = equipaminetoActual ? equipaminetoActual.Nombre:'';

  return (
    <div className="container">
      <h1 className="mt-4">Detalles de la Visita</h1>
      <p>ID: {id}</p>
      <div className="form-group detalle-item fecha-estado fecha-visita">
        <label className="font-weight-bold">Fecha: {fechaFormateada} </label>
      </div>
      <div className={`form-group detalle-item estado-texto ${getClassForEstado(estadoVisita)} fecha-estado`}>
        <label className="font-weight-bold label">ESTADO: <span className="">{estadoVisita.toUpperCase()}</span></label>
        
    </div>

    <div className="row">
      <div className="col-md-6 detalle-div">
        <div className="form-group detalle-item">
          <label className="font-weight-bold">DNI del Cliente:</label>
          <span className="ml-2">{dniCliente}</span>
        </div>
          <div className="form-group detalle-item">
            <label className="font-weight-bold">Nombre del Cliente:</label>
            <span className="ml-2">{nombreCliente}</span>
          </div>
          <div className="form-group detalle-item">
            <label className="font-weight-bold">Teléfono del Cliente:</label>
            <span className="ml-2">{telefonoCliente}</span>
          </div>
          <div className="form-group detalle-item">
            <label className="font-weight-bold">Ciudad del Cliente:</label>
            <span className="ml-2">{ciudadCliente}</span>
          </div>
          <div className="form-group detalle-item">
            <label className="font-weight-bold">Dirección del Cliente:</label>
            <span className="ml-2">{direccionCliente}</span>
          </div>
          <div className="form-group detalle-item">
            <label className="font-weight-bold">Equipamiento del Cliente:</label>
            <span className="ml-2">{equipaminetoCliente}</span>
          </div>
          
        </div>
        <div className="col-md-6 detalle-div">
          
          <div className="form-group detalle-item">
            <label className="font-weight-bold">Equipamiento: </label>
            <span>{equipamientoVisita}</span>
          </div>      
          <div className="form-group detalle-item">
            <label className="font-weight-bold">Descripción de la Visita:</label>
            <span>{descripcionVisita}</span>
          </div>      
          <div className="form-group detalle-item">
            <label
            className="font-weight-bold">Precio de la Visita: </label>
            <span>${precioVisita}</span>
          </div>
        </div>
      </div> 
    </div>
  ); 
}

export default DatosDetalle;