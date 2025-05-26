from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import subprocess
import os
import uuid
import json

app = Flask(__name__, static_folder="../frontend/dist", static_url_path="")
CORS(app)

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "outputs"
DB_FILE = "db.json"

# Crear carpetas si no existen
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    base_dir = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(base_dir, DB_FILE)

    try:
        with open(db_path, 'r') as f:
            users = json.load(f).get('users', [])
    except Exception:
        return jsonify({"success": False, "error": "No se pudo leer db.json"}), 500

    for user in users:
        if user['email'] == email and check_password_hash(user['password'], password):
            return jsonify({"success": True, "user": {"email": user["email"]}})

    return jsonify({"success": False, "error": "Credenciales incorrectas"}), 401

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    base_dir = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(base_dir, DB_FILE)

    try:
        with open(db_path, 'r') as f:
            db = json.load(f)
    except FileNotFoundError:
        db = {"users": []}

    # Verificar si ya existe
    if any(u['email'] == email for u in db['users']):
        return jsonify({"success": False, "error": "Usuario ya existe"}), 409

    hashed_password = generate_password_hash(password)
    db['users'].append({"email": email, "password": hashed_password})

    with open(db_path, 'w') as f:
        json.dump(db, f, indent=4)

    return jsonify({"success": True, "message": "Usuario registrado correctamente"})

@app.route("/compilar", methods=["POST"])
def compilar():
    try:
        codigo = request.json.get("codigo", "")
        if not codigo:
            return jsonify({"error": "No se recibió código"}), 400

        file_id = str(uuid.uuid4())
        c_filename = os.path.join(UPLOAD_FOLDER, f"{file_id}.c")
        elf_filename = os.path.join(OUTPUT_FOLDER, f"{file_id}.elf")
        asm_filename = os.path.join(OUTPUT_FOLDER, f"{file_id}.s")

        with open(c_filename, "w") as f:
            f.write(codigo)

        subprocess.run(
            ["riscv32-unknown-elf-gcc", "-march=rv32i", "-mabi=ilp32", "-S", c_filename, "-o", asm_filename], 
            check=True
        )

        subprocess.run(
            ["riscv32-unknown-elf-gcc", "-march=rv32i", "-mabi=ilp32", "-o", elf_filename, c_filename], 
            check=True
        )

        run_result = subprocess.run(
            ["qemu-riscv32", "-d", "in_asm", elf_filename], 
            capture_output=True, text=True
        )

        with open(asm_filename, "r") as asm_file:
            assembler_code = asm_file.read()

        registros_hex = ""
        for line in run_result.stderr.split("\n"):
            if "x" in line:
                registros_hex += line + "\n"

        return jsonify({
            "mensaje": "Compilación y ejecución exitosa",
            "salida": run_result.stdout,
            "ensamblador": assembler_code,
            "registros_hex": registros_hex
        })

    except subprocess.CalledProcessError as e:
        return jsonify({"error": "Error en compilación o ejecución", "detalles": e.stderr}), 400

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
