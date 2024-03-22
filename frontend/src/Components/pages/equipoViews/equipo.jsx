import React, { useEffect, useState } from "react";
import axios from 'axios';
import {Link, useNavigate, useParams} from 'react-router-dom';

export function Equipo() {
  const [content, setContent] = useState(<DatosList ShowForm={ShowForm}  />);

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



function DatosList(props) {

  const [dataEquipo, setDataEquipo] = useState([]);
 

  function fetchEquipo() {
    axios.get("http://localhost:8081/equipamiento")
      .then(res => setDataEquipo(res.data))
      .catch((error) => console.log("Error: ", error));
  }

 
  useEffect(() => fetchEquipo(), []);


  const handleDelete = async (id) => {

    try{
      await axios.delete('http://localhost:8081/equipamiento/'+id)
      window.location.reload()

    }catch(error){
      console.log(error);
    }

  }
  

  return (
    <>
      <h2 className="text-center mb-3">Equipo List</h2>
      <button onClick={() => props.ShowForm()} type="button" className="btn btn-primary me-2">Crear</button>
      <button onClick={() => fetchEquipo()} type="button" className="btn btn-outline-primary me-2">Actualizar</button>
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
           
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {dataEquipo.map((dato, index) => (
            <tr key={index}>
              <td>{dato.Nombre}</td>
           
              <td style={{ width: "10px", whiteSpace: "nowrap" }}>
                <Link  to={`/update/${dato.IdEquipamiento}`} type="button" className="btn btn-primary btn-sm me-2">
                  Editar
                </Link>
                <button type="button" className="btn btn-danger btn-sm" onClick={e => handleDelete(dato.IdEquipamiento)}>
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

  const [Nombre, setNombre] = useState('')
  const navigate = useNavigate();

  function handleSubmit(event) {
  

      event.preventDefault();

      axios.post('http://localhost:8081/equipamientopost',{Nombre})
      .then(res => {
        console.log(res);
        console.log(Nombre);
        navigate(props.ShowList());
      })

  }

  return (
    <>
      <h2 className="text-center mb-3">Crear nuevo Equipo</h2>

      <div className="row bm-3">
        <div className="col-lg-6 mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">Nombre</label>
              <div className="col-sm-8">
                <input className="form-control" name="Nombre" 
                  onChange={e => setNombre(e.target.value)}
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
