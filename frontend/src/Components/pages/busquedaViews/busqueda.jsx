import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { parseISO, format } from 'date-fns';
import Rouben from '../../../Assets/Rouben.otf';

export function Busqueda() {
  const [content, setContent] = useState(<BusquedaList ShowForm={ShowForm} />);

  function ShowList() {
    setContent(<BusquedaList ShowForm={ShowForm} />);
  }

  function ShowForm() {
    setContent(<BusquedaForm ShowList={ShowList} />);
  }

  return (
    <div className="container my-5" style={{border: '1px solid #001461'}}>
      {content}
    </div>
  );
}

export function BusquedaList() {
  const [dataVisita, setDataVisita] = useState([]);
  const [dataCliente, setDataCliente] = useState([]);
  const [sortBy, setSortBy] = useState('Fecha'); // Columna por defecto para ordenar por fecha
  const [sortDirection, setSortDirection] = useState('asc'); // Dirección por defecto ascendente (viejas a nuevas)
  const [filters, setFilters] = useState({
    fechaCobro: '',
    fechaDesde: '',
    fechaHasta: '',
    idEstado: '',
    idCliente: ''
  });


  const fetchVisita = () => {
    const userRole = localStorage.getItem('userRole');
    axios.get("https://lopardoservicios.com/backend/routes/getVisitasFiltradas.php", {
      params: { 
        rol: userRole,
        fechaCobro: filters.fechaCobro,
        fechaDesde: filters.fechaDesde,
        fechaHasta: filters.fechaHasta,
        idEstado: filters.idEstado,
        idCliente: filters.idCliente
      }
    })

    .then((response) => {
        setDataVisita(response.data);
    })
    .catch((error) => {
        console.error("Error fetching data:", error);
    });
  };

  function fetchCliente() {
    axios.get("https://lopardoservicios.com/backend/routes/getCliente.php")
      .then((response) => {
        setDataCliente(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  useEffect(() => {
    fetchVisita();
    fetchCliente();
    setSortBy('Fecha');
    setSortDirection('desc');
  }, [filters]);

  const formatFecha = (fecha) => {
    if (!fecha) return "-";
    const fechaISO = parseISO(fecha);
    if (isNaN(fechaISO.getTime())) {
      return "-";
    } else {
      return format(fechaISO, 'dd-MM-yyyy');
    }
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const sortByColumn = (columnName) => {
    if (sortBy === columnName) {
      toggleSortDirection();
    } else {
      setSortBy(columnName);
      setSortDirection('asc'); // Cada vez que se cambie la columna, el orden comienza desde 'asc' (menor a mayor)
    }
  };

  const sortedDataVisita = [...dataVisita].sort((a, b) => {
    if (sortBy === 'Fecha') {
      const fechaA = parseISO(a.Fecha);
      const fechaB = parseISO(b.Fecha);
  
      if (isNaN(fechaA) || isNaN(fechaB)) return 0;
  
      return sortDirection === 'asc' ? fechaA - fechaB : fechaB - fechaA;
    }
  
    if (sortBy === 'Nombre') {
      const nombreA = (dataCliente.find(cliente => cliente.IdCliente === a.IdCliente)?.Nombre || '').toLowerCase();
      const nombreB = (dataCliente.find(cliente => cliente.IdCliente === b.IdCliente)?.Nombre || '').toLowerCase();
  
      if (nombreA < nombreB) return sortDirection === 'asc' ? -1 : 1;
      if (nombreA > nombreB) return sortDirection === 'asc' ? 1 : -1;
  
      // Si los nombres son iguales, ordenamos por fecha
      const fechaA = parseISO(a.Fecha);
      const fechaB = parseISO(b.Fecha);
  
      if (isNaN(fechaA) || isNaN(fechaB)) return 0;
  
      return sortDirection === 'asc' ? fechaA - fechaB : fechaB - fechaA;
    }
  
    // Otros campos genéricos
    if (sortDirection === 'asc') {
      return a[sortBy] < b[sortBy] ? -1 : 1;
    } else {
      return a[sortBy] > b[sortBy] ? -1 : 1;
    }
  });
  

  const handleDelete = (id) => {
    axios.delete(`https://lopardoservicios.com/backend/routes/deleteVisita.php/${id}`)
      .then((response) => {
        console.log(response.data.message);
        fetchVisita();
      })
      .catch((error) => {
        console.error("Error al eliminar la visita:", error);
      });
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  return (
    <>
      <style>{`
        @font-face {
          font-family: 'Rouben';
          src: url(${Rouben}) format('opentype');
        }
      `}</style>
      <h2 className="text-center mb-3" style={{ fontFamily: 'Rouben, sans-serif' }}>BUSQUEDA</h2>
      <div className="row mb-3">
        <div className="col-md-3">
          <label className="form-label">Fecha de Cobro</label>
          <input
            type="date"
            name="fechaCobro"
            className="form-control"
            value={filters.fechaCobro}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Desde</label>
          <input
            type="date"
            name="fechaDesde"
            className="form-control"
            value={filters.fechaDesde}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Hasta</label>
          <input
            type="date"
            name="fechaHasta"
            className="form-control"
            value={filters.fechaHasta}
            onChange={handleFilterChange}
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">Estado</label>
          <select name="idEstado" className="form-select" onChange={handleFilterChange} value={filters.idEstado}>
            <option value="">Todos</option>
            <option value="1">Pendiente</option>
            <option value="2">Completado</option>
            <option value="3">Facturado</option>
            <option value="4">Pagado</option>
            <option value="5">Incompleto</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Cliente</label>
          <select name="idCliente" className="form-select" onChange={handleFilterChange} value={filters.idCliente}>
            <option value="">Todos</option>
            {[...dataCliente]
              .sort((a, b) => a.Nombre.trim().toLowerCase().localeCompare(b.Nombre.trim().toLowerCase()))
              .map(cliente => (
                <option key={cliente.IdCliente} value={cliente.IdCliente}>
                  {cliente.Nombre}
                </option>
            ))}
          </select>

        </div>
      </div>
      <button
        onClick={() => setFilters({ fechaCobro: '', fechaDesde: '', fechaHasta: '', idEstado: '', idCliente: '' })}
        type="button"
        className="btn btn-outline-secondary mb-3"
      >
        Limpiar Filtros
      </button>

      <table className="table">
        <thead>
          <tr>
          <th style={{ width: '15%' }}>
            Cliente{' '}
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() => sortByColumn('Nombre')}
            >
              {sortDirection === 'asc' ? <>&uarr;</> : <>&darr;</>}
            </button>
          </th>


            <th style={{ width: '25%' }}>Dirección</th>
            <th style={{ width: '10%' }}>Precio</th>
            <th style={{ width: '10%' }}>
              Fecha{' '}
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={() => sortByColumn('Fecha')}
              >
                {sortDirection === 'asc' ? <>&uarr;</> : <>&darr;</>}
              </button>
            </th>
            <th style={{ width: '30%', textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sortedDataVisita.map((dato, index) => (
            <tr key={index}>
              <td style={{ width: '15%' }}>{dataCliente.length > 0 && dataCliente.find(cliente => cliente.IdCliente === dato.IdCliente)?.Nombre}</td>
              <td style={{ width: '25%' }}>{dato.Direccion}</td>
              <td style={{ width: '10%' }}>{dato.Precio !== undefined ? `$ ${dato.Precio}` : ''}</td>
              <td style={{ width: '10%' }}>{formatFecha(dato.Fecha)}</td>
              <td style={{ width: '30%', textAlign: 'right' }}>
                <Link to={`/datosdetalle/${dato.IdVisita}`} type="button" className="btn btn-secondary btn-sm me-2">
                  Detalle
                </Link>
                <Link to={`/updatevisita/${dato.IdVisita}`} state={{ from: 'busqueda' }} type="button" className="btn btn-primary btn-sm me-2" style={{ backgroundColor: '#140097', borderColor: '#140097' }}>
                  Editar
                </Link>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  style={{ backgroundColor: '#ae2012', borderColor: '#ae2012' }}
                  onClick={() => handleDelete(dato.IdVisita)}
                >
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

