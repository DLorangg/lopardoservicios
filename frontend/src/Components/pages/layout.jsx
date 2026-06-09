import React from 'react';

import CirculoLogo from '../../Assets/Circulo_Logo.png';
import SearchIcon from '../../Assets/search.png';  
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MoonFill, SunFill, BoxArrowRight } from 'react-bootstrap-icons';
import './layout.css';

export function Navbar({ setAuthenticated, theme, setTheme }) {
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
    <nav className="navbar navbar-expand-lg box-shadow py-3 mb-3">
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
              <Link className="nav-link" to="/datos" id="datos">Visita</Link>
            </li>
            <li className={`nav-item ${location.pathname === '/cliente' ? 'active' : ''}`}>
              <Link className="nav-link" to="/cliente" id="cliente">Clientes</Link>
            </li>
            <li className={`nav-item ${location.pathname === '/caja' ? 'active' : ''}`}>
              <Link className="nav-link" to="/caja" id="caja">Caja</Link>
            </li>
            <li className={`nav-item ${location.pathname === '/personal' ? 'active' : ''}`}>
              <Link className="nav-link" to="/personal" id="personal">Personal</Link>
            </li>
            <li className={`nav-item ${location.pathname === '/busqueda' ? 'active' : ''}`}>
              <Link className="nav-link" to="/busqueda" id="busqueda">
                <img src={SearchIcon} alt="Búsqueda" style={{ width: '24px', marginRight: '8px' }} />
              </Link>
            </li>
          </ul>
        </div>
        <div className="d-flex align-items-center">
          <button 
            type="button"
            className="btn btn-link nav-link me-3 p-0 border-0" 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
          >
            {theme === 'light' ? <MoonFill size={20} className="nav-icon-theme" /> : <SunFill size={20} className="nav-icon-theme" />}
          </button>
          <span className="me-3 username-text" style={{ fontWeight: 'bold' }}>{userName}</span> 
          <BoxArrowRight
            size={20}
            className="nav-icon-theme"
            style={{ cursor: 'pointer' }}
            onClick={handleLogout}
            title="Cerrar sesión"
          />
        </div>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="bg-body-tertiary border-top mt-auto py-3">
      <small className="d-block text-secondary text-center">&copy; 2024 - Lopardo</small>
    </footer>
  );
}
