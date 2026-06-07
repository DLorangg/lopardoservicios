import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import LogoCompleto from '../../Assets/Logo_Completo.png';
import axios from 'axios';
import toast from 'react-hot-toast';

// eslint-disable-next-line react/prop-types
export function LoginForm({ setAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('userName');
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/login.php`, {
            username: username,
            password: password,
        });

        // Desestructura los datos de la respuesta
        const { userName, userRole, token } = response.data;

        // Verifica que se reciban el nombre de usuario, el rol y el token
        if (userName && userRole && token) {
            localStorage.setItem('userName', userName);
            localStorage.setItem('userRole', userRole);
            localStorage.setItem('token', token); // Guardar el token
            setAuthenticated(true);
            toast.success("¡Inicio de sesión exitoso! Bienvenido."); // Mostrar el mensaje de éxito

            // Verifica la contraseña para decidir si mostrar el cambio de contraseña
            if (password === '1234') {
                setShowChangePassword(true);
            } else {
                setShowChangePassword(false);
                navigate('/'); // Redirige al home después de iniciar sesión
            }
        } else {
            // Limpia los datos en caso de que no se reciban los datos esperados
            localStorage.removeItem('userName');
            localStorage.removeItem('userRole');
            localStorage.removeItem('token');
            setAuthenticated(false);
            toast.error('No se recibieron datos de usuario válidos');
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        if (error.response && error.response.status === 401) {
            toast.error("Credenciales incorrectas. Inténtalo de nuevo.");
        } else {
            toast.error('Error al iniciar sesión. Verifica tus credenciales.');
        }
    }
  };


  const handleChangePassword = async () => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/updatePassword.php`, {
        username: username,
        currentPassword: password,
        newPassword: newPassword,
      });

      toast.success(response.data.message || 'Contraseña cambiada exitosamente');
      setNewPassword('');
      setShowChangePassword(false); // Ocultar el formulario después de cambiar la contraseña
      navigate('/'); // Redirigir al home después de cambiar la contraseña
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      toast.error('Error al cambiar la contraseña. Verifica tus datos.');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'radial-gradient(circle, rgba(15,111,187,1) 31%, rgba(20,20,103,1) 88%)',
      }}
    >
      <style>{`
        body {
          margin: 0;
          padding: 0;
          font-family: "Poppins", sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          min-height: 100vh;
          background: radial-gradient(circle, rgba(15,111,187,1) 31%, rgba(20,20,103,1) 88%);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        input::placeholder {
          color: #ccc; /* Cambia el color del texto del placeholder */
        }
      `}</style>
      <div
        className="bg-white rounded-4 shadow-lg text-dark"
        style={{
          width: '420px',
          padding: '30px 40px',
          textAlign: 'center',
          border: '1px solid rgba(0, 0, 0, .1)'
        }}
      >
        <form
          onSubmit={handleLogin}
          style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}
        >
          <img
            src={LogoCompleto}
            alt='Logo'
            style={{
              width: '40%',
              height: 'auto',
              maxWidth: '100%',
              display: 'block',
              margin: '0 auto 30px',
            }}
          />
          <h1 className="text-dark" style={{ fontSize: '36px', marginBottom: '30px' }}>Iniciar sesión</h1>

          <div
            style={{
              position: 'relative',
              width: '100%',
              margin: '20px 0',
            }}
          >
            <input
              type='text'
              name='username'
              id='username'
              placeholder='Nombre de usuario'
              required
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
              style={{
                width: '100%',
                height: '50px',
                background: 'transparent',
                border: '1px solid #ced4da',
                outline: 'none',
                borderRadius: '40px',
                fontSize: '16px',
                color: '#212529',
                padding: '0 45px 0 20px',
                boxSizing: 'border-box',
              }}
            />
            <FaUser
              className='icon text-secondary'
              style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '16px',
              }}
            />
          </div>

          <div
            style={{
              position: 'relative',
              width: '100%',
              margin: '20px 0',
            }}
          >
            <input
              type='password'
              name='password'
              id='password'
              placeholder='Contraseña'
              required
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                height: '50px',
                background: 'transparent',
                border: '1px solid #ced4da',
                outline: 'none',
                borderRadius: '40px',
                fontSize: '16px',
                color: '#212529',
                padding: '0 45px 0 20px',
                boxSizing: 'border-box',
              }}
            />
            <FaLock
              className='icon text-secondary'
              style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '16px',
              }}
            />
          </div>

          <button
            type='submit'
            className="btn btn-primary w-100"
            style={{
              height: '45px',
              borderRadius: '40px',
              fontSize: '16px',
              fontWeight: '700',
            }}
          >
            Ingresar
          </button>

          {showChangePassword && (
            <div style={{ marginTop: '20px' }}>
              <label htmlFor='newPassword' style={{ color: '#212529', fontSize: '16px', display: 'block', marginBottom: '8px' }}>Nueva contraseña:</label>
              <input
                type='password'
                name='newPassword'
                id='newPassword'
                placeholder='Ingresa tu nueva contraseña'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{
                  width: '100%',
                  height: '50px',
                  background: 'transparent',
                  border: '1px solid #ced4da',
                  outline: 'none',
                  borderRadius: '40px',
                  fontSize: '16px',
                  color: '#212529',
                  padding: '0 45px 0 20px',
                  boxSizing: 'border-box',
                }}
              />
              <button
                type='button'
                onClick={handleChangePassword}
                className="btn btn-secondary w-100"
                style={{
                  marginTop: '15px',
                  borderRadius: '40px',
                  fontWeight: '700',
                  fontSize: '16px',
                }}
              >
                Cambiar contraseña
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
