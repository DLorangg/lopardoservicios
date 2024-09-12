import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Rouben from '../../Assets/Rouben.otf';

export function Home() {
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('loggedIn');
    console.log('Is logged in:', isLoggedIn === 'true');
  }, []);
  
  return (
    <div className="container my-5" style={{border: '1px solid #001461'}}>
        <style>{`
        @font-face {
          font-family: 'Rouben';
          src: url(${Rouben}) format('opentype');
        }
      `}</style>
      <h2 className="text-center mb-3" style={{ fontFamily: 'Rouben, sans-serif' }}>LOPARDO SERVICIOS</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Link to="/datos" style={buttonStyle('#001461')}>Visitas</Link>
        <Link to="/cliente" style={buttonStyle('#140097')}>Clientes</Link>
        <Link to="/caja" style={buttonStyle('#140097')}>Caja</Link>
        <Link to="/busqueda" style={buttonStyle('#001461')}>Búsqueda</Link>
      </div>
    </div>
  );
}

const buttonStyle = (bgColor) => ({
  width: '260px',
  height: '180px',
  backgroundColor: bgColor,
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: 'bold',
  borderRadius: '10px',
  margin: '0 10px',
  marginTop: '30px'
});
