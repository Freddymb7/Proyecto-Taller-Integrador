from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import subprocess
import os
import uuid
import json

app = Flask(__name__, static_folder="../frontend/dist", static_url_path="")
CORS(app)  # Permitir acceso desde React

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "outputs"

# Crear carpetas si no existen
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

@app.route("/")
def index():
    """Sirve la aplicación de React"""
    return send_from_directory(app.static_folder, "index.html")

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Ruta segura al archivo
    base_dir = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(base_dir, 'db.json')

    try:
        with open(db_path, 'r') as f:
            users = json.load(f)['users']
    except Exception as e:
        return jsonify({"success": False, "error": "No se pudo leer db.json"}), 500

    for user in users:
        if user['email'] == email and user['password'] == password:
            return jsonify({"success": True, "user": user})

    return jsonify({"success": False, "error": "Credenciales incorrectas"}), 401

@app.route("/compilar", methods=["POST"])
def compilar():
    """Recibe código C, lo compila y lo ejecuta en RISC-V"""
    try:
        codigo = request.json.get("codigo", "")
        if not codigo:
            return jsonify({"error": "No se recibió código"}), 400

        file_id = str(uuid.uuid4())
        c_filename = os.path.join(UPLOAD_FOLDER, f"{file_id}.c")
        elf_filename = os.path.join(OUTPUT_FOLDER, f"{file_id}.elf")
        asm_filename = os.path.join(OUTPUT_FOLDER, f"{file_id}.s")

        # Guardar el código en un archivo
        with open(c_filename, "w") as f:
            f.write(codigo)

        # Compilar a ensamblador
        subprocess.run(
            ["riscv32-unknown-elf-gcc", "-march=rv32i", "-mabi=ilp32", "-S", c_filename, "-o", asm_filename], 
            check=True
        )

        # Compilar a ejecutable
        subprocess.run(
            ["riscv32-unknown-elf-gcc", "-march=rv32i", "-mabi=ilp32", "-o", elf_filename, c_filename], 
            check=True
        )

        # Ejecutar en QEMU y capturar registros
        run_result = subprocess.run(
            ["qemu-riscv32", "-d", "in_asm", elf_filename], 
            capture_output=True, text=True
        )

        # Leer el ensamblador generado
        with open(asm_filename, "r") as asm_file:
            assembler_code = asm_file.read()

        # Extraer registros en hexadecimal de stderr (si se usa `-d in_asm`)
        registros_hex = ""
        for line in run_result.stderr.split("\n"):
            if "x" in line:  # Si la línea contiene valores de registros
                registros_hex += line + "\n"

        return jsonify({
            "mensaje": "Compilación y ejecución exitosa",
            "salida": run_result.stdout,
            "ensamblador": assembler_code,
            "registros_hex": registros_hex  # Agregado para optimizar memoria en FPGA
        })

    except subprocess.CalledProcessError as e:
        return jsonify({"error": "Error en compilación o ejecución", "detalles": e.stderr}), 400

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
