import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { parseISO, format } from 'date-fns';
import toast from 'react-hot-toast';
import { Eye, Pencil, Trash } from 'react-bootstrap-icons';
import Rouben from '../../../Assets/Rouben.otf';

// --- FUNCIONES AUXILIARES DE FECHAS (FORMATO ARGENTINO DD/MM/YYYY) ---
const applyDateMask = (val) => {
  const cleanVal = val.replace(/\D/g, '').slice(0, 8);
  if (cleanVal.length > 4) {
    return `${cleanVal.slice(0, 2)}/${cleanVal.slice(2, 4)}/${cleanVal.slice(4)}`;
  } else if (cleanVal.length > 2) {
    return `${cleanVal.slice(0, 2)}/${cleanVal.slice(2)}`;
  }
  return cleanVal;
};

const formatApiDate = (date) => {
  if (!date) return '';
  if (date.length === 10) {
    const parts = date.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
  }
  return '';
};

export function Busqueda() {
  const [content, setContent] = useState(<BusquedaList ShowForm={ShowForm} />);

  function ShowList() {
    setContent(<BusquedaList ShowForm={ShowForm} />);
  }

  function ShowForm() {
    setContent(<BusquedaForm ShowList={ShowList} />);
  }

  return (
    <div className="container my-5 custom-card-container rounded-4 shadow-sm p-4">
      {content}
    </div>
  );
}

export function BusquedaList() {
  const [dataVisita, setDataVisita] = useState([]);
  const [dataCliente, setDataCliente] = useState([]);
  const [sortBy, setSortBy] = useState('Fecha'); // Columna por defecto para ordenar por fecha
  const [sortDirection, setSortDirection] = useState('asc'); // Dirección por defecto ascendente (viejas a nuevas)
  
  // Estados de paginación
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit, setLimit] = useState(50);

  const [filters, setFilters] = useState({
    fechaCobro: '',
    fechaDesde: '',
    fechaHasta: '',
    idEstado: '',
    idCliente: ''
  });

  const fetchVisita = (pageNumber = page, currentLimit = limit) => {
    const userRole = localStorage.getItem('userRole');
    const offset = (pageNumber - 1) * currentLimit;
    
    // Convertir fechas de formato argentino DD/MM/YYYY a YYYY-MM-DD para el backend
    const apiFechaCobro = formatApiDate(filters.fechaCobro);
    const apiFechaDesde = formatApiDate(filters.fechaDesde);
    const apiFechaHasta = formatApiDate(filters.fechaHasta);

    axios.get(`${import.meta.env.VITE_API_URL}/getVisitasFiltradas.php`, {
      params: { 
        rol: userRole,
        fechaCobro: apiFechaCobro,
        fechaDesde: apiFechaDesde,
        fechaHasta: apiFechaHasta,
        idEstado: filters.idEstado,
        idCliente: filters.idCliente,
        limit: currentLimit,
        offset: offset
      }
    })
    .then((response) => {
        setDataVisita(response.data.data || []);
        setTotalRecords(response.data.total || 0);
    })
    .catch((error) => {
        console.error("Error fetching data:", error);
    });
  };

  function fetchCliente() {
    axios.get(`${import.meta.env.VITE_API_URL}/getCliente.php`)
      .then((response) => {
        setDataCliente(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  // Obtener datos iniciales al montar el componente
  useEffect(() => {
    fetchCliente();
    setSortBy('Fecha');
    setSortDirection('desc');
  }, []);

  // Fetch visitas cuando cambian la página, límite o filtros
  useEffect(() => {
    fetchVisita(page, limit);
  }, [page, limit, filters]);

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
    if (window.confirm("¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.")) {
      axios.delete(`${import.meta.env.VITE_API_URL}/deleteVisita.php/${id}`)
        .then((response) => {
          console.log(response.data.message);
          toast.success("Registro eliminado correctamente");
          fetchVisita();
        })
        .catch((error) => {
          console.error("Error al eliminar la visita:", error);
          toast.error("No se pudo eliminar el registro.");
        });
    }
  };

  const handleFilterChange = (event) => {
    let { name, value } = event.target;
    if (name === 'fechaCobro' || name === 'fechaDesde' || name === 'fechaHasta') {
      value = applyDateMask(value);
    }
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(totalRecords / limit));

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
            type="text"
            name="fechaCobro"
            className="form-control"
            placeholder="DD/MM/YYYY"
            maxLength={10}
            value={filters.fechaCobro}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Desde</label>
          <input
            type="text"
            name="fechaDesde"
            className="form-control"
            placeholder="DD/MM/YYYY"
            maxLength={10}
            value={filters.fechaDesde}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Hasta</label>
          <input
            type="text"
            name="fechaHasta"
            className="form-control"
            placeholder="DD/MM/YYYY"
            maxLength={10}
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
        onClick={() => {
          setFilters({ fechaCobro: '', fechaDesde: '', fechaHasta: '', idEstado: '', idCliente: '' });
          setPage(1);
        }}
        type="button"
        className="btn btn-outline-secondary mb-3"
      >
        Limpiar Filtros
      </button>

      <table className="table table-hover align-middle mt-3">
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
            <th className="text-end" style={{ width: '10%' }}>Precio</th>
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
              <td className="text-end" style={{ width: '10%' }}>{dato.Precio !== undefined ? `$ ${dato.Precio}` : ''}</td>
              <td style={{ width: '10%' }}>{formatFecha(dato.Fecha)}</td>
              <td style={{ width: '30%', textAlign: 'right' }}>
                <Link to={`/datosdetalle/${dato.IdVisita}`} className="btn btn-link text-secondary p-1" title="Detalle">
                  <Eye />
                </Link>
                <Link to={`/updatevisita/${dato.IdVisita}`} state={{ from: 'busqueda' }} className="btn btn-link text-primary p-1" title="Editar">
                  <Pencil />
                </Link>
                <button
                  type="button"
                  className="btn btn-link text-danger p-1"
                  title="Borrar"
                  onClick={() => handleDelete(dato.IdVisita)}
                >
                  <Trash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Controles de Paginación */}
      <div className="d-flex justify-content-between align-items-center mt-3 mb-4 flex-wrap gap-3">
        <div className="d-flex align-items-center gap-2">
          <label htmlFor="limit-select" style={{ fontWeight: '500', color: 'var(--brand-text)', marginBottom: 0 }}>
            Filas por página:
          </label>
          <select
            id="limit-select"
            className="form-select form-select-sm"
            style={{ width: 'auto', borderColor: 'var(--brand-primary)', color: 'var(--brand-text)', backgroundColor: 'var(--bs-body-bg)' }}
            value={limit}
            onChange={(e) => {
              setLimit(parseInt(e.target.value, 10));
              setPage(1);
            }}
          >
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={250}>250</option>
          </select>
        </div>

        <div className="d-flex align-items-center gap-3">
          <button
            type="button"
            className="btn btn-outline-primary"
            style={{ borderColor: 'var(--brand-primary)', color: 'var(--brand-primary)' }}
            disabled={page === 1}
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
          >
            Anterior
          </button>
          <span style={{ fontWeight: '500', color: 'var(--brand-text)' }}>
            Página {page} de {totalPages}
          </span>
          <button
            type="button"
            className="btn btn-outline-primary"
            style={{ borderColor: 'var(--brand-primary)', color: 'var(--brand-primary)' }}
            disabled={page >= totalPages}
            onClick={() => setPage(prev => prev + 1)}
          >
            Siguiente
          </button>
        </div>
      </div>
    </>
  );
}

