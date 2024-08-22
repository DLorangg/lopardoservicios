import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';
import { Form, Link, useNavigate, useParams } from 'react-router-dom';

export function DatosUpdate() {
  const [dataCliente, setDataCliente] = useState([]);
  const [dataVisita, setDataVisita] = useState([]);
  const [dataPersonal, setDataPersonal] = useState([]);
  const [dataEstado, setDataEstado] = useState([]);
  const [dataEquipamiento, setDataEquipamiento] = useState([]);

  const { id } = useParams();
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

  // Fetching data functions
  function fetchPersonal() {
    axios.get("http://localhost:8081/personal")
      .then(res => setDataPersonal(res.data))
      .catch((error) => console.log("Error: ", error));
  }

  function fetchEstado() {
    axios.get("http://localhost:8081/estado")
      .then(res => setDataEstado(res.data))
      .catch((error) => console.log("Error: ", error));
  }

  function fetchEquipamiento() {
    axios.get("http://localhost:8081/equipamiento")
      .then(res => setDataEquipamiento(res.data))
      .catch((error) => console.log("Error: ", error));
  }

  useEffect(() => {
    fetchPersonal();
    fetchEstado();
    fetchEquipamiento();
  }, []);

  useEffect(() => {
    // Obtener visita por ID
    axios.get("http://localhost:8081/visita")
      .then(res => {
        setDataVisita(res.data);
        // Buscar la visita actual y actualizar el estado
        const currentVisit = res.data.find(visita => visita.IdVisita === parseInt(id));
        if (currentVisit) {
          setDescripcion(currentVisit.Descripcion);
          setIdEquipamiento(currentVisit.IdEquipamiento);
          setIdEstado(currentVisit.IdEstado);
          setPrecio(currentVisit.Precio);
          setGarantia(currentVisit.Garantia);
          setFecha(new Date(currentVisit.Fecha).toISOString().split('T')[0]);
          setFormaPago(currentVisit.FormaPago);
          setFechaCobro(new Date(currentVisit.FechaCobro).toISOString().split('T')[0]);
          setIdPersonal(currentVisit.IdPersonal);
        }
      })
      .catch(error => console.log("Error: ", error));
  }, [id]);

  const handleSubmit = (event) => {
    event.preventDefault();

    axios.put(`http://localhost:8081/visitaupdate/${id}`, {
        Descripcion,
        IdEquipamiento,
        IdEstado,
        Precio,
        Garantia,
        Fecha,
        IdPersonal: Array.isArray(IdPersonal) ? IdPersonal.join(',') : '',
        FormaPago,
        FechaCobro,
    })
    .then(res => {
        console.log(res);
        navigate('../datos');
    })
    .catch(error => {
        console.error('Error al actualizar la visita:', error);
    });
  };
  
  return (
    <>
    <div className="container my-5" style={{border: '1px solid #001461'}}>
      <h2 className="text-center mb-3">Editar Visita</h2>
      <div className="row">
        <div className="col-lg-6 mx-auto">
          <form onSubmit={handleSubmit}>

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

            <label className="col-sm-4 col-form-label">Equipamiento</label>
            <div className="col-sm-8">
              <select
                className="form-control"
                name="Equipamiento"
                multiple
                autoComplete="off"
                value={IdEquipamiento} 
                onChange={e => {
                  const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                  setIdEquipamiento(selectedOptions);
                }}
              >
                {dataEquipamiento && dataEquipamiento.map((equipamiento) => (
                  <option key={equipamiento.IdEquipamiento} value={equipamiento.IdEquipamiento}>
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

              <br />
            <div className="row">
              <div className="offset-sm-4 col-sm-4 d-grid">
                <button type="submit" className="btn btn-primary btn-sm me-3">Guardar</button>
              </div>
              <div className="col-sm-4 d-grid">
                <Link to={`../datos`} type="button" className="btn btn-danger me-2">Cancelar</Link>
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
