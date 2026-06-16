import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navbar, Footer } from './Components/pages/layout';
import { Home } from './Components/pages/home';
import { Datos } from './Components/pages/datosViews/datos';
import { DatosUpdate } from './Components/pages/datosViews/datosUpdate';
import DatosDetalle from './Components/pages/datosViews/datosDetalle';
import { Clientes } from './Components/pages/clienteViews/cliente';
import { EquipoUpdate } from './Components/pages/equipoViews/equipoUpdate';
import { LoginForm } from './Components/LoginForm/LoginForm';
import { Caja } from './Components/pages/cajaViews/caja';
import { Personal } from './Components/pages/personalViews/personal';
import { PersonalUpdate } from './Components/pages/personalViews/personalUpdate';
import { CajaUpdate } from './Components/pages/cajaViews/cajaUpdate';
import { Busqueda } from './Components/pages/busquedaViews/busqueda';
import { ClienteDetalle } from './Components/pages/clienteViews/clienteDetalle';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [showCacheAlert, setShowCacheAlert] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('lopardo_theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('lopardo_theme', theme);
  }, [theme]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthenticated(true);
    }

    const cacheNotified = localStorage.getItem('lopardo_v3_cache_2026');
    if (!cacheNotified) {
      setShowCacheAlert(true);
    }
  }, []);

  const handleDismissAlert = () => {
    localStorage.setItem('lopardo_v3_cache_2026', 'true');
    setShowCacheAlert(false);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Toaster position="top-right" reverseOrder={false} />
      
      {/* La alerta de caché ahora solo se muestra si el usuario está realmente autenticado */}
      {authenticated && showCacheAlert && (
        <div className="alert alert-warning alert-dismissible fade show m-0 text-center" role="alert" style={{ borderRadius: 0 }}>
          ⚠️ <strong>¡Actualización del sistema!</strong> Limpia la caché con Ctrl + F5 para ver los cambios.
          <button type="button" zclassName="btn-close" aria-label="Close" onClick={handleDismissAlert}></button>
        </div>
      )}

      {/* CORRECCIÓN: La Navbar ahora solo aparece si el usuario está logueado */}
      {authenticated && <Navbar setAuthenticated={setAuthenticated} theme={theme} setTheme={setTheme} />}
      
      <Routes>
        <Route path='/' element={authenticated ? <Home /> : <Navigate to='/login' replace />} />
        <Route path='/datos' element={authenticated ? <Datos /> : <Navigate to='/login' replace />} />
        <Route path='/cliente' element={authenticated ? <Clientes /> : <Navigate to='/login' replace />} />
        <Route
          path='/clientesdetalle/:id'
          element={authenticated ? <ClienteDetalle /> : <Navigate to='/login' replace />}
        />
        <Route path='/update/:id' element={authenticated ? <EquipoUpdate /> : <Navigate to='/login' replace />} />
        <Route path='/updatevisita/:id' element={authenticated ? <DatosUpdate /> : <Navigate to='/login' replace />} />
        <Route path='/datosdetalle/:id' element={authenticated ? <DatosDetalle /> : <Navigate to='/login' replace />} />
        <Route path='/caja' element={authenticated ? <Caja /> : <Navigate to='/login' replace />} />
        <Route path='/personal' element={authenticated ? <Personal /> : <Navigate to='/login' replace />} />
        <Route path="/cajaUpdate/:id" element={authenticated ? <CajaUpdate /> : <Navigate to='/login' replace />} />
        <Route path="/personalUpdate/:id" element={authenticated ? <PersonalUpdate /> : <Navigate to='/login' replace />} />
        <Route path='/busqueda' element={authenticated ? <Busqueda /> : <Navigate to='/busqueda' replace />} />
        <Route path='/login' element={<LoginForm setAuthenticated={setAuthenticated} />} />
      </Routes>
      
      {authenticated && <Footer />}
    </div>
  );
}

export default App;