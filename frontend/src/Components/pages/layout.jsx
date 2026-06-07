import React from 'react';
import LogoutIcon from '../../Assets/logout.png';
import CirculoLogo from '../../Assets/Circulo_Logo.png';
import SearchIcon from '../../Assets/search.png';  
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './layout.css';

export function Navbar({ setAuthenticated }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    toast.success("Sesión cerrada correctamente. ¡Hasta luego!");
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setAuthenticated(false);
    navigate('/login');
  };

  const userName = localStorage.getItem('userName');

  return (
    <nav className="navbar navbar-expand-lg navbar-light box-shadow py-3 mb-3">
      <div className="container" id='custom-navbar'>
        <Link className="navbar-brand" to="/">
          <img src={CirculoLogo} alt="Logo Completo" className="rotate-animation" style={{ width: '80px' }} />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className={`nav-item ${location.pathname === '/datos' ? 'active' : ''}`}>
              <Link className="nav-link text-dark" to="/datos" id="datos">Visita</Link>
            </li>
            <li className={`nav-item ${location.pathname === '/cliente' ? 'active' : ''}`}>
              <Link className="nav-link text-dark" to="/cliente" id="cliente">Clientes</Link>
            </li>
            <li className={`nav-item ${location.pathname === '/caja' ? 'active' : ''}`}>
              <Link className="nav-link text-dark" to="/caja" id="caja">Caja</Link>
            </li>
            <li className={`nav-item ${location.pathname === '/personal' ? 'active' : ''}`}>
              <Link className="nav-link text-dark" to="/personal" id="personal">Personal</Link>
            </li>
            <li className={`nav-item ${location.pathname === '/busqueda' ? 'active' : ''}`}>
              <Link className="nav-link text-dark" to="/busqueda" id="busqueda">
                <img src={SearchIcon} alt="Búsqueda" style={{ width: '24px', marginRight: '8px' }} />
              </Link>
            </li>
          </ul>
        </div>
        <div className="d-flex align-items-center">
          <span className="text-dark me-3" style={{ fontWeight: 'bold' }}>{userName}</span> 
          <img
            src={LogoutIcon}
            alt="Cerrar sesión"
            className="logout-icon"
            style={{ width: '24px', height: '24px', objectFit: 'contain', cursor: 'pointer' }}
            onClick={handleLogout}
          />
        </div>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="bg-light border-top mt-auto py-3">
      <small className="d-block text-secondary text-center">&copy; 2024 - Lopardo</small>
    </footer>
  );
}
