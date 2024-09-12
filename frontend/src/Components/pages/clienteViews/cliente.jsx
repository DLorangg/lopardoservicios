import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ModalUpdateComponent } from '../modalUpdate';
import { ModalComponent } from '../modal'; // Importa el modal para nuevos clientes

export function Clientes() {
  const [content, setContent] = useState(<ClientesList ShowForm={ShowForm} />);

  function ShowList() {
    setContent(<ClientesList ShowForm={ShowForm} />);
  }

  function ShowForm() {
    setContent(<ClientesForm ShowList={ShowList} />);
  }

  return (
    <div className="container my-5" style={{ border: '1px solid #001461' }}>
      {content}
    </div>
  );
}

export function ClientesList(props) {
  const [dataCliente, setDataCliente] = useState([]);
  const [sortBy, setSortBy] = useState('Nombre'); // Ordenar por 'Nombre' por defecto
  const [sortDirection, setSortDirection] = useState('asc'); // Predeterminado a asc
  const [selectedClient, setSelectedClient] = useState(null); // Cliente seleccionado para editar
  const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal de edición
  const [showCreateModal, setShowCreateModal] = useState(false); // Estado para mostrar el modal de creación

  // Función para obtener datos de clientes desde el servidor
  const fetchCliente = () => {
    axios.get("https://lopardoservicios.com/backend/routes/getCliente.php")
      .then((response) => {
        setDataCliente(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchCliente();
  }, []);

  // Función para cambiar la dirección del ordenamiento
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  // Función para ordenar los datos por la columna seleccionada
  const sortByColumn = (columnName) => {
    setSortBy(columnName);
    toggleSortDirection(); // Cambia automáticamente la dirección del ordenamiento al cambiar la columna
  };

  // Función para ordenar los datos basados en sortBy y sortDirection
  const sortedDataCliente = [...dataCliente].sort((a, b) => {
    const columnA = a[sortBy].toLowerCase(); // Convierte a minúsculas para ordenación alfabética
    const columnB = b[sortBy].toLowerCase();
    if (sortDirection === 'asc') {
      return columnA < columnB ? -1 : 1;
    } else {
      return columnA > columnB ? -1 : 1;
    }
  });

  const handleDelete = (id) => {
    axios.delete(`https://lopardoservicios.com/backend/routes/deleteCliente.php?IdCliente=${id}`)
    .then((response) => {
      console.log(response.data.message);
      fetchCliente(); // Actualiza la lista después de borrar
    })
    .catch((error) => {
      console.error("Error al eliminar el cliente:", error);
    });
  };

  const handleEdit = (cliente) => {
    setSelectedClient(cliente); // Selecciona el cliente
    setShowModal(true); // Abre el modal
    console.log("Cliente seleccionado para editar:", cliente); // Para verificar que el cliente se esté configurando
  };  

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedClient(null); // Limpiar el cliente seleccionado
    fetchCliente(); // Actualizar la lista después de cerrar el modal
  };

  const handleCreate = () => {
    setShowCreateModal(true); // Mostrar el modal de creación
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false); // Cerrar el modal de creación
    fetchCliente(); // Actualizar la lista después de crear el cliente
  };

  return (
    <>
      <h2 className="text-center mb-3" style={{ fontFamily: 'sans-serif' }}>CLIENTES</h2>
      <button onClick={handleCreate} type="button" className="btn btn-primary me-2" style={{ backgroundColor: '#140097', borderColor: '#140097' }}>Crear</button>
      <button onClick={fetchCliente} type="button" className="btn btn-outline-primary me-2" style={{ borderColor: '#140097', color: '#140097' }}>Actualizar</button>
      <table className="table">
        <thead>
          <tr>
            <th style={{ width: '20%' }}>
              Nombre{' '}
              <button onClick={() => sortByColumn('Nombre')} className="btn btn-sm btn-link">
                {sortDirection === 'asc' ? '⬇️' : '⬆️'} {/* Indicador de dirección de orden */}
              </button>
            </th>
            <th style={{ width: '10%' }}>CUIT/CUIL/DNI</th>
            <th style={{ width: '20%' }}>Dirección</th>
            <th style={{ width: '30%' }}>Razón social</th>
            <th style={{ width: '30%' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sortedDataCliente.map((cliente, index) => (
            <tr key={index}>
              <td>{cliente.Nombre}</td>
              <td>{cliente.DNI}</td>
              <td>{cliente.Direccion}</td>
              <td>{cliente.RazonSocial}</td>
              <td>
                <Link to={`/clientesdetalle/${cliente.IdCliente}`} className="btn btn-secondary btn-sm me-2">Detalle</Link>
                <button onClick={() => handleEdit(cliente)} className="btn btn-primary btn-sm me-2" style={{ backgroundColor: '#140097', borderColor: '#140097' }}>Editar</button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(cliente.IdCliente)}
                  style={{ backgroundColor: '#ae2012', borderColor: '#ae2012' }}
                >
                  Borrar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para crear nuevo cliente */}
      <ModalComponent
        show={showCreateModal}
        handleClose={handleCloseCreateModal}
        updateClientes={fetchCliente} // Llamada para actualizar la lista de clientes
      />

      {/* Modal de edición */}
      {showModal && (
        <ModalUpdateComponent
        clienteData={selectedClient}  // Pasar el cliente seleccionado correctamente
        show={showModal}
        handleClose={handleCloseModal}
        updateClientes={fetchCliente}
      />      
      )}
    </>
  );
}
