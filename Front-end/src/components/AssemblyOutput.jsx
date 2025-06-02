// components/AssemblyOutput.jsx
import React from 'react';
import ErrorDisplay from './ErrorDisplay';

// Common UI classes for the assembly output box 
const PANEL_CLASS = "bg-white rounded-xl shadow-lg overflow-hidden";
const PANEL_HEADER_CLASS = "border-b border-slate-200 p-4 bg-white";
const PANEL_TITLE_CLASS = "text-xl font-semibold text-slate-800";

// Function that gets 4 props from App.jsx 
function AssemblyOutput({ assembly, errors, warnings, isCompiling }) {
  const renderContent = () => {
    if (isCompiling) {
      return (
        <div className="flex items-center justify-center h-full space-x-2">
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Compiling...</span>
        </div>
      );
    }

    if (errors.length > 0 || warnings.length > 0) {
      return <ErrorDisplay errors={errors} warnings={warnings} />;
    }

    if (assembly) {
      return <pre className="p-4">{assembly}</pre>;
    }

    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        <p>Compile your code to see RISC-V assembly output</p>
      </div>
    );
  };

  // Maneja la descarga del archivo de ejemplo
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/ejemplo_riscv.s"; // Asegúrate de tener este archivo en /public
    link.download = "codigo_riscv.s";
    link.click();
  };

  return (
    <div className={PANEL_CLASS}>
      <div className={PANEL_HEADER_CLASS}>
        <h2 className={PANEL_TITLE_CLASS}>RISC-V Assembly</h2>
      </div>
      
      <div className="p-0">
        <div className="bg-slate-900 text-slate-100 font-mono text-sm overflow-auto" style={{ height: "500px" }}>
          {renderContent()}
        </div>

        {/* Botón de descarga debajo del panel */}
        <div className="p-4 border-t border-slate-200 bg-white text-center">
          <button
            onClick={handleDownload}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Descargar código RISC-V
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssemblyOutput;
