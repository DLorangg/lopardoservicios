import React, { useState } from 'react';
import './LoginForm.css';
import { FaUser, FaLock } from "react-icons/fa";
import LogoCompleto from '../../Assets/Logo_Completo.png';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginForm = ({ setLoggedIn }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        axios.post('http://localhost:8081/login', {username, password})
        .then(res => {
            localStorage.setItem('loggedIn', 'true');
            setLoggedIn(true);
        })
        .catch(err => {
            console.log(err);
            toast.error('Error de inicio de sesión. Por favor, inténtelo de nuevo.');
        });
    };

    if (localStorage.getItem('loggedIn') === 'true') {
        return <Navigate to='/' replace />;
    }

    return (
        <div>
            <ToastContainer/> 
            <div className='wrapper'>
                <form onSubmit={e => {
                    e.preventDefault();
                    handleLogin();
                }}>
                    <img src={LogoCompleto} alt="Logo" /> 
                    <h1>Iniciar sesión</h1>

                    <div className="input-box">
                        <input type="text" name="username" id="username" placeholder="Nombre de usuario" required
                        onChange={e => setUsername(e.target.value)}/>
                        <FaUser className='icon'/>            
                    </div>

                    <div className="input-box">
                        <input type="password" name="password" id="password" placeholder="Contraseña" required
                        onChange={e => setPassword(e.target.value)}/>
                        <FaLock className='icon'/>            
                    </div>

                    <button type="submit">Iniciar sesión</button>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;
