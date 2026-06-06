import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';
import { Form, Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

export function DatosUpdate() {
  const [dataVisita, setDataVisita] = useState([]);
  const [dataPersonal, setDataPersonal] = useState([]);
  const [dataEstado, setDataEstado] = useState([]);
  const [dataEquipamiento, setDataEquipamiento] = useState([]);

  const { id } = useParams();
  let location = useLocation();
  const navigate = useNavigate();
  
  // Estado para los campos del formulario
  const [Descripcion, setDescripcion] = useState('');
  const [IdEquipamiento, setIdEquipamiento] = useState('');
  const [IdEstado, setIdEstado] = useState('');
  const [Precio, setPrecio] = useState('');
  const [Garantia, setGarantia] = useState('');
  const [Fecha, setFecha] = useState('');
  const [IdPersonal, setIdPersonal] = useState([]);
  const [FormaPago, setFormaPago] = useState('');
  const [FechaCobro, setFechaCobro] = useState('');
  const [NumeroCheque, setNumeroCheque] = useState('');
  const [NumeroFactura, setNumeroFactura] = useState('');

  const fileInputRef = useRef(null);

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setNewFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  };
  
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleOpenFileDialog = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = (event) => {
    const addedFiles = Array.from(event.target.files);
    setNewFiles((prevFiles) => [...prevFiles, ...addedFiles]);
  };

  const handleRemoveFile = (fileName) => {
    setNewFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  // Fetching data functions
  function fetchPersonal() {
    axios.get(`${import.meta.env.VITE_API_URL}/getPersonal.php`)
      .then(res => setDataPersonal(res.data))
      .catch((error) => console.log("Error: ", error));
  }

  function fetchEstado() {
    axios.get(`${import.meta.env.VITE_API_URL}/getEstado.php`)
      .then(res => setDataEstado(res.data))
      .catch((error) => console.log("Error: ", error));
  }

  function fetchEquipamiento() {
    axios.get(`${import.meta.env.VITE_API_URL}/getEquipamiento.php`)
      .then(res => setDataEquipamiento(res.data))
      .catch((error) => console.log("Error: ", error));
  }

  const [adjuntos, setAdjuntos] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [adjuntosParaEliminar, setAdjuntosParaEliminar] = useState([]);

  const handleRemoveExistingFile = (idAdjunto) => {
    setAdjuntosParaEliminar(prev => [...prev, idAdjunto]);
    setAdjuntos(prev => prev.filter(adj => adj.IdAdjunto !== idAdjunto));
  };

  useEffect(() => {
    fetchPersonal();
    fetchEstado();
    fetchEquipamiento();

    // Obtener visita por ID con detalle de adjuntos
    axios.get(`${import.meta.env.VITE_API_URL}/getVisitaDetalle.php?idVisita=${id}`)
      .then(res => {
        const currentVisit = res.data;
        if (currentVisit) {
          setDescripcion(currentVisit.Descripcion);
          setIdEquipamiento(currentVisit.IdEquipamiento ? currentVisit.IdEquipamiento.split(',') : []);
          setIdEstado(currentVisit.IdEstado);
          setPrecio(currentVisit.Precio);
          setGarantia(parseInt(currentVisit.Garantia));
          setFecha(currentVisit.Fecha ? new Date(currentVisit.Fecha).toISOString().split('T')[0] : '');
          setFormaPago(parseInt(currentVisit.FormaPago));
          setNumeroCheque(currentVisit.NumeroCheque);
          setNumeroFactura(currentVisit.NumeroFactura);
          setFechaCobro(currentVisit.FechaCobro ? new Date(currentVisit.FechaCobro).toISOString().split('T')[0] : '');
          setIdPersonal(currentVisit.IdPersonal ? currentVisit.IdPersonal.split(',') : []);
          setAdjuntos(currentVisit.adjuntos || []);
        }
      })
      .catch(error => console.log("Error fetching visit details: ", error));
  }, [id]); 
  
  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    
    // Append form fields
    formData.append('Descripcion', Descripcion);
    formData.append('IdEquipamiento', Array.isArray(IdEquipamiento) ? IdEquipamiento.join(',') : '');
    formData.append('IdEstado', IdEstado);
    formData.append('Precio', Precio);
    formData.append('Garantia', Garantia);
    formData.append('Fecha', Fecha);
    formData.append('IdPersonal', Array.isArray(IdPersonal) ? IdPersonal.join(',') : '');
    formData.append('FormaPago', FormaPago);
    formData.append('FechaCobro', FechaCobro);
    formData.append('NumeroCheque', NumeroCheque);
    formData.append('NumeroFactura', NumeroFactura);

    // Append new files
    newFiles.forEach(file => {
      formData.append('adjuntos[]', file);
    });

    if (adjuntosParaEliminar.length > 0) {
      formData.append('adjuntos_a_eliminar', JSON.stringify(adjuntosParaEliminar));
    }

    // Use POST and include 'id' in URL for update
    axios.post(`${import.meta.env.VITE_API_URL}/putVisita.php?idVisita=${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    .then(res => {
        console.log("Respuesta del servidor:", res);
        toast.success("Cambios guardados con éxito");
        const redirectTo = location.state?.from === 'busqueda' ? '../busqueda' : '../datos'; 
        navigate(redirectTo);
    })
    .catch(error => {
        console.error('Error al actualizar la visita:', error);
        toast.error("Error al guardar los datos. Inténtalo de nuevo.");
    });
  };

  return (
    <>
    <div className="container my-5" style={{border: '1px solid #001461'}}>
      <h2 className="text-center mb-3">Editar Visita</h2>
      <div className="row">
        <div className="col-lg-6 mx-auto">
          <form onSubmit={handleSubmit}>

            <label className="col-sm-4 col-form-label">Fecha</label>
            <div className="col-sm-8">
              <input
                className="form-control"
                type="date"
                name="Fecha"
                onChange={e => setFecha(e.target.value)}
                value={Fecha} 
                autoComplete="off"
              />
            </div>

            <label className="col-sm-4 col-form-label">Descripción</label>
            <div className="col-sm-8">
              <textarea
                className="form-control"
                name="Descripcion"
                onChange={e => setDescripcion(e.target.value)}
                value={Descripcion}
                autoComplete="off"
              />
            </div>

            <label className="col-sm-4 col-form-label">Estado</label>
            <div className="col-sm-8">
              <select
                className="form-control"
                name="IdEstado"
                onChange={e => setIdEstado(e.target.value)}
                value={IdEstado}
                autoComplete="off"
              >
                <option value="" disabled hidden>Seleccione</option>
                {dataEstado && dataEstado.map((estado) => (
                  <option key={estado.IdEstado} value={estado.IdEstado}>
                    {estado.Estado}
                  </option>
                ))}
                {dataEstado && dataEstado.length === 0 && <option value="">No hay estados disponibles</option>}
              </select>
            </div>

            <label className="col-sm-4 col-form-label">Personal</label>
            <div className="col-sm-8">
              <select
                className="form-control"
                name="IdPersonal"
                multiple
                onChange={e => {
                  const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                  setIdPersonal(selectedOptions);
                }}                
                value={IdPersonal}
              >
                <option value="" disabled hidden>Seleccione</option>
                {dataPersonal && dataPersonal.map((personal) => (
                  <option key={personal.IdPersonal} value={personal.IdPersonal}>
                    {personal.Nombre}
                  </option>
                ))}
              </select>
            </div>

            <label className="col-sm-4 col-form-label">Precio</label>
            <div className="col-sm-8">
              <input
                className="form-control"
                name="Precio"
                type="number"
                onChange={e => setPrecio(e.target.value)}
                value={Precio}
                autoComplete="off"
              />
            </div>

            <label className="col-sm-4 col-form-label">Garantía</label>
            <div className="col-sm-8">
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="Garantia"
                  id="siRadio"
                  value={1}
                  checked={Garantia === 1}
                  onChange={() => setGarantia(1)}
                />
                <label className="form-check-label" htmlFor="siRadio">
                  Sí
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="Garantia"
                  id="noRadio"
                  value={0}
                  checked={Garantia === 0}
                  onChange={() => setGarantia(0)}
                />
                <label className="form-check-label" htmlFor="noRadio">
                  No
                </label>
              </div>
            </div>

            <label className="col-sm-4 col-form-label">Número de factura</label>
              <div className="col-sm-8">
                <input
                  className="form-control"
                  name="NumeroFactura"
                  value={NumeroFactura}
                  onChange={(e) => setNumeroFactura(e.target.value)}
                  autoComplete="off"
                />
              </div>

            <label className="col-sm-4 col-form-label">Forma de pago</label>
            <div className="col-sm-8">
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="FormaPago"
                  id="transferenciaRadio"
                  value={FormaPago}
                  checked={FormaPago === 1}
                  onChange={() => setFormaPago(1)}
                />
                <label className="form-check-label" htmlFor="transferenciaRadio">
                  Transferencia
                </label>
              </div>
              
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="FormaPago"
                  id="efectivoRadio"
                  value={FormaPago}
                  checked={FormaPago === 0}
                  onChange={() => setFormaPago(0)}
                />
                <label className="form-check-label" htmlFor="efectivoRadio">
                  Efectivo
                </label>
              </div>

              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="FormaPago"
                  id="chequeRadio"
                  value={FormaPago}
                  checked={FormaPago === 2}
                  onChange={() => setFormaPago(2)}
                />
                <label className="form-check-label" htmlFor="chequeRadio">
                  Cheque
                </label>
              </div>
            </div>

            <label className="col-sm-4 col-form-label">Número de cheque</label>
              <div className="col-sm-8">
                <input
                  className="form-control"
                  name="NumeroCheque"
                  value={NumeroCheque}
                  onChange={(e) => setNumeroCheque(e.target.value)}
                  autoComplete="off"
                />
              </div>

            <label className="col-sm-4 col-form-label">Fecha de cobro</label>
            <div className="col-sm-8">
              <input
                className="form-control"
                type="date"
                name="FechaCobro"
                value={FechaCobro}
                onChange={e => setFechaCobro(e.target.value)}
                autoComplete="off"
              />
            </div>

            {/* Attachments Section */}
            <div className="mt-4">
              <h5 className="mb-3">Adjuntos</h5>
              
              {/* Existing Attachments */}
              {adjuntos.length > 0 && (
                <div>
                  <h6>Adjuntos existentes:</h6>
                  <ul className="list-group mb-3">
                    {adjuntos.map(adjunto => (
                      <li key={adjunto.IdAdjunto} className="list-group-item d-flex justify-content-between align-items-center">
                        <a href={`https://lopardoservicios.com${adjunto.URL}`} target="_blank" rel="noopener noreferrer">
                          {adjunto.NombreOriginal}
                        </a>
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => handleRemoveExistingFile(adjunto.IdAdjunto)}>
                          Eliminar
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* New Attachments Input */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={handleOpenFileDialog}
                style={{ border: '2px dashed #ccc', padding: '20px', borderRadius: '5px', textAlign: 'center', cursor: 'pointer', marginTop: '20px' }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileInputChange}
                  multiple
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx,.mp4,.mov"
                />
                <p>Arrastra y suelta archivos nuevos aquí, o haz clic para seleccionar</p>
                {newFiles.length > 0 && (
                  <div>
                    <h6>Archivos nuevos:</h6>
                    <ul className="list-unstyled">
                      {newFiles.map((file, index) => (
                        <li key={index}>
                          {file.name}
                          <button type="button" onClick={() => handleRemoveFile(file.name)} style={{ marginLeft: '10px', color: 'red', border: 'none', background: 'none' }}>
                            &times;
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

              <br />
            <div className="row">
              <div className="offset-sm-4 col-sm-4 d-grid">
                <button type="submit" className="btn btn-primary btn-sm me-3">Guardar</button>
              </div>
              <div className="col-sm-4 d-grid">
              <Link 
                to={location.state?.from === 'busqueda' ? '../busqueda' : '../datos'} 
                type="button" 
                className="btn btn-danger me-2"
              >
                Cancelar
              </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}

export default DatosUpdate;
