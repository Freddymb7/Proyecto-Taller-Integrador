// components/HeaderControls.jsx
import React from 'react';


// Common UI classes for the header 
const PANEL_CLASS = "bg-white rounded-xl shadow-lg overflow-hidden";
// Fucntion that gets the current language and current state 
function HeaderControls({ language, onLanguageChange, onCompile, isCompiling }) {
  return (
    //Header 
    <div className={PANEL_CLASS + " mb-6"}>
      <div className="p-4 flex flex-row items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">
          C/C++ to RISC-V Compiler
        </h1>
        {/* Drop down menu  */}
        <div className="flex items-center gap-3">
          <select 
            value={language}
            onChange={onLanguageChange}
            className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg shadow-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="c">C</option>
            <option value="cpp">C++</option>
          </select>
          {/* button state */}
          <button 
            onClick={onCompile}
            disabled={isCompiling}
            className={`bg-blue-500 hover:bg-blue-600 text-white px-6 py-1.5 rounded-lg font-medium shadow-sm transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-blue-500 ${isCompiling ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isCompiling ? 'Compiling...' : 'Compile'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default HeaderControls;