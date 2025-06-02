## Requisitos Previos
- Node.js (versión 14.0.0 o superior) https://nodejs.org/
- npm

## Intalación y configuración

### 1. gitclone del repositorio:
```bash
git clone https://github.com/Freddymb7/Proyecto-Taller-Integrador.git

```

### 2. Navegar al backend para activar el servidor del Proyecto:
```bash
cd [nombre-del-repo]
cd [Back-end]
```

### 3. Correr el servidor de flask:
Primero se recomienda activar un entorno virtual 

```bash
source venv/bin/activate
```

Ahora se instalan lo requerimientos: 
```bash
pip install -r requirements.txt
```

Por último se ejecuta al archivo donde se encuentra el servidor. 

```bash
python app.py
```
### 4. Dependencias del front-end:

Ejecutar desde la carpeta de front-end
```bash
npm install json-server express axios react-router-dom react react-dom
npm install
```

### 5. Servidor de desarrollo:
   
Ejecutar el siguiente comando en la misma carpeta del proyecto 
```bash
npm run dev
```
