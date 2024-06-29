import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar, Footer } from './Components/pages/layout';
import { Home } from './Components/pages/home';
import { Datos } from './Components/pages/datosViews/datos';
import { DatosUpdate } from './Components/pages/datosViews/datosUpdate';
import DatosDetalle from './Components/pages/datosViews/datosDetalle';
import { Equipo } from './Components/pages/equipoViews/equipo';
import { EquipoUpdate } from './Components/pages/equipoViews/equipoUpdate';
import { LoginForm } from './Components/LoginForm/LoginForm';
import { Caja } from './Components/pages/cajaViews/caja';
import { CajaUpdate } from './Components/pages/cajaViews/cajaUpdate';
import { Busqueda } from './Components/pages/busquedaViews/busqueda';

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthenticated(true);
    }
  }, []);

  return (
    <div>
      <Navbar setAuthenticated={setAuthenticated} />
      <Routes>
        <Route path='/' element={authenticated ? <Home /> : <Navigate to='/login' replace />} />
        <Route path='/datos' element={authenticated ? <Datos /> : <Navigate to='/login' replace />} />
        <Route path='/equipo' element={authenticated ? <Equipo /> : <Navigate to='/login' replace />} />
        <Route path='/update/:id' element={authenticated ? <EquipoUpdate /> : <Navigate to='/login' replace />} />
        <Route path='/updatevisita/:id' element={authenticated ? <DatosUpdate /> : <Navigate to='/login' replace />} />
        <Route path='/datosdetalle/:id' element={authenticated ? <DatosDetalle /> : <Navigate to='/login' replace />} />
        <Route path='/caja' element={authenticated ? <Caja /> : <Navigate to='/login' replace />} />
        <Route path="/cajaUpdate/:id" element={authenticated ? <CajaUpdate /> : <Navigate to='/login' replace />} />
        <Route path='/busqueda' element={authenticated ? <Busqueda /> : <Navigate to='/busqueda' replace />} />
        <Route path='/login' element={<LoginForm setAuthenticated={setAuthenticated} />} />
      </Routes>
      {authenticated && <Footer />}
    </div>
  );
}

export default App;
