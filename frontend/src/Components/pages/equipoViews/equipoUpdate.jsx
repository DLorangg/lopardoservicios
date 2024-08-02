  import React, { useEffect, useState } from "react";
  import axios from 'axios';
  import {Link, useNavigate, useParams} from 'react-router-dom';

  export function EquipoUpdate ()  {
      const [Nombre, setNombre] = useState('');
      const navigate = useNavigate();
    
      // Se obtiene el IdEquipamiento de las props
      const {id} = useParams();
    
      function handleSubmit(event) {
        event.preventDefault();
    
        // Se realiza la petición PUT al servidor
        axios.put(`http://localhost:8081/equipamientoupdate/`+id , {Nombre })
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
        <div className="container my-5" style={{border: '1px solid #001461'}} >
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
                      value={Nombre} // Se vincula el valor del input con el estado Nombre
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

  export default EquipoUpdate