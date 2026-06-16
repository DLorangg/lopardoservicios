import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './clienteDetalle.css'; // Aquí iría tu estilo personalizado
import { Pencil } from 'react-bootstrap-icons';
import { ModalUpdateComponent } from '../modalUpdate';

export function ClienteDetalle() {
  const [cliente, setCliente] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { id } = useParams();

  const fetchCliente = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/getCliente.php?IdCliente=${id}`);
      setCliente(response.data);
      setLoading(false);
    } catch (error) {
      setError('Error al cargar los datos del cliente');
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCliente();
  }, [fetchCliente]);

  const handleEdit = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    fetchCliente();
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="main-content-container container p-4 mt-4 cliente-detalle">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="mb-0">Detalle del Cliente</h2>
        <div className="d-flex gap-2">
          <Link to="/cliente" className="btn btn-outline-secondary fw-bold">
            Volver
          </Link>
          <button 
            onClick={handleEdit} 
            className="btn btn-primary fw-bold d-flex align-items-center gap-2"
          >
            <Pencil /> Editar Cliente
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 detalle-div">
          <div className="form-group detalle-item">
            <label className="font-weight-bold">Nombre:</label>
            <span className="ml-2">{cliente.Nombre || '-'}</span>
          </div>
          <div className="form-group detalle-item">
            <label className="font-weight-bold">DNI:</label>
            <span className="ml-2">{cliente.DNI || '-'}</span>
          </div>
          <div className="form-group detalle-item">
            <label className="font-weight-bold">Ciudad:</label>
            <span className="ml-2">{cliente.Ciudad || '-'}</span>
          </div>
          <div className="form-group detalle-item">
            <label className="font-weight-bold">Dirección:</label>
            <span className="ml-2">{cliente.Direccion || '-'}</span>
          </div>
        </div>
        <div className="col-md-6 detalle-div">
          <div className="form-group detalle-item">
            <label className="font-weight-bold">Teléfono:</label>
            <span className="ml-2">{cliente.Telefono || '-'}</span>
          </div>
          <div className="form-group detalle-item">
            <label className="font-weight-bold">Razón Social:</label>
            <span className="ml-2">{cliente.RazonSocial || '-'}</span>
          </div>
          <div className="form-group detalle-item">
            <label className="font-weight-bold">Email:</label>
            <span className="ml-2">{cliente.Email || '-'}</span>
          </div>
          <div className="form-group detalle-item">
            <label className="font-weight-bold">Email 2:</label>
            <span className="ml-2">{cliente.Email2 || '-'}</span>
          </div>
        </div>
      </div>
      {showModal && (
        <ModalUpdateComponent 
          clienteData={cliente} 
          show={showModal} 
          handleClose={handleCloseModal} 
          updateClientes={fetchCliente} 
        />
      )}
    </div>
  );
}
