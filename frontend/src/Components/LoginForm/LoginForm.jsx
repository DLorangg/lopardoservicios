import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import LogoCompleto from '../../Assets/Logo_Completo.png';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function LoginForm({ setAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8081/login', {
        username: username,
        password: password,
      });
  
      const { token, userName } = response.data;
  
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('userName', userName); 
        setAuthenticated(true);
        toast.success('Inicio de sesión exitoso');
        navigate('/');
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('userName'); 
        setAuthenticated(false);
        toast.error('Token de autenticación no recibido');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      toast.error('Error al iniciar sesión. Verifica tus credenciales.');
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
      <ToastContainer />
      <div
        style={{
          width: '420px',
          background: 'transparent',
          border: '2px solid rgba(255, 255, 255, .2)',
          backdropFilter: 'blur(30px)',
          boxShadow: '0 0 10px rgba(0, 0, 0, .2)',
          color: '#fff',
          borderRadius: '10px',
          padding: '30px 40px',
          textAlign: 'center',
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
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
          <h1 style={{ fontSize: '36px', marginBottom: '30px' }}>Iniciar sesión</h1>

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
              autoComplete="off"  // Agregar esta línea para desactivar el autocompletado
              style={{
                width: '100%',
                height: '50px',
                background: 'transparent',
                border: '2px solid rgba(255, 255, 255, .2)',
                outline: 'none',
                borderRadius: '40px',
                fontSize: '16px',
                color: '#fff',
                padding: '0 45px 0 20px',
                boxSizing: 'border-box',
              }}
            />
            <FaUser
              className='icon'
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
                border: '2px solid rgba(255, 255, 255, .2)',
                outline: 'none',
                borderRadius: '40px',
                fontSize: '16px',
                color: '#fff',
                padding: '0 45px 0 20px',
                boxSizing: 'border-box',
              }}
            />
            <FaLock
              className='icon'
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
            style={{
              width: '100%',
              height: '45px',
              background: '#fff',
              border: 'none',
              outline: 'none',
              borderRadius: '40px',
              boxShadow: '0 0 10px rgba(0, 0, 0, .1)',
              cursor: 'pointer',
              fontSize: '16px',
              color: '#333',
              fontWeight: '700',
            }}
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
}