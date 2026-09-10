import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  ArrowClockwise, 
  ChatSquareQuoteFill, 
  Images, 
  PencilSquare, 
  Trash, 
  CheckCircleFill, 
  XCircleFill, 
  Upload, 
  ArrowLeft, 
  ArrowRight,
  Eye
} from 'react-bootstrap-icons';
import Rouben from '../../Assets/Rouben.otf';

export function GestionWeb() {
  const [activeTab, setActiveTab] = useState('resenas');

  // --- ESTADOS: RESEÑAS ---
  const [resenas, setResenas] = useState([]);
  const [loadingResenas, setLoadingResenas] = useState(false);

  // Modal de edición de reseña
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingResena, setEditingResena] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [editEmpresa, setEditEmpresa] = useState('');
  const [editComentario, setEditComentario] = useState('');
  const [editEstado, setEditEstado] = useState('pendiente');
  const [savingEdit, setSavingEdit] = useState(false);

  // --- ESTADOS: CARRUSEL ---
  const [fotos, setFotos] = useState([]);
  const [loadingFotos, setLoadingFotos] = useState(false);
  const [uploadingFoto, setUploadingFoto] = useState(false);
  const fileInputRef = useRef(null);

  // ==========================================
  // FUNCIONES: RESEÑAS
  // ==========================================
  const fetchResenas = useCallback(async () => {
    setLoadingResenas(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/resenas.php`);
      setResenas(res.data);
    } catch (error) {
      console.error("Error al obtener reseñas:", error);
      toast.error("Error al cargar las reseñas.");
    } finally {
      setLoadingResenas(false);
    }
  }, []);

  const handleUpdateEstado = async (id, nuevoEstado) => {
    const actionText = nuevoEstado === 'aprobado' ? 'aprobar' : 'rechazar';
    if (window.confirm(`¿Estás seguro de que deseas ${actionText} esta reseña?`)) {
      try {
        await axios.put(`${import.meta.env.VITE_API_URL}/resenas.php`, {
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

  const handleDeleteResena = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar permanentemente esta reseña?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/resenas.php?id=${id}`);
        toast.success("Reseña eliminada correctamente");
        fetchResenas();
      } catch (error) {
        console.error(error);
        toast.error("No se pudo eliminar la reseña.");
      }
    }
  };

  // Convertir texto a Title Case (primera letra de cada palabra en mayúscula)
  const toTitleCase = (text) => {
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleNombreChange = (e) => {
    setEditNombre(toTitleCase(e.target.value));
  };

  const handleOpenEditModal = (resena) => {
    setEditingResena(resena);
    setEditNombre(resena.nombre_cliente || '');
    setEditEmpresa(resena.empresa || '');
    setEditComentario(resena.comentario || '');
    setEditEstado(resena.estado || 'pendiente');
    setShowEditModal(true);
  };

  const handleSaveEditResena = async (e) => {
    e.preventDefault();
    if (!editNombre.trim()) {
      toast.error("El nombre del cliente no puede estar vacío.");
      return;
    }
    if (!editComentario.trim()) {
      toast.error("El comentario no puede estar vacío.");
      return;
    }
    if (editComentario.length > 320) {
      toast.error("El comentario no puede superar los 320 caracteres.");
      return;
    }

    setSavingEdit(true);
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/resenas.php`, {
        id: editingResena.id,
        nombre_cliente: editNombre.trim(),
        empresa: editEmpresa.trim(),
        comentario: editComentario.trim(),
        estado: editEstado
      });
      toast.success("Reseña editada exitosamente");
      setShowEditModal(false);
      fetchResenas();
    } catch (error) {
      console.error("Error al guardar reseña editada:", error);
      const msg = error.response?.data?.error || "Error al actualizar la reseña.";
      toast.error(msg);
    } finally {
      setSavingEdit(false);
    }
  };

  // ==========================================
  // FUNCIONES: CARRUSEL DE FOTOS
  // ==========================================
  const fetchFotos = useCallback(async () => {
    setLoadingFotos(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/carrusel.php`);
      setFotos(res.data);
    } catch (error) {
      console.error("Error al cargar fotos del carrusel:", error);
      toast.error("Error al cargar las fotos del carrusel.");
    } finally {
      setLoadingFotos(false);
    }
  }, []);

  const handleUploadPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validación de 5 MB
    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      toast.error("El archivo supera el tamaño máximo permitido de 5 MB.");
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      toast.error("Formato no soportado. Debe ser JPG, JPEG, PNG o WEBP.");
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploadingFoto(true);
    const formData = new FormData();
    formData.append('imagen', file);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/carrusel.php`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(res.data?.message || "Foto subida al carrusel exitosamente");
      fetchFotos();
    } catch (error) {
      console.error("Error al subir foto:", error);
      const msg = error.response?.data?.error || "No se pudo subir la imagen.";
      toast.error(msg);
    } finally {
      setUploadingFoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleMovePhoto = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= fotos.length) return;

    const updated = [...fotos];
    const [movedItem] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, movedItem);

    // Actualización optimista de UI
    setFotos(updated);

    // Enviar nuevo orden al backend
    const payload = updated.map((foto, idx) => ({
      id: foto.id,
      orden: idx + 1
    }));

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/carrusel.php`, payload);
      toast.success("Orden del carrusel actualizado");
    } catch (error) {
      console.error("Error al reordenar fotos:", error);
      toast.error("Error al guardar el nuevo orden");
      fetchFotos(); // Rollback en caso de error
    }
  };

  const handleDeletePhoto = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta imagen del carrusel?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/carrusel.php?id=${id}`);
        toast.success("Foto eliminada correctamente");
        fetchFotos();
      } catch (error) {
        console.error("Error al eliminar foto:", error);
        toast.error("No se pudo eliminar la imagen.");
      }
    }
  };

  // Helper para armar la URL absoluta de las fotos
  const getFullImageUrl = (relativeUrl) => {
    if (!relativeUrl) return '';
    if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) {
      return relativeUrl;
    }
    const apiOrigin = import.meta.env.VITE_API_URL.replace(/\/routes\/?$/, '');
    return `${apiOrigin}${relativeUrl.startsWith('/') ? '' : '/'}${relativeUrl}`;
  };

  // Cargar datos según la pestaña activa
  useEffect(() => {
    if (activeTab === 'resenas') {
      fetchResenas();
    } else if (activeTab === 'carrusel') {
      fetchFotos();
    }
  }, [activeTab, fetchResenas, fetchFotos]);

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
        .spin-animation {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Encabezado principal */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 style={{ fontFamily: 'Rouben, sans-serif' }} className="mb-1">
            GESTIÓN WEB
          </h2>
          <p className="text-secondary small mb-0">
            Administra los testimonios de clientes y las fotografías del carrusel de la página web.
          </p>
        </div>
        <button 
          onClick={activeTab === 'resenas' ? fetchResenas : fetchFotos} 
          type="button" 
          className="btn btn-outline-secondary d-flex align-items-center gap-2"
          disabled={loadingResenas || loadingFotos}
          title="Actualizar datos"
        >
          <ArrowClockwise className={(loadingResenas || loadingFotos) ? "spin-animation" : ""} />
          <span className="d-none d-sm-inline">Actualizar</span>
        </button>
      </div>

      {/* Pestañas de Navegación (Nav Tabs) */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link d-flex align-items-center gap-2 px-4 py-2.5 fw-semibold ${activeTab === 'resenas' ? 'active text-primary border-bottom-0' : 'text-secondary'}`}
            onClick={() => setActiveTab('resenas')}
          >
            <ChatSquareQuoteFill className="text-warning" />
            <span>Reseñas de Clientes</span>
            {resenas.filter(r => r.estado === 'pendiente').length > 0 && (
              <span className="badge bg-danger rounded-pill ms-1">
                {resenas.filter(r => r.estado === 'pendiente').length}
              </span>
            )}
          </button>
        </li>
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link d-flex align-items-center gap-2 px-4 py-2.5 fw-semibold ${activeTab === 'carrusel' ? 'active text-primary border-bottom-0' : 'text-secondary'}`}
            onClick={() => setActiveTab('carrusel')}
          >
            <Images className="text-info" />
            <span>Fotos del Carrusel</span>
            <span className="badge bg-secondary rounded-pill ms-1">{fotos.length}</span>
          </button>
        </li>
      </ul>

      {/* ======================================================== */}
      {/* PESTAÑA 1: GESTIÓN DE RESEÑAS */}
      {/* ======================================================== */}
      {activeTab === 'resenas' && (
        <div className="card border-0 shadow-sm rounded-4 p-3 p-md-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">Listado de Reseñas</h5>
            <span className="text-muted small">Total: {resenas.length}</span>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Fecha</th>
                  <th>Nombre</th>
                  <th>Empresa</th>
                  <th>Comentario</th>
                  <th>Estado</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {resenas.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-5">
                      No hay reseñas registradas
                    </td>
                  </tr>
                ) : (
                  resenas.map((resena) => (
                    <tr key={resena.id}>
                      <td style={{ whiteSpace: "nowrap" }} className="small text-secondary">
                        {formatFecha(resena.fecha)}
                      </td>
                      <td className="fw-semibold">{resena.nombre_cliente}</td>
                      <td>{resena.empresa || <span className="text-muted">-</span>}</td>
                      <td style={{ maxWidth: "340px", wordBreak: "break-word" }} className="small">
                        {resena.comentario}
                      </td>
                      <td>
                        {resena.estado === 'pendiente' && (
                          <span className="badge bg-warning text-dark px-2.5 py-1.5 rounded-pill">
                            Pendiente
                          </span>
                        )}
                        {resena.estado === 'aprobado' && (
                          <span className="badge bg-success px-2.5 py-1.5 rounded-pill">
                            Aprobado
                          </span>
                        )}
                        {resena.estado === 'rechazado' && (
                          <span className="badge bg-danger px-2.5 py-1.5 rounded-pill">
                            Rechazado
                          </span>
                        )}
                      </td>
                      <td className="text-end">
                        <div className="d-inline-flex gap-1">
                          {/* Moderación rápida si está pendiente */}
                          {resena.estado === 'pendiente' && (
                            <>
                              <button
                                type="button"
                                className="btn btn-outline-success btn-sm p-1 px-2"
                                onClick={() => handleUpdateEstado(resena.id, 'aprobado')}
                                title="Aprobar reseña"
                              >
                                <CheckCircleFill />
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm p-1 px-2"
                                onClick={() => handleUpdateEstado(resena.id, 'rechazado')}
                                title="Rechazar reseña"
                              >
                                <XCircleFill />
                              </button>
                            </>
                          )}

                          {/* Botón Editar */}
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm p-1 px-2"
                            onClick={() => handleOpenEditModal(resena)}
                            title="Editar reseña"
                          >
                            <PencilSquare />
                          </button>

                          {/* Botón Eliminar */}
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm p-1 px-2"
                            onClick={() => handleDeleteResena(resena.id)}
                            title="Eliminar reseña"
                          >
                            <Trash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* PESTAÑA 2: FOTOS DEL CARRUSEL */}
      {/* ======================================================== */}
      {activeTab === 'carrusel' && (
        <div>
          {/* Tarjeta de Subida */}
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-light">
            <div className="row align-items-center">
              <div className="col-md-8">
                <h5 className="fw-bold mb-1">Galería de Trabajos del Carrusel</h5>
                <p className="text-secondary small mb-md-0">
                  Sube fotos reales de instalaciones y mantenimientos. Formatos permitidos: JPG, PNG, WEBP (hasta 5 MB).
                </p>
              </div>
              <div className="col-md-4 text-md-end">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleUploadPhoto}
                  accept="image/png,image/jpeg,image/webp" 
                  style={{ display: 'none' }} 
                />
                <button
                  type="button"
                  className="btn btn-primary px-4 py-2 rounded-pill fw-bold shadow-sm d-inline-flex align-items-center gap-2"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  disabled={uploadingFoto}
                >
                  <Upload /> {uploadingFoto ? "Subiendo..." : "Subir nueva foto"}
                </button>
              </div>
            </div>
          </div>

          {/* Grilla visual de miniaturas */}
          {fotos.length === 0 ? (
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center text-muted">
              <Images style={{ fontSize: '48px' }} className="mb-2 text-secondary opacity-50 mx-auto" />
              <p className="mb-0">No hay fotografías activas en el carrusel.</p>
              <span className="small text-secondary">Utiliza el botón de arriba para subir la primera imagen.</span>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
              {fotos.map((foto, index) => (
                <div key={foto.id} className="col">
                  <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative group">
                    {/* Badge de Orden */}
                    <div className="position-absolute top-0 start-0 m-2 z-2">
                      <span className="badge bg-dark bg-opacity-75 rounded-pill px-2.5 py-1.5 shadow-sm">
                        #{index + 1}
                      </span>
                    </div>

                    {/* Vista previa de imagen */}
                    <div 
                      style={{ 
                        height: '190px', 
                        overflow: 'hidden', 
                        backgroundColor: '#f8f9fa' 
                      }} 
                      className="d-flex align-items-center justify-content-center"
                    >
                      <img
                        src={getFullImageUrl(foto.url)}
                        alt={foto.nombre_archivo}
                        className="w-100 h-100 object-fit-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/400x300?text=Error+al+cargar+imagen";
                        }}
                      />
                    </div>

                    {/* Cuerpo de la tarjeta */}
                    <div className="card-body p-3 d-flex flex-column justify-content-between">
                      <p 
                        className="small text-truncate fw-semibold mb-2" 
                        title={foto.nombre_archivo}
                      >
                        {foto.nombre_archivo}
                      </p>

                      {/* Controles de orden y eliminación */}
                      <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                        <div className="btn-group btn-group-sm" role="group">
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => handleMovePhoto(index, -1)}
                            disabled={index === 0}
                            title="Mover a la izquierda / antes"
                          >
                            <ArrowLeft />
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => handleMovePhoto(index, 1)}
                            disabled={index === fotos.length - 1}
                            title="Mover a la derecha / después"
                          >
                            <ArrowRight />
                          </button>
                        </div>

                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDeletePhoto(foto.id)}
                          title="Eliminar foto del carrusel"
                        >
                          <Trash />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EDITAR RESEÑA */}
      {/* ======================================================== */}
      {showEditModal && (
        <div 
          className="modal fade show d-block" 
          tabIndex="-1" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold">Editar Reseña</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  aria-label="Close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSaveEditResena}>
                <div className="modal-body py-3">
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">
                      Nombre del Cliente <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      value={editNombre}
                      onChange={handleNombreChange}
                      placeholder="Ej: Juan Pérez"
                      required
                    />
                    <div className="form-text text-muted small">
                      Se formatea automáticamente con mayúscula inicial en cada palabra.
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">
                      Empresa o Institución (Opcional)
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      value={editEmpresa}
                      onChange={(e) => setEditEmpresa(e.target.value)}
                      placeholder="Ej: Nippon Car S.R.L."
                    />
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <label className="form-label small fw-bold text-secondary mb-1">
                        Comentario <span className="text-danger">*</span>
                      </label>
                      <span className={`small ${editComentario.length > 320 ? 'text-danger fw-bold' : 'text-muted'}`}>
                        {editComentario.length} / 320 caracteres
                      </span>
                    </div>
                    <textarea
                      className="form-control rounded-3"
                      rows="4"
                      maxLength={320}
                      value={editComentario}
                      onChange={(e) => setEditComentario(e.target.value)}
                      placeholder="Opinión o testimonio del cliente..."
                      required
                    ></textarea>
                  </div>

                  <div className="mb-2">
                    <label className="form-label small fw-bold text-secondary">
                      Estado de Moderación
                    </label>
                    <select
                      className="form-select rounded-3"
                      value={editEstado}
                      onChange={(e) => setEditEstado(e.target.value)}
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="aprobado">Aprobado (Visible en la web)</option>
                      <option value="rechazado">Rechazado</option>
                    </select>
                  </div>
                </div>

                <div className="modal-footer border-top-0 pt-0">
                  <button 
                    type="button" 
                    className="btn btn-light rounded-pill px-4" 
                    onClick={() => setShowEditModal(false)}
                    disabled={savingEdit}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary rounded-pill px-4 fw-bold"
                    disabled={savingEdit}
                  >
                    {savingEdit ? "Guardando..." : "Guardar Cambios"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionWeb;
