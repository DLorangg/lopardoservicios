import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './clienteDetalle.css'; // Aquí iría tu estilo personalizado

export function ClienteDetalle() {
  const [cliente, setCliente] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const response = await axios.get(`https://lopardoservicios.com/backend/routes/getCliente.php?IdCliente=${id}`);
        setCliente(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error al cargar los datos del cliente');
        setLoading(false);
      }
    };

    fetchCliente();
  }, [id]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="container cliente-detalle">
      <h2>Detalle del Cliente</h2>
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
    </div>
  );
}
