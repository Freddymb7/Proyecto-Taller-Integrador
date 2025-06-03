import React, { useState } from 'react';
import ErrorDisplay from './ErrorDisplay';

const PANEL_CLASS = "bg-white rounded-xl shadow-lg overflow-hidden";
const PANEL_HEADER_CLASS = "border-b border-slate-200 p-4 bg-white";
const PANEL_TITLE_CLASS = "text-xl font-semibold text-slate-800";
const TAB_CLASS = "cursor-pointer px-4 py-2";
const ACTIVE_TAB_CLASS = "bg-slate-800 text-white";
const INACTIVE_TAB_CLASS = "bg-slate-100 text-slate-800 hover:bg-slate-200";

function AssemblyOutput({ registers, errors, warnings, isCompiling, asmFile, binFile }) {
  const [activeTab, setActiveTab] = useState('registros');

  const renderTabContent = () => {
    if (isCompiling) {
      return (
        <div className="flex items-center justify-center h-full space-x-2 p-6">
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Compilando...</span>
        </div>
      );
    }

    if (errors.length > 0 || warnings.length > 0) {
      return <ErrorDisplay errors={errors} warnings={warnings} />;
    }

    if (activeTab === 'registros') {
      return (
        <div className="p-4 whitespace-pre-wrap">{registers || "Ejecutá una compilación para ver los registros RISC-V."}</div>
      );
    }

    if (activeTab === 'simulacion') {
      return (
        <div className="p-4 flex flex-col space-y-4">
          {asmFile && (
            <a
              href={`/descargar/${asmFile}`}
              download
              className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Descargar ensamblador (.asm)
            </a>
          )}

          <a
            href="/descargar-recursos"
            download
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Descargar recursos de simulación (.zip)
          </a>

          {binFile && (
            <a
              href={`/descargar-bin/${binFile}`}
              download
              className="inline-block px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Descargar ejecutable (.bin)
            </a>
          )}
        </div>
      );
    }

    if (activeTab === 'guia') {
      return (
        <div className="p-4">
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              className="w-full h-96 rounded-lg shadow"
              src="https://www.youtube.com/embed/DWKfXoQRzAI"
              title="Guía de usuario"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={PANEL_CLASS}>
      <div className={PANEL_HEADER_CLASS}>
        <h2 className={PANEL_TITLE_CLASS}>Panel de Resultados</h2>
        <div className="flex space-x-2 mt-2">
          <button
            className={`${TAB_CLASS} ${activeTab === 'registros' ? ACTIVE_TAB_CLASS : INACTIVE_TAB_CLASS}`}
            onClick={() => setActiveTab('registros')}
          >
            Registros
          </button>
          <button
            className={`${TAB_CLASS} ${activeTab === 'simulacion' ? ACTIVE_TAB_CLASS : INACTIVE_TAB_CLASS}`}
            onClick={() => setActiveTab('simulacion')}
          >
            Simulación
          </button>
          <button
            className={`${TAB_CLASS} ${activeTab === 'guia' ? ACTIVE_TAB_CLASS : INACTIVE_TAB_CLASS}`}
            onClick={() => setActiveTab('guia')}
          >
            Guía
          </button>
        </div>
      </div>

      <div className="bg-slate-900 text-slate-100 font-mono text-sm overflow-auto" style={{ height: "500px" }}>
        {renderTabContent()}
      </div>
    </div>
  );
}

export default AssemblyOutput;
