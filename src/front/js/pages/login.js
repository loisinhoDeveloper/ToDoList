//Estas funciones enviarán las solicitudes al backend (que se gestiona con Flask en routes.py y models.py), usando fetch para comunicarnos con la API.

import React, { useState, useContext } from 'react';
import { Context } from '../store/appContext'; // Importamos el contexto global
import { useNavigate } from 'react-router-dom'; // Importamos el hook useNavigate para la redirección
import "../../styles/login.css";

const Login = () => {
    const { actions } = useContext(Context); // contexto para obtener las acciones
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Hook para la redirección

    const handleLogin = async (e) => {
        e.preventDefault(); // Evitar que el formulario se envíe de forma predeterminada
        
        // Llamamos a la acción de login desde flux
        const exitoso = await actions.login(email, password);

        // Si el login fue exitoso (por ejemplo, si se obtiene el token), redirigir a /tareas
        if (exitoso) {
            navigate("/tareas");
        } else {
            console.log("Error en el inicio de sesión");
        }
    };

    return (
        <div className="loginContainer">
            <form className="formularioLogin" onSubmit={handleLogin}>
                <h2 className="login-titulo">Iniciar Sesión</h2>
                <div className="input-login">
                    <i className="fa fa-envelope"></i> 
                    <input 
                        type="email" 
                        placeholder="Correo electrónico" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div className="input-login">
                    <i className="fa fa-lock"></i>
                    <input 
                        type="password" 
                        placeholder="Contraseña" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button className="buttonLogin" type="submit">Login</button>
            </form>
            <p className="remember-forgot-box">
                ¿No tienes una cuenta? <a href="/signup">Registrarse</a>
            </p>
        </div>
    );
};

export default Login;
