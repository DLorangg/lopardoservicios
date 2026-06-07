import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

export function EquipoUpdate() {
  const [Nombre, setNombre] = useState('');
  const [DataEquipamiento, setDataEquipamiento] = useState('');
  const navigate = useNavigate();

  const { id } = useParams();

  function fetchEquipamiento() {
    axios.get(`${import.meta.env.VITE_API_URL}/getEquipamiento.php`)
      .then(res => setDataEquipamiento(res.data))
      .catch((error) => console.log("Error: ", error));
  }

  function fetchEquipamientoDetails() {
    axios.get(`${import.meta.env.VITE_API_URL}/getEquipamientoById/${id}`)
      .then(res => setNombre(res.data.Nombre))
      .catch(error => console.error('Error al obtener los detalles del equipamiento:', error));
  }

  useEffect(() => {
    fetchEquipamiento();
    fetchEquipamientoDetails();
  }, [id]);

  function handleSubmit(event) {
    event.preventDefault();

    axios.put(`${import.meta.env.VITE_API_URL}/putEquipamiento.php/${id}`, { Nombre })
      .then(res => {
        console.log(res);
        toast.success("Cambios guardados con éxito");
        navigate('../equipo');
      })
      .catch(error => {
        console.error('Error al actualizar el equipamiento:', error);
        toast.error("Error al guardar los datos. Inténtalo de nuevo.");
      });
  }

  return (
    <>
      <div className="container my-5 custom-card-container rounded-4 shadow-sm p-4">
        <h2 className="text-center mb-3">Editar Equipo</h2>
        <div className="row bm-3">
          <div className="col-lg-6 mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <label className="col-sm-4 col-form-label">Nombre</label>
                <div className="col-sm-8">
                  <input
                    className="form-control"
                    name="Nombre"
                    value={Nombre}
                    onChange={e => setNombre(e.target.value)}
                  />
                </div>
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
      </div>
    </>
  );
}

export default EquipoUpdate;
