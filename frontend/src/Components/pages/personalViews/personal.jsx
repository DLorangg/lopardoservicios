import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './personal.css';
import Rouben from '../../../Assets/Rouben.otf';

export function Personal() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    setContent(<DatosList ShowForm={ShowForm} />);
  }, []);

  function ShowList() {
    setContent(<DatosList ShowForm={ShowForm} />);
  }

  function ShowForm() {
    setContent(<DatosForm ShowList={ShowList} />);
  }

  return (
    <div className="container my-5 personal-container" style={{border: '1px solid #001461'}}>
      {content}
    </div>
  );
}

function DatosList(props) {
  const [dataPersonal, setDataPersonal] = useState([]);

  function fetchPersonal() {
    axios.get("https://lopardoservicios.com/backend/routes/getPersonal.php")
    .then(res => setDataPersonal(res.data))
    .catch((error) => console.log("Error: ", error));
  }

  useEffect(() => fetchPersonal(), []);

  const handleDelete = async (id) => {
    try {
      await axios.delete('https://lopardoservicios.com/backend/routes/deletePersonal.php', {
        params: { IdPersonal: id }
      });
      fetchPersonal();
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
      <h2 className="text-center mb-3" style={{ fontFamily: 'Rouben, sans-serif' }}>PERSONAL</h2>
      <button onClick={() => props.ShowForm()} type="button" className="btn btn-primary me-2" style={{ backgroundColor: '#140097', borderColor: '#140097' }}>Crear</button>
      <button onClick={() => fetchPersonal()} type="button" className="btn btn-outline-primary me-2" style={{ borderColor: '#140097', color: '#140097' }}>Actualizar</button>
      <table className="table personal-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {dataPersonal.map((dato, index) => (
            <tr key={index}>
              <td>{dato.IdPersonal}</td>
              <td>{dato.Nombre}</td>
              <td style={{ whiteSpace: "nowrap" }}>
                <Link to={`/personalUpdate/${dato.IdPersonal}`} className="btn btn-primary btn-sm me-2" style={{ backgroundColor: '#140097', borderColor: '#140097' }}>
                    Editar
                </Link>
                <button type="button" className="btn btn-danger btn-sm" onClick={e => handleDelete(dato.IdPersonal)} style={{ backgroundColor: '#ae2012', borderColor: '#ae2012' }}>
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
    Nombre: '',
  });
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    axios.post('https://lopardoservicios.com/backend/routes/postPersonal.php', formValues)
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
      <h2 className="text-center mb-3">Crear nuevo Personal</h2>
      <div className="row bm-3">
        <div className="col-lg-6 mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">Nombre</label>
              <div className="col-sm-8">
                <input
                  className="form-control"
                  type="text"
                  name="Nombre"
                  value={formValues.Nombre}
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

export default Personal;
