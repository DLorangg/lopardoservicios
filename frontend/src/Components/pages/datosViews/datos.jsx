import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { parseISO, format } from 'date-fns';
import { useNavigate } from "react-router-dom";
import {ModalComponent} from "../modal"
import { ModalUpdateComponent } from '../modalUpdate';
import Rouben from '../../../Assets/Rouben.otf';

export function Datos() {
  const [content, setContent] = useState(<DatosList ShowForm={ShowForm} />);

  function ShowList() {
    setContent(<DatosList ShowForm={ShowForm} />);
  }

  function ShowForm() {
    setContent(<DatosForm ShowList={ShowList} />);
  }

  return (
    <div className="container my-5" style={{border: '1px solid #001461'}}>
      {content}
    </div>
  );
}

export function DatosList(props) {
  const [dataVisita, setDataVisita] = useState([]);
  const [dataCliente, setDataCliente] = useState([]);
  const [sortBy, setSortBy] = useState('IdVisita'); // Columna por defecto para ordenar
  const [sortDirection, setSortDirection] = useState('asc'); // Dirección por defecto para ordenar

  // Función para obtener datos de visitas desde el servidor
  function fetchVisita() {
    axios.get("http://localhost:8081/visita")
      .then((response) => {
        setDataVisita(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  // Función para obtener datos de clientes desde el servidor
  function fetchCliente() {
    axios.get("http://localhost:8081/cliente")
      .then((response) => {
        setDataCliente(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  // Función que se ejecuta al montar el componente para cargar datos iniciales
  useEffect(() => {
    fetchVisita();
    fetchCliente();
  }, []);

  // Función para formatear la fecha
  const formatFecha = (fecha) => {
    if (!fecha) return "-";
    const fechaISO = parseISO(fecha);
    if (isNaN(fechaISO.getTime())) {
      return "-";
    } else {
      return format(fechaISO, 'dd-MM-yyyy'); // Formato deseado para la fecha
    }
  };

  // Función para cambiar la dirección del ordenamiento
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  // Función para ordenar los datos por la columna seleccionada
  const sortByColumn = (columnName) => {
    setSortBy(columnName);
    toggleSortDirection(); // Cambia automáticamente la dirección del ordenamiento al cambiar la columna
  };

  // Función para ordenar los datos basados en sortBy y sortDirection
  const sortedDataVisita = [...dataVisita].sort((a, b) => {
    const columnA = a[sortBy];
    const columnB = b[sortBy];
    if (sortDirection === 'asc') {
      return columnA < columnB ? -1 : 1;
    } else {
      return columnA > columnB ? -1 : 1;
    }
  });

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8081/deletevisita/${id}`)
      .then((response) => {
        console.log(response.data.message);
        fetchVisita();
      })
      .catch((error) => {
        console.error("Error al eliminar la visita:", error);
      });
  };

  return (
    <>
      <style>{`
        @font-face {
          font-family: 'Rouben';
          src: url(${Rouben}) format('opentype');
        }
      `}</style>
      <h2 className="text-center mb-3" style={{ fontFamily: 'Rouben, sans-serif' }}>VISITAS</h2>
      <button onClick={() => props.ShowForm()} type="button" className="btn btn-primary me-2" style={{ backgroundColor: '#140097', borderColor: '#140097' }}>Crear</button>
      <button onClick={() => fetchVisita()} type="button" className="btn btn-outline-primary me-2" style={{ borderColor: '#140097', color: '#140097' }}>Actualizar</button>
      <table className="table">
        <thead>
          <tr>
            <th style={{ width: '15%' }}>Cliente</th>
            <th style={{ width: '25%' }}>Dirección</th>
            <th style={{ width: '10%' }}>Precio</th>
            <th style={{ width: '10%' }}>
              Fecha{' '}
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={() => sortByColumn('Fecha')}
              >
                {sortDirection === 'asc' ? <>&uarr;</> : <>&darr;</>}
              </button>
            </th>
            <th style={{ width: '40%', paddingRight: '50px' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sortedDataVisita.map((dato, index) => (
            <tr key={index}>
              <td style={{ width: '15%' }}>{dataCliente.length > 0 && dataCliente.find(cliente => cliente.IdCliente === dato.IdCliente)?.Nombre}</td>
              <td style={{ width: '25%' }}>{dato.Direccion}</td>
              <td style={{ width: '10%' }}>{`$ ` + dato.Precio}</td>
              <td style={{ width: '40%' }}>{formatFecha(dato.Fecha)}</td>
              <td style={{ width: '40%', whiteSpace: "nowrap" }}>
                <Link to={`/datosdetalle/${dato.IdVisita}`} type="button" className="btn btn-secondary btn-sm me-2">
                  Detalle
                </Link>
                <Link to={`/updatevisita/${dato.IdVisita}`} type="button" className="btn btn-primary btn-sm me-2" style={{ backgroundColor: '#140097', borderColor: '#140097' }}>
                  Editar
                </Link>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  style={{ backgroundColor: '#ae2012', borderColor: '#ae2012' }}
                  onClick={() => handleDelete(dato.IdVisita)}
                >
                  Borrar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}


export function DatosForm(props) {
  const [dataCliente, setDataCliente] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedClienteData, setSelectedClienteData] = useState(null);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseUpdateModal = () => setShowUpdateModal(false);
  const handleShowUpdateModal = () => setShowUpdateModal(true);

  function fetchCliente() {
    axios.get("http://localhost:8081/cliente")
      .then(res => setDataCliente(res.data))
      .catch((error) => console.log("Error: ", error));
  }

  useEffect(() => fetchCliente(), []);

  function fetchEquipamiento() {
    axios.get("http://localhost:8081/equipamiento")
      .then(res => setDataEquipamiento(res.data))
      .catch((error) => console.log("Error: ", error));
  }

  useEffect(() => fetchEquipamiento(), []);

  const [dataEstado, setDataEstado] = useState([]);

  function fetchEstado() {
    axios.get("http://localhost:8081/estado")
      .then(res => setDataEstado(res.data))
      .catch((error) => console.log("Error: ", error));
  }

  useEffect(() => fetchEstado(), []);

  const [dataPersonal, setDataPersonal] = useState([]);

  function fetchPersonal() {
    axios.get("http://localhost:8081/personal")
      .then(res => setDataPersonal(res.data))
      .catch((error) => console.log("Error: ", error));
  }

  useEffect(() => fetchPersonal(), []);

  const [IdCliente, setIdCliente] = useState('');
  const [Ciudad, setCiudad] = useState('');
  const [Direccion, setDireccion] = useState('');
  const [Descripcion, setDescripcion] = useState('');
  const [IdEquipamiento, setIdEquipamiento] = useState('');
  const [Equipamiento, setEquipamiento] = useState([]);
  const [dataEquipamiento, setDataEquipamiento] = useState([]);
  const [IdEstado, setIdEstado] = useState('');
  const [Precio, setPrecio] = useState('');
  const [Garantia, setGarantia] = useState('');
  const [Fecha, setFecha] = useState('');
  const [IdPersonal, setIdPersonal] = useState('');
  const [FormaPago, setFormaPago] = useState('');
  const [FechaCobro, setFechaCobro] = useState('');

  const navigate = useNavigate();
  
  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    const filtered = dataCliente.filter(cliente =>
      cliente.Nombre.toLowerCase().includes(query.toLowerCase()) ||
      cliente.Direccion.toLowerCase().includes(query.toLowerCase()) ||
      cliente.DNI.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredClients(filtered);
  };

  const handleClienteChange = (event) => {
    const clienteId = event.target.value;
    const clienteSeleccionado = dataCliente.find(cliente => cliente.IdCliente.toString() === clienteId);
    if (clienteSeleccionado) {
      setIdCliente(clienteId);
      setCiudad(clienteSeleccionado.Ciudad);
      setDireccion(clienteSeleccionado.Direccion);
      setSelectedClienteData(clienteSeleccionado);

      // Actualizar equipamientos seleccionados según el cliente
      const equipamientosCliente = clienteSeleccionado.Equipamiento.split(',').map(e => e.trim());
      setEquipamiento(equipamientosCliente);
    }
  };

  const handleGuardar = () => {
    axios.post('http://localhost:8081/clientepost', clienteData)
      .then(response => {
        console.log('Cliente creado:', response.data);
        alert('Cliente creado exitosamente');
        handleCloseModal();
        updateClientes(); // Llamar a la función para actualizar la lista de clientes
      })
      .catch(error => {
        console.error('Error al crear cliente:', error);
        alert('Error al crear cliente');
      });
  };

  const updateClientes = () => {
    fetchCliente()
  }

  const [files, setFiles] = useState([]);
  const [fileURLs, setFileURLs] = useState([]);
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    handleFiles(droppedFiles);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleFiles = (selectedFiles) => {
    const newFiles = [...files];
  
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      newFiles.push(file);
    }
  
    setFiles(newFiles);
  };
  
  const handleFileInputChange = (e) => {
    const selectedFiles = e.target.files;
    handleFiles(selectedFiles);
  };
  
  const handleOpenFileDialog = () => {
    fileInputRef.current.click();
  };
  
  const handleUploadFiles = () => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    return axios.post('http://localhost:8081/upload', formData)
    .then(response => {
      const fileURLs = response.data.files;
      setFileURLs(fileURLs);
      return fileURLs;
    })
    .catch(error => console.error('Error uploading files:', error));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Verificar que IdPersonal no esté vacío
    if (IdPersonal.length === 0) {
      alert('Por favor, selecciona al menos un personal.');
      return;
    }
  
    // Formatear las fechas
    const formattedFecha = new Date(Fecha).toISOString().split('T')[0];
    const formattedFechaCobro = new Date(FechaCobro).toISOString().split('T')[0];
  
    // Log de IdEstado
    console.log("IdEstado seleccionado:", IdEstado);
  
    // Subir archivos primero
    handleUploadFiles().then(uploadedFileURLs => {
      // Luego enviar los datos de la visita
      axios.post('http://localhost:8081/visitapost', {
        IdCliente,
        Ciudad,
        Direccion,
        Descripcion,
        IdEquipamiento: IdEquipamiento || null,
        IdEstado,
        IdPersonal: IdPersonal.join(','), // Asegúrate de que IdPersonal sea una cadena separada por comas
        Precio,
        Garantia,
        Fecha: formattedFecha,
        FormaPago,
        FechaCobro: formattedFechaCobro, // Asegúrate de que FechaCobro tenga el formato correcto
        IdAdjunto: uploadedFileURLs.join(','), // Asegúrate de que IdAdjunto sea una cadena separada por comas
      })
      .then(visitaResponse => {
        console.log(visitaResponse);
        navigate(props.ShowList());
      })
      .catch(error => console.error('Error:', error));
    });
  };
  

  return (
    <>
      <h2 className="text-center mb-3">Crear una nueva Visita</h2>
      <div className="row">
        <div className="col-lg-6 mx-auto">
          <form onSubmit={handleSubmit}>
  
          <label className="col-sm-4 col-form-label">Cliente</label>
          <div className="col-sm-8 d-flex flex-column">
            <input
              className="form-control"
              name="Cliente"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Buscar Cliente (Nombre, Direccion, DNI)"
              autoComplete="off"
            />
            <select
              className="form-control mt-2"
              name="IdCliente"
              onChange={handleClienteChange}
              value={IdCliente}
              autoComplete="off"
            >
              <option value="" disabled hidden>Selecciona un cliente</option>
              {filteredClients.map(cliente => (
                <option key={cliente.IdCliente} value={cliente.IdCliente}>
                  {cliente.Nombre} - {cliente.Direccion} - {cliente.DNI}
                </option>
              ))}
            </select>
            <div className="d-flex mt-2">
              <button
                type="button"
                className="btn btn-primary ms-2"
                onClick={handleShowModal}
                style={{
                  borderRadius: '35%', fontSize: '25px', width: '40px',
                  height: '40px', padding: '0', display: 'flex', justifyContent: 'center'
                }}
              >+
              </button>
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={handleShowUpdateModal}
                disabled={!selectedClienteData}
                style={{
                  borderRadius: '35%', fontSize: '25px', width: '40px',
                  height: '40px', padding: '0', display: 'flex', justifyContent: 'center'
                }}
              >
                ✎
              </button>
            </div>
          </div>
          <ModalComponent show={showModal} handleClose={handleCloseModal} updateClientes={updateClientes} />
          <ModalUpdateComponent show={showUpdateModal} handleClose={handleCloseUpdateModal} updateClientes={updateClientes} clienteData={selectedClienteData} />
  
            <label className="col-sm-4 col-form-label">Ciudad</label>
            <div className="col-sm-8">
              <input
                className="form-control"
                name="Ciudad"
                value={Ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                autoComplete="off"
              />
            </div>
  
            <label className="col-sm-4 col-form-label">Dirección</label>
            <div className="col-sm-8">
              <input
                className="form-control"
                name="Direccion"
                value={Direccion}
                onChange={(e) => setDireccion(e.target.value)}
                autoComplete="off"
              />
            </div>
  
            <label className="col-sm-4 col-form-label">Descripcion</label>
            <div className="col-sm-8">
              <textarea
                className="form-control"
                name="Descripcion"
                onChange={e => setDescripcion(e.target.value)}
                autoComplete="off"
              />
            </div>
  
            <label className="col-sm-4 col-form-label">Equipamiento</label>
            <div className="col-sm-8">
              <select
                className="form-control"
                name="Equipamiento"
                multiple
                autoComplete="off"
              >
                {dataEquipamiento && dataEquipamiento.map((equipamiento) => (
                  <option key={equipamiento.IdEquipamiento}>
                    {equipamiento.Nombre}
                  </option>
                ))}
              </select>
            </div>
  
            <label className="col-sm-4 col-form-label">Estado</label>
            <div className="col-sm-8">
              <select
                className="form-control"
                name="IdEstado"
                onChange={e => setIdEstado(e.target.value)}
                autoComplete="off"
              >
                <option value="" disabled hidden>Seleccione</option>
                {dataEstado && dataEstado.map((estado) => (
                  <option key={estado.IdEstado} value={estado.IdEstado}>
                    {estado.Estado}
                  </option>
                ))}
                {dataEstado && dataEstado.length === 0 && <option value="">No clients available</option>}
              </select>
            </div>

            <label className="col-sm-4 col-form-label">Personal</label>
            <div className="col-sm-8">
            <select className="form-control" name="IdPersonal" multiple onChange={e => {
              const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
              setIdPersonal(selectedOptions);  // Almacenar array de IDs
              console.log("ID Personal seleccionados:", selectedOptions);
            }}>
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
                onChange={e => setPrecio(e.target.value)}
                autoComplete="off"
              />
            </div>
  
            <label className="col-sm-4 col-form-label">Garantia</label>
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
                  Si
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
  
            <label className="col-sm-4 col-form-label">Fecha</label>
            <div className="col-sm-8">
              <input
                className="form-control"
                type="date"
                name="Fecha"
                onChange={e => setFecha(e.target.value)}
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
                  value={1}
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
                  value={0}
                  checked={FormaPago === 0}
                  onChange={() => setFormaPago(0)}
                />
                <label className="form-check-label" htmlFor="efectivoRadio">
                  Efectivo
                </label>
              </div>
            </div>

            <label className="col-sm-4 col-form-label">Fecha de cobro</label>
            <div className="col-sm-8">
              <input
                className="form-control"
                type="date"
                name="FechaCobro"
                onChange={e => setFechaCobro(e.target.value)}
                autoComplete="off"
              />
            </div>
  
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
                accept=".jpg,.jpeg,.png,.pdf" 
              />
              <p>Arrastra y suelta archivos aquí o haz clic para seleccionar archivos</p>
              {files.length > 0 && (
                <div>
                  <h2>Archivos seleccionados</h2>
                  <ul>
                    {files.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <br />
  
            <div className="row">
              <div className="offset-sm-4 col-sm-4 d-grid">
                <button type="submit" className="btn btn-primary btn-sm me-3">Guardar</button>
              </div>
              <div className="col-sm-4 d-grid">
                <Link to={`../`} type="button" className="btn btn-danger me-2">Cancelar</Link>
              </div>
            </div>
  
          </form>
        </div>
      </div>
    </>
  );  
}