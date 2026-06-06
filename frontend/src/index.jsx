import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client'; 
import App from './App';
import axios from 'axios'; // Importamos axios

// --- INTERCEPTOR GLOBAL DE AXIOS ---
axios.interceptors.request.use(
  (config) => {
    // Buscamos el token guardado en el navegador
    const token = localStorage.getItem('token');
    if (token) {
      // Si existe, lo inyectamos en los encabezados (Headers)
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
// ------------------------------------

const container = document.getElementById('root');
const root = createRoot(container); 

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);