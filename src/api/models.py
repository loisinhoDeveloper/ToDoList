from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }


  # Nuevo modelo para Tareas.
  #Cada tarea tiene un label (nombre de la tarea) y un done (booleano que indica si está completada).
  #user_id: Esta columna se usa para enlazar cada tarea con un usuario específico. 

class Tarea(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.String(120), nullable=False)  # Texto de la tarea
    done = db.Column(db.Boolean, default=False)  # Si la tarea está completada o no (booleano) Predeterminado falso, que quiere decir que no se ha complatado dicha tarea.
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Relacionar con el usuario

    def __repr__(self):
        return f'<Tarea {self.label}>'

    def serialize(self):
        return {
            "id": self.id,
            "label": self.label,
            "done": self.done,
            "user_id": self.user_id
        }  