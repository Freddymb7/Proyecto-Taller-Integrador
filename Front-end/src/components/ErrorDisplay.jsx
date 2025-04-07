// components/ErrorDisplay.jsx
import React from 'react';

//function to get errors and warning whenever there are. Erros and warnings are arrays because they have a line, column and a message  
function ErrorDisplay({ errors, warnings }) {
    //renders the error or warning box to be display 
  return (
    // Error Format 
    <div className="p-4">
      {errors.length > 0 && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4">
          <h3 className="font-semibold mb-2">Compilation Errors:</h3>
          <ul className="list-disc pl-5 space-y-1">
            {errors.map((error, index) => (
              <li key={`error-${index}`} className="text-sm">
                {error.line > 0 ? `Line ${error.line}: ${error.message}` : error.message}
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Warning Format */}
      {warnings.length > 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded">
          <h3 className="font-semibold mb-2">Warnings:</h3>
          <ul className="list-disc pl-5 space-y-1">
            {warnings.map((warning, index) => (
              <li key={`warning-${index}`} className="text-sm">
                {warning.line > 0 ? `Line ${warning.line}: ${warning.message}` : warning.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ErrorDisplay;