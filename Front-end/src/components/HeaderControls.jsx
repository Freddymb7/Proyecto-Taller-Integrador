// Importa la librería React para poder usar JSX y componentes funcionales
import React from 'react';

// Constante que define clases de estilo comunes para el panel (usando TailwindCSS)
const PANEL_CLASS = "bg-white rounded-xl shadow-lg overflow-hidden";

// Componente funcional HeaderControls
function HeaderControls({ language, onLanguageChange, onCompile, isCompiling }) {
  // Función para cerrar sesión: elimina el token de login del almacenamiento local y recarga la página
  const handleLogout = () => {
    localStorage.removeItem('isLogged'); // Borra el estado de sesión guardado
    window.location.reload();            // Recarga la página para reiniciar el estado
  };

  return (
    // Contenedor principal con estilos definidos en PANEL_CLASS y margen inferior
    <div className={PANEL_CLASS + " mb-6"}>
      {/* Encabezado interno con padding y disposición en fila (horizontal) */}
      <div className="p-4 flex flex-row items-center justify-between">
        {/* Título del compilador */}
        <h1 className="text-2xl font-bold text-slate-800">
          C/C++ to RISC-V Compiler
        </h1>

        {/* Contenedor de los controles: selector de lenguaje, compilar, cerrar sesión */}
        <div className="flex items-center gap-3">
          {/* Menú desplegable para seleccionar entre C y C++ */}
          <select 
            value={language}                     // Valor actual del lenguaje seleccionado
            onChange={onLanguageChange}          // Función a ejecutar cuando cambia la selección
            className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg shadow-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="c">C</option>
            <option value="cpp">C++</option>
          </select>

          {/* Botón para compilar el código */}
          <button 
            onClick={onCompile}                  // Ejecuta la función onCompile al hacer clic
            disabled={isCompiling}               // Se desactiva si se está compilando
            className={`bg-blue-500 hover:bg-blue-600 text-white px-6 py-1.5 rounded-lg font-medium shadow-sm transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-blue-500 ${isCompiling ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {/* Texto del botón cambia dependiendo del estado de compilación */}
            {isCompiling ? 'Compiling...' : 'Compile'}
          </button>

          {/* Botón para cerrar sesión */}
          <button
            onClick={handleLogout}               // Ejecuta la función para cerrar sesión
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg font-medium shadow-sm transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-red-500"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}

// Exporta el componente para poder utilizarlo en otras partes de la aplicación
export default HeaderControls;
