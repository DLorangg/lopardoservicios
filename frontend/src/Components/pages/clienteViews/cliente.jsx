import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ModalUpdateComponent } from '../modalUpdate';
import { ModalComponent } from '../modal'; // Importa el modal para nuevos clientes
import toast from 'react-hot-toast';
import { Eye, Pencil, Trash, ArrowClockwise } from 'react-bootstrap-icons';

export function Clientes() {
  const [content, setContent] = useState(<ClientesList ShowForm={ShowForm} />);

  function ShowList() {
    setContent(<ClientesList ShowForm={ShowForm} />);
  }

  function ShowForm() {
    setContent(<ClientesForm ShowList={ShowList} />);
  }

  return (
    <div className="container my-5 bg-white rounded-3 shadow-sm p-4" style={{ border: '1px solid rgba(0, 0, 0, 0.05)' }}>
      {content}
    </div>
  );
}

export function ClientesList(props) {
  const [dataCliente, setDataCliente] = useState([]);
  const [sortBy, setSortBy] = useState('Nombre'); 
  const [sortDirection, setSortDirection] = useState('asc'); 
  const [selectedClient, setSelectedClient] = useState(null); 
  const [showModal, setShowModal] = useState(false); 
  const [showCreateModal, setShowCreateModal] = useState(false); 

  const fetchCliente = () => {
    axios.get(`${import.meta.env.VITE_API_URL}/getCliente.php`)
      .then((response) => setDataCliente(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    fetchCliente();
  }, []);

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const sortByColumn = (columnName) => {
    setSortBy(columnName);
    toggleSortDirection();
  };

  const sortedDataCliente = [...dataCliente].sort((a, b) => {
    const columnA = a[sortBy].toLowerCase(); 
    const columnB = b[sortBy].toLowerCase();
    if (sortDirection === 'asc') {
      return columnA < columnB ? -1 : 1;
    } else {
      return columnA > columnB ? -1 : 1;
    }
  });

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.")) {
      axios.delete(`${import.meta.env.VITE_API_URL}/deleteCliente.php?IdCliente=${id}`)
      .then((response) => {
        console.log(response.data.message);
        toast.success("Registro eliminado correctamente");
        fetchCliente(); 
      })
      .catch((error) => {
        console.error("Error al eliminar el cliente:", error);
        toast.error("No se pudo eliminar el registro.");
      });
    }
  };

  const handleEdit = (cliente) => {
    setSelectedClient(cliente); 
    setShowModal(true); 
  };  

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedClient(null); 
    fetchCliente(); 
  };

  const handleCreate = () => setShowCreateModal(true); 
  const handleCloseCreateModal = () => {
    setShowCreateModal(false); 
    fetchCliente(); 
  };

  // NUEVO: Función para hacer scroll a una letra específica
  const scrollToLetter = (letter) => {
    // Busca el índice del primer cliente cuyo nombre empiece con la letra
    const index = sortedDataCliente.findIndex(c => 
      c.Nombre.toUpperCase().startsWith(letter)
    );

    if (index !== -1) {
      const element = document.getElementById(`cliente-row-${index}`);
      if (element) {
        // Hace un scroll suave y centra el elemento en la pantalla
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  // NUEVO: Funciones para scroll rápido arriba/abajo
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollToBottom = () => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });

  // NUEVO: Array del abecedario
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

  return (
    <>
      <h2 className="text-center mb-3" style={{ fontFamily: 'sans-serif' }}>CLIENTES</h2>
      <button onClick={handleCreate} type="button" className="btn btn-primary me-2" style={{ backgroundColor: '#140097', borderColor: '#140097' }}>Crear</button>
      <button onClick={fetchCliente} type="button" className="btn btn-outline-secondary me-2" title="Actualizar">
        <ArrowClockwise />
      </button>
      <table className="table table-hover align-middle mt-3">
        <thead>
          <tr>
            <th style={{ width: '20%' }}>
              Nombre{' '}
              <button onClick={() => sortByColumn('Nombre')} className="btn btn-sm btn-link text-decoration-none">
                {sortDirection === 'asc' ? '⬇️' : '⬆️'}
              </button>
            </th>
            <th style={{ width: '15%' }}>CUIT/CUIL/DNI</th>
            <th style={{ width: '25%' }}>Dirección</th>
            <th style={{ width: '25%' }}>Razón social</th>
            <th style={{ width: '15%', paddingRight: '20px' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sortedDataCliente.map((cliente, index) => (
            <tr key={index} id={`cliente-row-${index}`}>
              <td>{cliente.Nombre}</td>
              <td>{cliente.DNI}</td>
              <td>{cliente.Direccion}</td>
              <td>{cliente.RazonSocial}</td>
              <td>
                <Link to={`/clientesdetalle/${cliente.IdCliente}`} className="btn btn-link text-secondary p-1" title="Ver detalle">
                  <Eye size={18} />
                </Link>
                <button onClick={() => handleEdit(cliente)} className="btn btn-link text-primary p-1" title="Editar">
                  <Pencil size={18} />
                </button>
                <button
                  className="btn btn-link text-danger p-1"
                  onClick={() => handleDelete(cliente.IdCliente)}
                  title="Borrar"
                >
                  <Trash size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{
        position: 'fixed',
        right: '15px',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f8f9fa',
        padding: '10px 5px',
        borderRadius: '20px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        zIndex: 1000,
        fontSize: '11px',
        fontWeight: 'bold',
        color: '#140097'
      }}>
        {alphabet.map(letter => (
          <span 
            key={letter} 
            onClick={() => scrollToLetter(letter)}
            style={{ cursor: 'pointer', padding: '2px 5px', textAlign: 'center' }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.5)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            {letter}
          </span>
        ))}
      </div>

      <div style={{
        position: 'fixed',
        bottom: '30px',
        right: '15px', // Alineado verticalmente con el abecedario
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 1000
      }}>
        <button 
          onClick={scrollToTop} 
          style={{ 
            backgroundColor: '#f8f9fa', // Mismo color de fondo que el abecedario
            color: '#140097', // Mismo color de texto/icono que el abecedario
            border: 'none', // Sin borde por defecto
            borderRadius: '50%', 
            width: '45px', 
            height: '45px', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            cursor: 'pointer', // Indicador de clic
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // Misma sombra que el abecedario
            fontSize: '18px', // Ajuste de tamaño para el símbolo
            fontWeight: 'bold' // Peso del símbolo
          }}
          title="Ir arriba"
        >
          ↑ 
        </button>
        <button 
          onClick={scrollToBottom} 
          style={{ 
            backgroundColor: '#f8f9fa', // Mismo que el abecedario
            color: '#140097', // Mismo que el abecedario
            border: 'none',
            borderRadius: '50%', 
            width: '45px', 
            height: '45px', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // Misma sombra
            fontSize: '18px', // Ajuste de tamaño
            fontWeight: 'bold' // Peso
          }}
          title="Ir abajo"
        >
          ↓ 
        </button>
      </div>

      <ModalComponent show={showCreateModal} handleClose={handleCloseCreateModal} updateClientes={fetchCliente} />
      
      {showModal && (
        <ModalUpdateComponent clienteData={selectedClient} show={showModal} handleClose={handleCloseModal} updateClientes={fetchCliente} />      
      )}
    </>
  );
}