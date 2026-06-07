import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Pencil, Trash, ArrowClockwise } from 'react-bootstrap-icons';
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
    <div className="container my-5 bg-white rounded-4 shadow-sm p-4">
      {content}
    </div>
  );
}

function DatosList(props) {
  const [dataPersonal, setDataPersonal] = useState([]);

  function fetchPersonal() {
    axios.get(`${import.meta.env.VITE_API_URL}/getPersonal.php`)
    .then(res => setDataPersonal(res.data))
    .catch((error) => console.log("Error: ", error));
  }

  useEffect(() => fetchPersonal(), []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/deletePersonal.php`, {
          params: { IdPersonal: id }
        });
        toast.success("Registro eliminado correctamente");
        fetchPersonal();
      } catch (error) {
        console.log(error);
        toast.error("No se pudo eliminar el registro.");
      }
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
      <button onClick={() => fetchPersonal()} type="button" className="btn btn-outline-secondary"><ArrowClockwise /></button>
      <table className="table table-hover align-middle">
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
                <Link to={`/personalUpdate/${dato.IdPersonal}`} className="btn btn-link text-primary p-1" title="Editar">
                  <Pencil />
                </Link>
                <button type="button" className="btn btn-link text-danger p-1" onClick={e => handleDelete(dato.IdPersonal)} title="Borrar">
                  <Trash />
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
    axios.post(`${import.meta.env.VITE_API_URL}/postPersonal.php`, formValues)
      .then(res => {
        console.log(res);
        toast.success("Cambios guardados con éxito");
        navigate(props.ShowList());
      })
      .catch(error => {
        console.error('Error al crear el registro:', error);
        toast.error("Error al guardar los datos. Inténtalo de nuevo.");
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
