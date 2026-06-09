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
        .dashboard-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
        }
        .dashboard-card svg {
          margin-bottom: 15px;
        }
      `}</style>
      <h2 className="text-center mb-3" style={{ fontFamily: 'Rouben, sans-serif' }}>LOPARDO SERVICIOS</h2>
      <div className="row g-4 justify-content-center">
        <div className="col-12 col-sm-6 col-lg-3">
          <Link to="/datos" className="custom-card-container bg-comprobante rounded-4 p-4 text-center text-decoration-none shadow-sm text-primary dashboard-card">
            <CalendarCheck size={48} />
            Visitas
          </Link>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <Link to="/cliente" className="custom-card-container bg-comprobante rounded-4 p-4 text-center text-decoration-none shadow-sm text-primary dashboard-card">
            <People size={48} />
            Clientes
          </Link>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <Link to="/caja" className="custom-card-container bg-comprobante rounded-4 p-4 text-center text-decoration-none shadow-sm text-primary dashboard-card">
            <CashStack size={48} />
            Caja
          </Link>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <Link to="/busqueda" className="custom-card-container bg-comprobante rounded-4 p-4 text-center text-decoration-none shadow-sm text-primary dashboard-card">
            <Search size={48} />
            Búsqueda
          </Link>
        </div>
      </div>
    </div>
  );
}
