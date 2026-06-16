import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CalendarCheck, People, CashStack, Search } from 'react-bootstrap-icons';
import Rouben from '../../Assets/Rouben.otf';

export function Home() {
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('loggedIn');
    console.log('Is logged in:', isLoggedIn === 'true');
  }, []);
  
  return (
    <div className="container main-content-container p-4 mt-4">
        <style>{`
        @font-face {
          font-family: 'Rouben';
          src: url(${Rouben}) format('opentype');
        }
        .dashboard-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          height: 180px;
        }
        .dashboard-card svg {
          margin-bottom: 15px;
        }
      `}</style>
      <h2 className="text-center mb-3" style={{ fontFamily: 'Rouben, sans-serif' }}>LOPARDO SERVICIOS</h2>
      <div className="row g-4 justify-content-center">
        <div className="col-12 col-sm-6 col-lg-3">
          <Link to="/datos" className="home-nav-button text-center text-decoration-none text-primary dashboard-card">
            <CalendarCheck size={48} />
            Visitas
          </Link>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <Link to="/cliente" className="home-nav-button text-center text-decoration-none text-primary dashboard-card">
            <People size={48} />
            Clientes
          </Link>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <Link to="/caja" className="home-nav-button text-center text-decoration-none text-primary dashboard-card">
            <CashStack size={48} />
            Caja
          </Link>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <Link to="/busqueda" className="home-nav-button text-center text-decoration-none text-primary dashboard-card">
            <Search size={48} />
            Búsqueda
          </Link>
        </div>
      </div>
    </div>
  );
}
