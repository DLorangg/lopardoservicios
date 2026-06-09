import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './datosDetalle.css';
import { format, parseISO } from 'date-fns';

function getClassForEstado(estado) {
  switch (estado) {
    case 'Pendiente':
      return 'estado-pendiente';
    case 'Completado':
      return 'estado-completado';
    case 'Facturado':
      return 'estado-facturado';
    case 'Pagado':
      return 'estado-pagado';
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
  const [dataPersonal, setDataPersonal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const userRole = localStorage.getItem('userRole'); // Obtener el rol del usuario

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientes, estados, equipamientos, visitaDetalle, personal] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/getCliente.php`),
          axios.get(`${import.meta.env.VITE_API_URL}/getEstado.php`),
          axios.get(`${import.meta.env.VITE_API_URL}/getEquipamiento.php`),
          axios.get(`${import.meta.env.VITE_API_URL}/getVisitaDetalle.php?idVisita=${id}`),
          axios.get(`${import.meta.env.VITE_API_URL}/getPersonal.php`)
        ]);

        setDataCliente(clientes.data);
        setDataEstado(estados.data);
        setDataEquipamiento(equipamientos.data);
        setDataVisita(visitaDetalle.data); // visitaDetalle.data debería ser un objeto, no un array
        setDataPersonal(personal.data);
        setLoading(false);
      } catch (error) {
        setError("Error al cargar datos");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  const visitaActual = dataVisita || {}; // dataVisita es un objeto, no un array

  const IdClienteVisitaActual = visitaActual.IdCliente || '-';
  const clienteActual = dataCliente.find(cliente => cliente.IdCliente === IdClienteVisitaActual) || {};
  const nombreCliente = clienteActual.Nombre || '-';
  const razonSocial = clienteActual.RazonSocial || '-';
  const direccionCliente = clienteActual.Direccion || '-';
  const dniCliente = clienteActual.DNI || '-';
  const ciudadCliente = clienteActual.Ciudad || '-';
  const telefonoCliente = clienteActual.Telefono || '-';
  const equipamientoCliente = clienteActual.Equipamiento || '-';
  const emailCliente = clienteActual.Email || '-';
  const emailCliente2 = clienteActual.Email2 || '-';

  const garantiaVisita = visitaActual.Garantia === 1 ? "Si" : "No";
  const precioVisita = visitaActual.Precio || '-';
  const descripcionVisita = visitaActual.Descripcion || '';
  const formaPago = visitaActual.FormaPago === 0 ? "Efectivo" : 
                  visitaActual.FormaPago === 1 ? "Transferencia" : 
                  visitaActual.FormaPago === 2 ? "Cheque" : 
                  "-";

  const NumeroCheque = visitaActual.NumeroCheque || '-';
  const NumeroFactura = visitaActual.NumeroFactura || '-';

  const getPersonalNames = (idPersonalString) => {
    if (!idPersonalString) return '';
    const idPersonalArray = idPersonalString.split(',');
    const names = idPersonalArray.map(id => {
      const personal = dataPersonal.find(p => p.IdPersonal.toString() === id.trim());
      return personal ? personal.Nombre : '';
    }).filter(name => name !== '');

    if (names.length === 0) return '';
    if (names.length === 1) return names[0];
    return names.slice(0, -1).join(', ') + ' y ' + names[names.length - 1];
  };

  const nombresPersonalFormateados = getPersonalNames(visitaActual.IdPersonal || '-');

  const fechaVisita = visitaActual.Fecha ? parseISO(visitaActual.Fecha) : null;
  const fechaFormateada = fechaVisita && !isNaN(fechaVisita.getTime()) ? format(fechaVisita, 'dd-MM-yyyy') : "-";

  const fechaCobro = visitaActual.FechaCobro ? parseISO(visitaActual.FechaCobro) : null;
  const fechaCobroFormateada = fechaCobro && !isNaN(fechaCobro.getTime()) ? format(fechaCobro, 'dd-MM-yyyy') : "-";

  const estadoVisita = dataEstado.find(estado => estado.IdEstado === visitaActual.IdEstado) || {};
  const estadoVisitaNombre = estadoVisita.Estado || '-';

  const getEquipamientoNames = (idEquipamientoString) => {
    if (typeof idEquipamientoString !== 'string' || !idEquipamientoString.trim()) return ''; 
    const idEquipamientoArray = idEquipamientoString.split(',');
    const names = idEquipamientoArray.map(id => {
      const equipamiento = dataEquipamiento.find(e => e.IdEquipamiento.toString() === id.trim());
      return equipamiento ? equipamiento.Nombre : '';
    }).filter(name => name !== '');
  
    if (names.length === 0) return '';
    if (names.length === 1) return names[0];
    return names.slice(0, -1).join(', ') + ' y ' + names[names.length - 1];
  };
  
  const equipamientoVisitaNombre = getEquipamientoNames(visitaActual.IdEquipamiento || '');
  

  const baseUrl = import.meta.env.VITE_API_URL.replace('/backend/routes', '').replace('/routes', '');

  return (
    <div className="main-content-container container p-4 mt-4 datos-detalle">
      <p>ID: {id}</p>
      <div className="form-group detalle-item fecha-estado fecha-visita">
        <label className="font-weight-bold">Fecha: {fechaFormateada} </label>
      </div>
      <div className={`form-group detalle-item estado-texto ${getClassForEstado(estadoVisitaNombre)} fecha-estado`}>
        <label className="font-weight-bold label">ESTADO: <span className="">{estadoVisitaNombre.toUpperCase()}</span></label>
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
            <label className="font-weight-bold">Razón social:</label>
            <span className="ml-2">{razonSocial}</span>
          </div>
          <div className="form-group detalle-item">
            <label className="font-weight-bold">Teléfono del Cliente:</label>
            <span className="ml-2">{telefonoCliente}</span>
          </div>
          <div className="form-group detalle-item">
            <label className="font-weight-bold">Ciudad:</label>
            <span className="ml-2">{ciudadCliente}</span>
          </div>
          <div className="form-group detalle-item">
            <label className="font-weight-bold">Dirección del Cliente:</label>
            <span className="ml-2">{direccionCliente}</span>
          </div>
          <div className="form-group detalle-item">
            <label className="font-weight-bold">Email:</label>
            <span className="ml-2">{emailCliente}</span>
          </div>
          <div className="form-group detalle-item">
            <label className="font-weight-bold">Email 2:</label>
            <span className="ml-2">{emailCliente2}</span>
          </div>
          
          
        </div>
        <div className="col-md-6 detalle-div">
          <div className="form-group detalle-item">
            <label className="font-weight-bold">Personal que asistió:</label>
            <span className="ml-2">{nombresPersonalFormateados}</span>
          </div>
          <div className="form-group detalle-item">
            <label className="font-weight-bold">Descripción de la Visita:</label>
            <span>{descripcionVisita}</span>
          </div>
          <div className="form-group detalle-item">
            <label className="font-weight-bold">Garantía: </label>
            <span>{garantiaVisita}</span>
          </div>
          {userRole !== '2' && (
            <div className="form-group detalle-item">
              <label className="font-weight-bold">Precio de la visita:</label>
              <span className="ml-2">${precioVisita}</span>
            </div>
          )}

          <div className="form-group detalle-item">
            <label className="font-weight-bold">Número de factura: </label>
            <span>{NumeroFactura}</span>
          </div>

          <div className="form-group detalle-item">
            <label className="font-weight-bold">Forma de pago: </label>
            <span>{formaPago}</span>
          </div>

          <div className="form-group detalle-item">
            <label className="font-weight-bold">Número de cheque: </label>
            <span>{NumeroCheque}</span>
          </div>

          <div className="form-group detalle-item">
          <label className="font-weight-bold">Adjuntos: </label>
          <div>
            {visitaActual.adjuntos && visitaActual.adjuntos.length > 0 ? (
              visitaActual.adjuntos.map((adjunto, index) => {
                const fileUrl = baseUrl + adjunto.URL;
                const isImage = fileUrl.match(/\.(jpeg|jpg|png)$/i);
                return (
                  <div key={index} style={{ display: 'inline-block', marginRight: '10px', verticalAlign: 'middle' }}>
                    {isImage ? (
                      <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                        <img
                          src={fileUrl}
                          alt="Adjunto"
                          style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ccc' }}
                        />
                      </a>
                    ) : (
                      <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-info btn-sm">
                        Ver Documento
                      </a>
                    )}
                  </div>
                );
              })
            ) : (
              <p>No hay adjuntos.</p>
            )}
          </div>
        </div>
        <div className="form-group detalle-item">
          <label className="font-weight-bold">Fecha de cobro:</label>
          <span className="ml-2">{fechaCobroFormateada}</span>
        </div>
      </div>
    </div>
  </div>
);
}

export default DatosDetalle;
