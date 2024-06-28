import React from 'react';
import LogoutIcon from '../../Assets/logout.png';
import CirculoLogo from '../../Assets/Circulo_Logo.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './layout.css';

export function Navbar({ setAuthenticated }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName'); // Limpiar nombre de usuario al hacer logout
    setAuthenticated(false);
    navigate('/login');
  };

  // Obtener nombre de usuario desde localStorage
  const userName = localStorage.getItem('userName');

  return (
    <nav className="navbar navbar-expand-lg navbar-light border-bottom box-shadow py-3 mb-3" style={{ backgroundColor: '#acafb1' }}>
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src={CirculoLogo} alt="Logo Completo" className="rotate-animation" style={{ width: '80px' }} />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
              <Link className="nav-link text-dark" aria-current="page" to="/" id="home">Home</Link>
            </li>
            <li className={`nav-item ${location.pathname === '/datos' ? 'active' : ''}`}>
              <Link className="nav-link text-dark" to="/datos" id="datos">Datos</Link>
            </li>
            <li className={`nav-item ${location.pathname === '/equipo' ? 'active' : ''}`}>
              <Link className="nav-link text-dark" to="/equipo" id="equipo">Equipo</Link>
            </li>
            <li className={`nav-item ${location.pathname === '/caja' ? 'active' : ''}`}>
              <Link className="nav-link text-dark" to="/caja" id="caja">Caja</Link>
            </li>
          </ul>
        </div>
        <div className="d-flex align-items-center">
          <span className="text-dark me-3">{userName}</span> 
          <img
            src={LogoutIcon}
            alt="Cerrar sesión"
            className="logout-icon"
            style={{ width: '32px', height: '32px', cursor: 'pointer' }}
            onClick={handleLogout}
          />
        </div>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
          <small className="d-block text-muted text-center">&copy; 2024 - Lopardo</small>
  );
}