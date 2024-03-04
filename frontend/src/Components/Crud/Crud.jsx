// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Crud.css'

function Crud() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    axios.get('http://localhost:8081/')
      .then(res => {
        console.log(res.data);
        setData(res.data);
      })
      .catch(err => console.log(err));
  }, []);
  return (
    <div>
      <div>
        <h2>Datos</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {data.map((dato, index) => (
              <tr key={index}>
                <td>{index}</td>
                <td>{dato.datitos}</td>
                <td>
                  <button>Editar</button>
                  <button>Borrar</button>
                  <button></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Crud