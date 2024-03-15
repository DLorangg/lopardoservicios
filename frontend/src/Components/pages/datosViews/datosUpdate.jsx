import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';

export function DatosUpdate() {

  const [dataCliente, setDataCliente] = useState([]);
  const [dataVisita, setDataVisita] = useState([]);

  // Obtener el id de la visita de las props
  const { id } = useParams();

  useEffect(() => {
    axios.get("http://localhost:8081/cliente")
      .then(res => setDataCliente(res.data))
      .catch((error) => console.log("Error: ", error));

    axios.get("http://localhost:8081/visita")
      .then(res => setDataVisita(res.data))
      .catch((error) => console.log("Error: ", error));
  }, []);

  // Obtener el IdCliente de la visita actual
  const visitaActual = dataVisita.find(visita => visita.id === id);
  const IdClienteVisitaActual = visitaActual ? visitaActual.IdCliente : ''; 

  const [IdCliente, setIdCliente] = useState(IdClienteVisitaActual);
  const [Ciudad, setCiudad] = useState('');
  const [Direccion, setDireccion] = useState('');
  const [Descripcion, setDescripcion] = useState('');
  const [IdEquipamiento, setIdEquipamiento] = useState('');
  const [IdEstado, setIdEstado] = useState('');
  const [Precio, setPrecio] = useState('');
  const [Garantia, setGarantia] = useState('');
  const [Fecha, setFecha] = useState('');

  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();

    axios.put(`http://localhost:8081/visitaupdate/` + id, { IdCliente, Ciudad, Direccion, Descripcion, IdEquipamiento, IdEstado, Precio, Garantia, Fecha })
      .then(res => {
        console.log(res);
        navigate('../equipo');
      })
      .catch(error => {
        console.error('Error al actualizar el equipamiento:', error);
      });
  }

  return (
    <>
      <h2 className="text-center mb-3">Editar Visita</h2>
      <div className="row bm-3">
        <div className="col-lg-6 mx-auto">
          <form onSubmit={handleSubmit}>

            <label className="col-sm-4 col-form-label">Cliente</label>
            <div className="col-sm-8">
              <select className="form-control" name="IdCliente" onChange={e => setIdCliente(e.target.value)} value={IdCliente}>
                {dataCliente && dataCliente.map((cliente) => (
                  <option key={cliente.IdCliente} value={cliente.IdCliente}>
                    {cliente.Nombre}
                  </option>
                ))}
              </select>
            </div>

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

export default DatosUpdate;
