import React, { useEffect, useState } from "react";
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import { ModalComponent } from "../modal";

export function Datos() {
  const [content, setContent] = useState(<DatosList ShowForm={ShowForm} />);

  function ShowList() {
    setContent(<DatosList ShowForm={ShowForm} />);
  }

  function ShowForm() {
    setContent(<DatosForm ShowList={ShowList} />);
  }

  return (
    <div className="container my-5">
      {content}
    </div>
  );
}

export function DatosList(props) {

  const [dataVisita, setDataVisita] = useState([]);
  const [dataCliente, setDataCliente] = useState([]);

  function fetchVisita() {
    fetch("http://localhost:8081/visita")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error con la respuesta del servidor");
        }
        return response.json();
      })
      .then((data) => {
        setDataVisita(data);
      })
      .catch((error) => console.log("Error: ", error));
  }

  function fetchCliente() {
    fetch("http://localhost:8081/cliente")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error con la respuesta del servidor");
        }
        return response.json();
      })
      .then((data) => {
        setDataCliente(data);
      })
      .catch((error) => console.log("Error: ", error));
  }

  useEffect(() => fetchVisita(), []);
  useEffect(() => fetchCliente(), []);

  return (
    <>
      <h2 className="text-center mb-3">Datos List</h2>
      <button onClick={() => props.ShowForm()} type="button" className="btn btn-primary me-2">Crear</button>
      <button onClick={() => fetchVisita()} type="button" className="btn btn-outline-primary me-2">Actualizar</button>
      <table className="table">
        <thead>
          <tr>
            
            <th>Cliente</th>
            <th>Dirección</th>
            <th>Precio</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {dataVisita.map((dato, index) => (
          
            <tr key={index}>
              <td>{dataCliente.length > 0 && dataCliente.find(cliente => cliente.IdCliente === dato.IdCliente)?.Nombre}</td>
              <td>{dato.Direccion}</td>
              <td>{`$ `+dato.Precio}</td>
              <td>{dato.Fecha}</td>
              <td style={{ width: "10px", whiteSpace: "nowrap" }}>
                <Link  to={`/updatevisita/${dato.IdVisita}`} type="button" className="btn btn-primary btn-sm me-2">
                  Editar
                </Link>
                <button type="button" className="btn btn-danger btn-sm">
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

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    function fetchCliente() {
        fetch("http://localhost:8081/cliente")
          .then((response) => {
            if (!response.ok) {
              throw new Error("Error con la respuesta del servidor");
            }
            return response.json();
          })
          .then((data) => {
            setDataCliente(data);
          })
          .catch((error) => console.log("Error: ", error));
      }

      useEffect(() => fetchCliente(), []);


      const [dataEquipo, setDataEquipo] = useState([]);
 

      function fetchEquipo() {
        axios.get("http://localhost:8081/equipamiento")
          .then(res => setDataEquipo(res.data))
          .catch((error) => console.log("Error: ", error));
      }
    
     
      useEffect(() => fetchEquipo(), []);

      const [dataEstado, setDataEstado] = useState([]);
 

      function fetchEstado() {
        axios.get("http://localhost:8081/estado")
          .then(res => setDataEstado(res.data))
          .catch((error) => console.log("Error: ", error));
      }
    
     
      useEffect(() => fetchEstado(), []);




      const [IdCliente, setIdCliente] = useState('')
      const [Ciudad, setCiudad] = useState('')
      const [Direccion, setDireccion] = useState('')
      const [Descripcion, setDescripcion] = useState('')
      const [IdEquipamiento, setIdEquipamiento] = useState('')
      const [IdEstado, setIdEstado] = useState('')
      const [Precio, setPrecio] = useState('')
      const [Garantia, setGarantia] = useState('')
      const [Fecha, setFecha] = useState('')
      const navigate = useNavigate();
    
      function handleSubmit(event) {
      
    
          event.preventDefault();
    
          axios.post('http://localhost:8081/visitapost',{IdCliente, Ciudad, Direccion, Descripcion, IdEquipamiento, IdEstado, Precio, Garantia, Fecha })
          .then(res => {
            console.log(res);
            console.log(IdCliente);
            console.log("result");
            navigate(props.ShowList());
          })
    
      }
  return (
    <>
      <h2 className="text-center mb-3">Crear una nueva Visita</h2>
     

      <div className="row">
        <div className="col-lg-6 mx-auto">
          <form onSubmit={handleSubmit}>

          <label className="col-sm-4 col-form-label">Cliente</label>
          <div className="col-sm-8 d-flex align-items-center">
            <select className="form-control" name="IdCliente" onChange={e => setIdCliente(e.target.value)}>
              <option value="" disabled hidden selected>Seleccione</option>
              {dataCliente && dataCliente.map((cliente) => (
                <option key={cliente.IdCliente} value={cliente.IdCliente}>
                  {cliente.Nombre}
                </option>
              ))}
              {dataCliente && dataCliente.length === 0 && <option value="">No clients available</option>}
            </select>
            <button type="button" className="btn btn-primary ms-2" onClick={handleShowModal}>
              Crear Cliente
            </button>
          </div>
          <ModalComponent show={showModal} handleClose={handleCloseModal} />

            <label className="col-sm-4 col-form-label">Ciudad</label>
            <div className="col-sm-8">
            <select className="form-control" name="Ciudad"   onChange={e => setCiudad(e.target.value)}>
            <option value="" disabled hidden selected>Seleccione</option>
            {dataCliente && dataCliente.map((cliente) => (
              
                <option key={cliente.IdCliente} value={cliente.Ciudad}>
                {cliente.Ciudad}
                </option>
            ))}
            {dataCliente && dataCliente.length === 0 && <option value="">No clients available</option>}
            </select>

            </div>



            <label className="col-sm-4 col-form-label">Direccion</label>
            <div className="col-sm-8">
            <select className="form-control" name="Direccion"   onChange={e => setDireccion(e.target.value)}>
            <option value="" disabled hidden selected>Seleccione</option>
            {dataCliente && dataCliente.map((cliente) => (
              
                <option key={cliente.IdCliente} value={cliente.Direccion}>
                {cliente.Direccion}
                </option>
            ))}
            {dataCliente && dataCliente.length === 0 && <option value="">No clients available</option>}
            </select>

            </div>

            <label className="col-sm-4 col-form-label">Descripcion</label>
            <div className="col-sm-8">
              <textarea className="form-control" name="Descripcion"  onChange={e => setDescripcion(e.target.value)}/>
            </div>


            <label className="col-sm-4 col-form-label">Equipamiento</label>
            <div className="col-sm-8">
            <select className="form-control" name="IdEquipamiento"   onChange={e => setIdEquipamiento(e.target.value)}>
            <option value="" disabled hidden selected>Seleccione</option>
            {dataEquipo && dataEquipo.map((equipo) => (
              
                <option key={equipo.IdEquipamiento} value={equipo.IdEquipamiento}>
                {equipo.Nombre}
                </option>
            ))}
            {dataEquipo && dataEquipo.length === 0 && <option value="">No clients available</option>}
            </select>

            </div>



            <label className="col-sm-4 col-form-label">Estado</label>
            <div className="col-sm-8">
            <select className="form-control" name="IdEstado"   onChange={e => setIdEstado(e.target.value)}>
            <option value="" disabled hidden selected>Seleccione</option>
            {dataEstado && dataEstado.map((estado) => (
              
                <option key={estado.IdEstado} value={estado.IdEstado}>
                {estado.Estado}
                </option>
            ))}
            {dataEstado && dataEstado.length === 0 && <option value="">No clients available</option>}
            </select>

            </div>
              

            <label className="col-sm-4 col-form-label">Precio</label>
            <div className="col-sm-8">
              <input className="form-control" name="Precio"  onChange={e => setPrecio(e.target.value)}/>
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
                  onChange={() => {
                    setGarantia(1);
                   
                  }}
                  style={{ borderRadius: '0' }}
                />
                <label className="form-check-label" htmlFor="siRadio" style={{ borderRadius: '0' }}>
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
                  onChange={() => {
                    setGarantia(0);
                    
                  }}
                  style={{ borderRadius: '0' }}
                />
                <label className="form-check-label" htmlFor="noRadio" style={{ borderRadius: '0' }}>
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
              />
            </div>
            
      {/* 
            <label className="col-sm-4 col-form-label">Descripcion</label>
            <div className="col-sm-8">
              <textarea className="form-control" name="descripcion" defaultValue="" />
            </div> */}

            <div className="row">
                <div className="offset-sm-4 col-sm-4 d-grid">
                  <button type="submit" className="btn btn-primary btn-sm me-3">Guardar</button>
                </div>
                <div className="col-sm-4 d-grid">
                  <Link to={`../equipo`} type="button" className="btn btn-danger me-2">Cancelar</Link>
                </div>
              </div>
      
          </form>
        </div>
      </div>
    </> 
  );
}