import React, { useEffect, useState } from "react";
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowClockwise } from 'react-bootstrap-icons';
import Rouben from '../../Assets/Rouben.otf';

export function ModeracionResenas() {
  const [resenas, setResenas] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchResenas = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/getResenas.php`);
      setResenas(res.data);
    } catch (error) {
      console.error("Error al obtener reseñas: ", error);
      toast.error("Error al cargar las reseñas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResenas();
  }, []);

  const handleUpdateEstado = async (id, nuevoEstado) => {
    const actionText = nuevoEstado === 'aprobado' ? 'aprobar' : 'rechazar';
    if (window.confirm(`¿Estás seguro de que deseas ${actionText} esta reseña?`)) {
      try {
        await axios.put(`${import.meta.env.VITE_API_URL}/putResena.php`, {
          id: id,
          estado: nuevoEstado
        });
        toast.success(`Reseña ${nuevoEstado === 'aprobado' ? 'aprobada' : 'rechazada'} correctamente`);
        fetchResenas();
      } catch (error) {
        console.error(error);
        toast.error("No se pudo actualizar el estado de la reseña.");
      }
    }
  };

  const formatFecha = (fechaStr) => {
    if (!fechaStr) return "-";
    try {
      const date = new Date(fechaStr);
      return date.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return fechaStr;
    }
  };

  return (
    <div className="container main-content-container p-4 mt-4">
      <style>{`
        @font-face {
          font-family: 'Rouben';
          src: url(${Rouben}) format('opentype');
        }
      `}</style>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 style={{ fontFamily: 'Rouben, sans-serif' }}>MODERACIÓN DE RESEÑAS</h2>
        <button 
          onClick={fetchResenas} 
          type="button" 
          className="btn btn-outline-secondary"
          disabled={loading}
        >
          <ArrowClockwise className={loading ? "spin-animation" : ""} />
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Nombre</th>
              <th>Empresa</th>
              <th>Comentario</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {resenas.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center text-muted py-4">
                  No hay reseñas registradas
                </td>
              </tr>
            ) : (
              resenas.map((resena) => (
                <tr key={resena.id}>
                  <td style={{ whiteSpace: "nowrap" }}>{formatFecha(resena.fecha)}</td>
                  <td>{resena.nombre_cliente}</td>
                  <td>{resena.empresa || "-"}</td>
                  <td style={{ maxWidth: "300px", wordBreak: "break-word" }}>{resena.comentario}</td>
                  <td>
                    {resena.estado === 'pendiente' && (
                      <span className="badge bg-warning text-dark">Pendiente</span>
                    )}
                    {resena.estado === 'aprobado' && (
                      <span className="badge bg-success">Aprobado</span>
                    )}
                    {resena.estado === 'rechazado' && (
                      <span className="badge bg-danger">Rechazado</span>
                    )}
                  </td>
                  <td>
                    {resena.estado === 'pendiente' ? (
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-success btn-sm"
                          onClick={() => handleUpdateEstado(resena.id, 'aprobado')}
                        >
                          Aprobar
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleUpdateEstado(resena.id, 'rechazado')}
                        >
                          Rechazar
                        </button>
                      </div>
                    ) : (
                      <span className="text-muted small">-</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
