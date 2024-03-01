import React from 'react';
import './LoginForm.css';
import { FaUser, FaLock } from "react-icons/fa";
import LogoCompleto from '../Assets/Logo_Completo.png';

const LoginForm = () => {
    return (
        <div className='wrapper'>
            <form action="">
                <img src={LogoCompleto} alt="Logo" /> 
                <h1>Iniciar sesión</h1>

                <div className="input-box">
                    <input type="text" name="username" id="username" placeholder="Nombre de usuario" required/>
                    <FaUser className='icon'/>            
                </div>

                <div className="input-box">
                    <input type="password" name="password" id="password" placeholder="Contraseña" required/>
                    <FaLock className='icon'/>            
                </div>

                <button type="submit">Iniciar sesión</button>
            </form>
        </div>
    )
}

export default LoginForm;
