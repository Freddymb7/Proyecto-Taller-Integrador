from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
import subprocess
import os
import uuid
import json
from threading import Timer
from werkzeug.security import check_password_hash 

app = Flask(__name__, static_folder="../frontend/dist", static_url_path="")
CORS(app)

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "outputs"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

LIBRERIAS_NO_SOPORTADAS = [
    "#include <stdio.h>",
    "#include <math.h>",
    "#include <stdlib.h>",
    "#include <time.h>",
    "#include <threads.h>",
    "#include <complex.h>",
    "#include <stdatomic.h>"
]

@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    base_dir = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(base_dir, 'db.json')

    try:
        with open(db_path, 'r') as f:
            users = json.load(f)['users']
    except Exception:
        return jsonify({"success": False, "error": "No se pudo leer db.json"}), 500

    for user in users:
        # Verificación usando hash seguro
        if user['email'] == email and check_password_hash(user['password'], password):
            return jsonify({"success": True, "user": {"email": user["email"]}})

    return jsonify({"success": False, "error": "Credenciales incorrectas"}), 401

@app.route("/compilar", methods=["POST"])
def compilar():
    try:
        codigo = request.json.get("codigo", "")
        if not codigo:
            return jsonify({"error": "No se recibió código"}), 400

        for libreria in LIBRERIAS_NO_SOPORTADAS:
            if libreria in codigo:
                return jsonify({
                    "error": f"La librería {libreria} no es compatible con la arquitectura RISC-V."
                }), 400

        file_id = str(uuid.uuid4())
        c_filename = os.path.join(UPLOAD_FOLDER, f"{file_id}.c")
        elf_filename = os.path.join(OUTPUT_FOLDER, f"{file_id}.elf")
        asm_filename = os.path.join(OUTPUT_FOLDER, f"{file_id}.s")
        bin_filename = os.path.join(OUTPUT_FOLDER, f"{file_id}.bin")

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

        subprocess.run(
            ["riscv32-unknown-elf-objcopy", "-O", "binary", elf_filename, bin_filename],
            check=True
        )

        with open(asm_filename, "r") as asm_file:
            lines = asm_file.readlines()

        inside_main = False
        filtered_lines = []
        for line in lines:
            stripped = line.strip()
            if stripped.startswith("main:"):
                inside_main = True
            if inside_main:
                if stripped.startswith(".size"):
                    break
                filtered_lines.append(line)

        assembler_code = "".join(filtered_lines)

        with open(asm_filename, "w") as asm_file:
            asm_file.write(assembler_code)

        run_result = subprocess.run(
            ["qemu-riscv32", "-d", "in_asm", elf_filename],
            capture_output=True, text=True
        )

        registros_hex = ""
        for line in run_result.stderr.split("\n"):
            if "x" in line:
                registros_hex += line + "\n"

        return jsonify({
            "mensaje": "Compilación y ejecución exitosa",
            "salida": run_result.stdout,
            "ensamblador": assembler_code,
            "registros_hex": registros_hex,
            "archivo_asm": f"{file_id}.s",
            "archivo_bin": f"{file_id}.bin"
        })

    except subprocess.CalledProcessError as e:
        return jsonify({"error": "Error en compilación o ejecución", "detalles": e.stderr}), 400

@app.route("/descargar/<nombre_archivo>")
def descargar_asm(nombre_archivo):
    ruta = os.path.join(OUTPUT_FOLDER, nombre_archivo)
    if not os.path.exists(ruta):
        return jsonify({"error": "Archivo no encontrado"}), 404

    Timer(300, lambda: os.remove(ruta) if os.path.exists(ruta) else None).start()
    return send_file(ruta, as_attachment=True, download_name="codigo_generado.asm")

@app.route("/descargar-bin/<nombre_archivo>")
def descargar_bin(nombre_archivo):
    ruta = os.path.join(OUTPUT_FOLDER, nombre_archivo)
    if not os.path.exists(ruta):
        return jsonify({"error": "Archivo .bin no encontrado"}), 404

    Timer(180, lambda: os.remove(ruta) if os.path.exists(ruta) else None).start()
    return send_file(ruta, as_attachment=True, download_name="codigo_generado.bin")

@app.route("/descargar-recursos")
def descargar_recursos():
    ruta = os.path.join("static", "recursos", "Ripes-v2.2.6-win-x86_64.zip")
    if not os.path.exists(ruta):
        return jsonify({"error": "Archivo no encontrado"}), 404
    return send_file(ruta, as_attachment=True, download_name="Ripes-v2.2.6-win-x86_64.zip")

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
