// components/AssemblyOutput.jsx
import React from 'react';
import ErrorDisplay from './ErrorDisplay';


// Common UI classes for the assembly output box 
const PANEL_CLASS = "bg-white rounded-xl shadow-lg overflow-hidden";
const PANEL_HEADER_CLASS = "border-b border-slate-200 p-4 bg-white";
const PANEL_TITLE_CLASS = "text-xl font-semibold text-slate-800";

// Funcition that gets 4 props form App.jsx 
function AssemblyOutput({ assembly, errors, warnings, isCompiling }) {
  // render function to display what's goign on with the current state 
  const renderContent = () => {
    if (isCompiling) {
      // animated spinner for when it's compiling 
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
    // checks if there are errors to display if there are calls the ErrorDisplay function 
    if (errors.length > 0 || warnings.length > 0) {
      return <ErrorDisplay errors={errors} warnings={warnings} />;
    }
    // checks if there is assembly code to display inside a preformatted text 
    if (assembly) {
      return <pre className="p-4">{assembly}</pre>;
    }
    // if there is no aseembly code the show the message 
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        <p>Compile your code to see RISC-V assembly output</p>
      </div>
    );
  };
// renders the assembly code box and the code area is set to be dark and to display whetever needs to be display 
  return (
    <div className={PANEL_CLASS}>
      <div className={PANEL_HEADER_CLASS}>
        <h2 className={PANEL_TITLE_CLASS}>RISC-V Assembly</h2>
      </div>
      
      <div className="p-0">
        <div className="bg-slate-900 text-slate-100 font-mono text-sm overflow-auto" style={{ height: "500px" }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default AssemblyOutput;