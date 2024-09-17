const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: localStorage.getItem('token') || null, // Se debe almacenar en el estado del frontend (y opcionalmente en localStorage). Esto permite que el usuario permanezca autenticado incluso después de cerrar y reabrir el navegador.
			todos: []

			
		},
		actions: {

			crearUsuario: async (userData) => { // Usamos async para poder usar await dentro de esta función
                try {
                    const response = await fetch(`${BACKEND_URL}/signup`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(userData) // Enviar los datos del usuario
                    });
            
                    if (response.ok) {
                        const data = await response.json();
                        console.log("Usuario creado:", data);
                        return true; // Registro exitoso
                    } else {
                        console.error("Error al crear el usuario");
                        return false; // Registro fallido
                    }
                } catch (error) {
                    console.error("Error al crear el usuario:", error);
                    return false; // Registro fallido
                }
            },


            login: async (email, password) => { //esta solicitud al servidor puede ser que tarde, por eso quiero que sea asyncronica, que espere a que termine antes de seguir.
                try {
                    const response = await fetch(`${BACKEND_URL}/login`, { // await se usa para decir "espera aquí hasta que esta tarea termine"
                        method: "POST",
                        body: JSON.stringify({ email, password }), //convierte nuestro correo y contraseña en un formato que el servidor puede entender.
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
            
                    if (response.ok) {
                        const data = await response.json(); //convierte la respuesta del servidor en un formato que podamos usar (en este caso, un objeto con la información del usuario).
                        if (data.token) { // revisa si el servidor nos dio un token. Si sí, eso significa que el inicio de sesión fue exitoso.
                            localStorage.setItem("token", data.token); // Guardar token en localStorage
                            setStore({ token: data.token });
                            setStore({ user: data.user }); // Opcional: almacenar información del usuario
                            return true; // Login exitoso
                        }
                    } else {
                        console.error("Error al iniciar sesión");
                        return false; // Login fallido
                    }
                } catch (error) { //es como una red de seguridad. Si algo sale mal (por ejemplo, si el servidor no responde)
                    console.error("Error del servidor:", error);
                    return false; // Login fallido
                }
            },            

			

			obtenerTareas: () => {
                const token = getStore().token;
                fetch(`${BACKEND_URL}/tareas`, { // URL de las tareas
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` // Añadimos el token JWT
                    }
                })
                .then(response => response.json())
                .then(data => setStore({ todos: data.todos }))
                .catch(error => console.log("Error al obtener tareas:", error));
            },

			añadirTarea: (nuevaTarea) => {
                const store = getStore();
                const actualizarTodos = [...store.todos, nuevaTarea];
                setStore({ todos: actualizarTodos });
                getActions().sincroConServidor(actualizarTodos);
            },

            eliminarTarea: (index, id) => {
                fetch(`${BACKEND_URL}/tareas/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${getStore().token}` // Añadimos el token JWT
                    }
                })
                .then(() => {
                    const store = getStore();
                    const nuevaListaDeTareas = store.todos.filter((_, i) => i !== index);
                    setStore({ todos: nuevaListaDeTareas });
                    getActions().sincroConServidor(nuevaListaDeTareas);
                })
                .catch(error => console.log("Error al eliminar la tarea: ", error));
            },


			borrarTodasLasTareas: () => {
                fetch(`${BACKEND_URL}/tareas`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${getStore().token}` // Añadimos el token JWT
                    }
                })
                .then(() => {
                    setStore({ todos: [] });
                    getActions().sincroConServidor([]);
                })
                .catch(error => console.log("Error al borrar todas las tareas: ", error));
            },


			sincroConServidor: (actualizarTodos) => {
                fetch(`${BACKEND_URL}/tareas`, {
                    method: "PUT",
                    body: JSON.stringify(actualizarTodos),
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${getStore().token}` // Añadimos el token JWT
                    }
                })
                .then(response => response.json())
                .then(data => console.log("Lista sincronizada con el servidor:", data))
                .catch(error => console.log("Error al sincronizar con el servidor: ", error));
            },


			

			
		}
	};
};

export default getState;
