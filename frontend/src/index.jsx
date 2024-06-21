import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Navbar, Footer } from './Components/pages/layout';
import { Home } from './Components/pages/home';
import { Datos } from './Components/pages/datosViews/datos';
import { DatosUpdate } from './Components/pages/datosViews/datosUpdate';
import { Equipo } from './Components/pages/equipoViews/equipo';
import {EquipoUpdate} from './Components/pages/equipoViews/equipoUpdate';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DatosDetalle from './Components/pages/datosViews/datosDetalle'; // Asegúrate de importar correctamente el componente

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <div style={{ height: '100vh',width:'100vw', display: 'flex', flexDirection: 'column' }}>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/datos' element={<Datos />} />
        <Route path='/equipo' element={<Equipo />} />
        <Route path='/update/:id' element={<EquipoUpdate />} />
        <Route path='/updatevisita/:id' element={<DatosUpdate />} />
        <Route path='/datosdetalle/:id' element={<DatosDetalle />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  </div>
);
