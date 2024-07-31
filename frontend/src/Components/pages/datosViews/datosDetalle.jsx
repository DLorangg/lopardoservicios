import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
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
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState('');

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientes, estados, equipamientos, visitaDetalle, personal] = await Promise.all([
          axios.get("http://localhost:8081/cliente"),
          axios.get("http://localhost:8081/estado"),
          axios.get("http://localhost:8081/equipamiento"),
          axios.get(`http://localhost:8081/visitadetalle?idDato=${id}`),
          axios.get("http://localhost:8081/personal")
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

  const IdClienteVisitaActual = visitaActual.IdCliente || '';
  const clienteActual = dataCliente.find(cliente => cliente.IdCliente === IdClienteVisitaActual) || {};
  const nombreCliente = clienteActual.Nombre || '';
  const direccionCliente = clienteActual.Direccion || '';
  const dniCliente = clienteActual.DNI || '';
  const ciudadCliente = clienteActual.Ciudad || '';
  const telefonoCliente = clienteActual.Telefono || '';
  const equipamientoCliente = clienteActual.Equipamiento || '';

  const garantiaVisita = visitaActual.Garantia === 1 ? "Si" : "No";
  const precioVisita = visitaActual.Precio || '';
  const descripcionVisita = visitaActual.Descripcion || '';
  const formaPago = visitaActual.FormaPago === 1 ? "Transferencia" : "Efectivo";

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

  const nombresPersonalFormateados = getPersonalNames(visitaActual.IdPersonal || '');

  const fechaVisita = visitaActual.Fecha ? parseISO(visitaActual.Fecha) : null;
  const fechaFormateada = fechaVisita && !isNaN(fechaVisita.getTime()) ? format(fechaVisita, 'dd-MM-yyyy') : "-";

  const fechaCobro = visitaActual.FechaCobro ? parseISO(visitaActual.FechaCobro) : null;
  const fechaCobroFormateada = fechaCobro && !isNaN(fechaCobro.getTime()) ? format(fechaCobro, 'dd-MM-yyyy') : "-";

  const estadoVisita = dataEstado.find(estado => estado.IdEstado === visitaActual.IdEstado) || {};
  const estadoVisitaNombre = estadoVisita.Estado || '';

  const equipamientoVisita = dataEquipamiento.find(equipamiento => equipamiento.IdEsquipamiento === visitaActual.IdEquipamineto) || {};
  const equipamientoVisitaNombre = equipamientoVisita.Nombre || '';

  // Revisar el valor de `Adjuntos` y formatear como una lista de URLs
  const adjuntos = visitaActual.Adjuntos ? visitaActual.Adjuntos.split(',').map(url => `http://localhost:8081${url.trim()}`) : [];

  const handleImageClick = (url) => {
    setModalImage(url);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalImage('');
  };

  return (
    <div className="container">
      <h1 className="mt-4">Detalles de la Visita</h1>
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
            <label className="font-weight-bold">Personal que asistió:</label>
            <span className="ml-2">{nombresPersonalFormateados}</span>
          </div>
          <div className="form-group detalle-item">
            <label className="font-weight-bold">Fecha de cobro:</label>
            <span className="ml-2">{fechaCobroFormateada}</span>
          </div>
        </div>
        <div className="col-md-6 detalle-div">
          <div className="form-group detalle-item">
            <label className="font-weight-bold">Equipamiento: </label>
            <span>{equipamientoVisitaNombre}</span>
          </div>
          <div className="form-group detalle-item">
            <label className="font-weight-bold">Descripción de la Visita:</label>
            <span>{descripcionVisita}</span>
          </div>
          <div className="form-group detalle-item">
            <label className="font-weight-bold">Garantía: </label>
            <span>{garantiaVisita}</span>
          </div>
          <div className="form-group detalle-item">
            <label className="font-weight-bold">Precio de la Visita: </label>
            <span>${precioVisita}</span>
          </div>
          <div className="form-group detalle-item">
            <label className="font-weight-bold">Forma de pago: </label>
            <span>{formaPago}</span>
          </div>
          <div className="form-group detalle-item">
            <label className="font-weight-bold">Adjuntos: </label>
            <div>
              {adjuntos.length > 0 ? (
                adjuntos.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Adjunto ${index + 1}`}
                    style={{ width: '100px', marginRight: '10px', cursor: 'pointer' }}
                    onClick={() => handleImageClick(url)}
                  />
                ))
              ) : (
                <p>No hay adjuntos.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal para mostrar imagen grande */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Imagen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={modalImage} alt="Imagen Grande" style={{ width: '100%', height: 'auto' }} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DatosDetalle;
