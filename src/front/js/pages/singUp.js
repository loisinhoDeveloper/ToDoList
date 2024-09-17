//Estas funciones enviarán las solicitudes al backend (que se gestiona con Flask en routes.py y models.py), usando fetch para comunicarnos con la API.

import React, { useState, useContext } from 'react';
import { Context } from '../store/flux';  // Importamos el contexto global
import { useNavigate } from 'react-router-dom'; // Importamos el hook useNavigate para la redirección
import "../../styles/singUp.css";

const Signup = () => {
    const { actions } = useContext(Context); // Usamos el contexto para obtener las acciones
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Usamos el hook useNavigate para redirigir

    const handleSignup = async (e) => { //Añadimos async para poder esperar la respuesta de crearUsuario
        e.preventDefault(); // Evitar que el formulario se envíe de forma predeterminada
        const exitoso = await actions.crearUsuario({ email, password }); // Usamos la acción del flux
        if (exitoso) {
            navigate('/login'); // Redirige a la página de login si el registro es exitoso
        }
    };

    return (
        <div className="ContenedorRegistro">
            <form className="formularioRegistro" onSubmit={handleSignup}>
                <h2>Registrarse</h2>
                <input 
                    type="email" 
                    placeholder="Correo electrónico" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Contraseña" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <button className='botonRegistro' type="submit">Registrarse</button>
            </form>
            <p className="enlaceLogin">
                ¿Ya tienes una cuenta? <a href="/login">Inicia sesión aquí</a>
            </p>
        </div>
    );
};

export default Signup;
