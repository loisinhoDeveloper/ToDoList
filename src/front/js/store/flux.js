const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: localStorage.getItem('token') || null, // Se debe almacenar en el estado del frontend (y opcionalmente en localStorage). Esto permite que el usuario permanezca autenticado incluso después de cerrar y reabrir el navegador.
			todos: []

			
		},
		actions: {

			crearUsuario: (userData) => { // Acepta datos del usuario  que contiene la información necesaria para crear un usuario (como email, password, etc.).
				fetch(`${BACKEND_URL}/signup`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(userData) // Enviar los datos del usuario
				})
				.then(response => response.json())
				.then(data => console.log("Usuario creado:", data))
				.catch(error => console.log("Error al crear el usuario: ", error));
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


			login: (email, password) => {
                fetch(`${BACKEND_URL}/login`, {
                    method: "POST",
                    body: JSON.stringify({ email, password }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                .then(response => response.json())
                .then(data => {
                    if (data.token) {
                        localStorage.setItem("token", data.token); // Guardar token en localStorage
                        setStore({ token: data.token });
                        setStore({ user: data.user }); // También se puede almacenar la información del usuario si es necesario
                    }
                })
                .catch(error => console.log("Error al iniciar sesión: ", error));
            }

			
		}
	};
};

export default getState;
