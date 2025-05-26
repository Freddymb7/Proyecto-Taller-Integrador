import json
from werkzeug.security import generate_password_hash

# Datos del nuevo usuario
email = "hola@gmail.com"
password = "hola123"

# Genera el hash
hashed_password = generate_password_hash(password)

# Carga la base de datos
with open("db.json", "r") as f:
    db = json.load(f)

# Verifica si ya existe
if any(u['email'] == email for u in db['users']):
    print("❌ El usuario ya existe.")
else:
    db['users'].append({
        "email": email,
        "password": hashed_password
    })

    # Guarda la base de datos actualizada
    with open("db.json", "w") as f:
        json.dump(db, f, indent=4)

    print("✅ Usuario creado correctamente.")
