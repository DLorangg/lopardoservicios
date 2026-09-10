import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';

export function NotFound() {
  return (
    <div className="container d-flex flex-column align-items-center justify-content-center flex-grow-1 py-5 text-center my-auto">
      <div className="card shadow-lg p-4 p-md-5 border-0 rounded-4" style={{ maxWidth: '520px', width: '100%' }}>
        <div
          className="mb-4 d-inline-flex justify-content-center align-items-center rounded-circle bg-warning bg-opacity-10 mx-auto"
          style={{ width: '80px', height: '80px' }}
        >
          <FaExclamationTriangle className="text-warning" style={{ fontSize: '40px' }} />
        </div>
        <h1 className="h2 fw-bold mb-2">404 - Página no encontrada</h1>
        <p className="text-secondary mb-4">
          La ruta a la que intentas acceder no existe o fue movida.
        </p>
        <div>
          <Link
            to="/"
            className="btn btn-primary px-4 py-2 rounded-pill fw-semibold shadow-sm d-inline-flex align-items-center gap-2"
          >
            <FaHome /> Volver al Panel
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
