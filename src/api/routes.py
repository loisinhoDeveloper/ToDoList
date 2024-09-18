from flask import Flask, request, jsonify, Blueprint
from werkzeug.security import generate_password_hash
from api.models import db, User, Tarea 
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
import os


api = Blueprint('api', __name__)


@api.route('/signup', methods=['POST'])
def sign_up():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    # Verificar que se recibieron el email y la contraseña
    if not email or not password:
        return jsonify({"error": "Email y password obligatorios."}), 400
    
    # Verificar si el email ya está en uso
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "El usuario con este correo electronico ya existe."}), 400
    
    # Crear un nuevo usuario
    hashed_password = generate_password_hash(password, method='sha256')  # Crea un nuevo usuario con la contraseña asegurada usando generate_password_hash para su incriptación, usando el algoritmo SHA-256.
    nuevoUsuario = User(email=email, password=hashed_password, is_active=True)
    
    db.session.add(nuevoUsuario)
    db.session.commit()
    
    return jsonify(nuevoUsuario.serialize()), 201
  




@api.route('/login', methods=['POST']) #el endpoint de login es como una puerta, y la llave es tu email y contraseña.
def login():
    body = request.get_json()
    email = body.get('email')
    password = body.get('password')
    
    # Validar la entrada
    if not email or not password:
        return jsonify({"message": "Faltan email o password"}), 400
    
    # Buscar al usuario por email
    user = User.query.filter_by(email=email).first()
    
    #  Una vez que un usuario ha sido autenticado correctamente (es decir, su contraseña ha sido verificada con check_password_hash), se crea un token para permitirle acceder a recursos protegidos.
    if user and check_password_hash(user.password, password):  # check_password_hash compara una contraseña en texto claro (contraseña tal como la escribe el usuario) con un hash almacenado (versión encriptada) para verificar si son iguales

        # Si todo está bien, "tarjeta de acceso" (un token) que puede usar para entrar en la aplicación más tarde. 
        access_token = create_access_token(identity=user.id)
        
        # Devolver respuesta con éxito, token y datos del usuario
        return jsonify({
            'success': True,
            'user': user.serialize(),  # Damos información sobre el usuario, pero sin incluir la contraseña.
            'token': access_token # Token para autenticación en futuras solicitudes
        }), 200
    
    # Si las credenciales son incorrectas
    return jsonify({
        'success': False,
        'msg': 'Combinación usuario/contraseña no es válida'
    }), 401






# Devuelve todas las tareas asociadas al usuario que ha iniciado sesión.
@api.route('/tareas', methods=['GET'])
@jwt_required()
def obtener_Tareas():
    user_id_autenticado = get_jwt_identity()  # Obtén el ID del usuario autenticado
    tareas = Tarea.query.filter_by(user_id=user_id_autenticado).all()  # Consulta las tareas en la base de datos filtradas por el ID del usuario.
    return jsonify([tarea.serialize() for tarea in tareas]), 200  # Devuelve una lista de tareas en formato JSON.




# Endpoint para agregar una nueva tarea
@api.route('/tareas', methods=['POST'])
@jwt_required()  # Solo usuarios autenticados pueden acceder
def añadir_Tarea():
    user_id_autenticado = get_jwt_identity()  # ID del usuario autenticado
    body = request.get_json()  # Obtiene los datos de la petición
    nuevaTarea = Tarea(label=body['label'], done=False, user_id=user_id_autenticado)  # Crea una nueva tarea
    db.session.add(nuevaTarea)  # Añade la tarea a la base de datos
    db.session.commit()  # Guarda los cambios
    return jsonify(nuevaTarea.serialize()), 201  # Devuelve la nueva tarea en formato JSON




# Endpoint para eliminar una tarea
@api.route('/tareas/<int:tarea_id>', methods=['DELETE'])
@jwt_required()
def eliminar_tarea(tarea_id):
    user_id_autenticado = get_jwt_identity()  # ID del usuario autenticado
    tarea = Tarea.query.filter_by(id=tarea_id, user_id=user_id_autenticado).first()  # Busca la tarea del usuario autenticado
    if not tarea:
        return jsonify({"message": "Tarea no encontrada"}), 404  # Devuelve error si no se encuentra la tarea
    db.session.delete(tarea)  # Elimina la tarea
    db.session.commit()  # Guarda los cambios
    return jsonify({"message": "Tarea eliminada"}), 200




# Endpoint para borrar todas las tareas
@api.route('/tareas', methods=['DELETE'])
@jwt_required()  # Solo usuarios autenticados pueden acceder
def borrar_Todas_Las_Tareas():
    user_id_autenticado = get_jwt_identity()  # ID del usuario autenticado
    tareas = Tarea.query.filter_by(user_id=user_id_autenticado).all()  # Obtiene todas las tareas del usuario
    for tarea in tareas:
        db.session.delete(tarea)  # Elimina cada tarea de la lista
    db.session.commit()  # Guarda los cambios
    return jsonify({"message": "Todas las tareas han sido eliminadas"}), 200  # Devuelve un mensaje de éxito





