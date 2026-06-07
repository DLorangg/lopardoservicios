import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Rouben from '../../Assets/Rouben.otf';
import { CalendarEvent, People, CashCoin, Search } from 'react-bootstrap-icons';

export function Home() {
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('loggedIn');
    console.log('Is logged in:', isLoggedIn === 'true');
  }, []);
  
  return (
    <div className="container my-5 bg-white rounded-3 shadow-sm p-4" style={{ border: '1px solid rgba(0, 0, 0, 0.05)' }}>
      <style>{`
        @font-face {
          font-family: 'Rouben';
          src: url(${Rouben}) format('opentype');
        }
        .dashboard-card {
          width: 260px;
          height: 180px;
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          font-size: 18px;
          font-weight: bold;
          border-radius: 12px;
          margin: 0 10px;
          margin-top: 30px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .dashboard-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 20px rgba(0, 0, 0, 0.2);
          filter: brightness(1.15);
        }
        .dashboard-card svg {
          margin-bottom: 15px;
        }
      `}</style>
      <h2 className="text-center mb-3" style={{ fontFamily: 'Rouben, sans-serif' }}>LOPARDO SERVICIOS</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
        <Link to="/datos" className="dashboard-card" style={{ backgroundColor: '#001461' }}>
          <CalendarEvent size={44} />
          Visitas
        </Link>
        <Link to="/cliente" className="dashboard-card" style={{ backgroundColor: '#140097' }}>
          <People size={44} />
          Clientes
        </Link>
        <Link to="/caja" className="dashboard-card" style={{ backgroundColor: '#140097' }}>
          <CashCoin size={44} />
          Caja
        </Link>
        <Link to="/busqueda" className="dashboard-card" style={{ backgroundColor: '#001461' }}>
          <Search size={44} />
          Búsqueda
        </Link>
      </div>
    </div>
  );
}
