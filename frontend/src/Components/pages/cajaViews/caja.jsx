import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import './caja.css';
import Rouben from '../../../Assets/Rouben.otf';

export function Caja() {
  const [content, setContent] = useState(null);
  const userRole = localStorage.getItem('userRole'); // Obtener el rol del usuario

  useEffect(() => {
    if (userRole != 2) {
      setContent(<DatosList ShowForm={ShowForm} />);
    }
  }, [userRole]);

  function ShowList() {
    setContent(<DatosList ShowForm={ShowForm} />);
  }

  function ShowForm() {
    setContent(<DatosForm ShowList={ShowList} />);
  }

  return (
    <div className="container my-5 caja-container" style={{border: '1px solid #001461'}}>
      {content}
    </div>
  );
}

function DatosList(props) {
  const [dataCaja, setDataCaja] = useState([]);
  const userRole = localStorage.getItem('userRole'); // Obtener el rol del usuario

  function fetchCaja() {
    axios.get(`${import.meta.env.VITE_API_URL}/getCaja.php`, {
      params: { rol: userRole } // Pasar el rol como parámetro de la consulta
    })
    .then(res => setDataCaja(res.data))
    .catch((error) => console.log("Error: ", error));
  }

  useEffect(() => fetchCaja(), [userRole]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/deleteCaja.php`, {
        params: { id: id }
      });
      fetchCaja();
    } catch (error) {
      console.log(error);
    }
  }
  

  return (
    <>
    <style>{`
        @font-face {
          font-family: 'Rouben';
          src: url(${Rouben}) format('opentype');
        }
      `}</style>
      <h2 className="text-center mb-3" style={{ fontFamily: 'Rouben, sans-serif' }}>FLUJO DE CAJA</h2>
      <button onClick={() => props.ShowForm()} type="button" className="btn btn-primary me-2" style={{ backgroundColor: '#140097', borderColor: '#140097' }}>Crear</button>
      <button onClick={() => fetchCaja()} type="button" className="btn btn-outline-primary me-2" style={{ borderColor: '#140097', color: '#140097' }}>Actualizar</button>
      <table className="table caja-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Detalle</th>
            <th>Ingreso</th>
            <th>Egreso</th>
            <th>Saldo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {dataCaja.map((dato, index) => (
            <tr key={index}>
              <td>{format(new Date(dato.fecha), 'dd-MM-yyyy')}</td>
              <td>{dato.detalle}</td>
              <td>{dato.ingreso}</td>
              <td>{dato.egreso}</td>
              <td>{dato.saldo}</td>
              <td style={{ whiteSpace: "nowrap" }}>
                <Link to={`/cajaUpdate/${dato.id}`} className="btn btn-primary btn-sm me-2" style={{ backgroundColor: '#140097', borderColor: '#140097' }}>
                    Editar
                </Link>
                <button type="button" className="btn btn-danger btn-sm" onClick={e => handleDelete(dato.id)} style={{ backgroundColor: '#ae2012', borderColor: '#ae2012' }}>
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

function DatosForm(props) {
  const [formValues, setFormValues] = useState({
    fecha: '',
    detalle: '',
    ingreso: 0,
    egreso: 0
  });
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    axios.post(`${import.meta.env.VITE_API_URL}/postCaja.php`, formValues)
      .then(res => {
        console.log(res);
        navigate(props.ShowList());
      })
      .catch(error => {
        console.error('Error al crear el registro:', error);
      });
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  }

  return (
    <>
      <h2 className="text-center mb-3">Crear nuevo Registro</h2>
      <div className="row bm-3">
        <div className="col-lg-6 mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">Fecha</label>
              <div className="col-sm-8">
                <input
                  className="form-control"
                  type="date"
                  name="fecha"
                  value={formValues.fecha}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">Detalle</label>
              <div className="col-sm-8">
                <input
                  className="form-control"
                  type="text"
                  name="detalle"
                  value={formValues.detalle}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">Ingreso</label>
              <div className="col-sm-8">
                <input
                  className="form-control"
                  type="number"
                  name="ingreso"
                  value={formValues.ingreso}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">Egreso</label>
              <div className="col-sm-8">
                <input
                  className="form-control"
                  type="number"
                  name="egreso"
                  value={formValues.egreso}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="offset-sm-4 col-sm-4 d-grid">
                <button type="submit" className="btn btn-primary btn-sm me-3">Guardar</button>
              </div>
              <div className="col-sm-4 d-grid">
                <button onClick={() => props.ShowList()} type="button" className="btn btn-danger me-2">Cancelar</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Caja;
