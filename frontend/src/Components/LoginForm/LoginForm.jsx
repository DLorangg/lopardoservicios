// eslint-disable-next-line no-unused-vars
import React, {useState} from 'react';
import './LoginForm.css';
import { FaUser, FaLock } from "react-icons/fa";
import LogoCompleto from '../../Assets/Logo_Completo.png';
import axios from 'axios'

const LoginForm = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    function handleSubmit(event){
        event.preventDefault()
        axios.post('http://localhost:8081/login', {username, password})
        .then(res => console.log(res))
        .catch(err => console.log(err))
    }
    return (
        <div className='wrapper'>
            <form onSubmit={handleSubmit}>
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
    )
}

export default LoginForm;
