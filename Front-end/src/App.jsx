// App.jsx - Main container component
import React, { useState } from 'react'; // useState hook for component states 
import HeaderControls from './components/HeaderControls'; 
import CodeEditor from './components/CodeEditor';
import AssemblyOutput from './components/AssemblyOutput';
import { createCppLinter } from './services/LinterService'; // Real time code validation 

// Constants and Default Values 
// Default code starters
const DEFAULT_CPP_CODE = `#include <iostream>
int main() {
    std::cout << "Hello World!" << std::endl;
    return 0;
}`;

const DEFAULT_C_CODE = `#include <stdio.h>
int main() {
    printf("Hello World!\\n");
    return 0;
}`;
// API endpoint cambia según la computadora, ahorita tengo este por motivos de prueba mios
const API_URL = 'http://localhost:3001/api/compiler/compile';


function App() {
  // State variables and managment 
  const [code, setCode] = useState(DEFAULT_C_CODE); // Stores current content of the code editor on code 
  const [language, setLanguage] = useState('c'); // Tracks the language that is on 
  const [assembly, setAssembly] = useState(''); // Holds the assembly code
  const [isCompiling, setIsCompiling] = useState(false); // flag, it is compiling yes or no ?
  const [errors, setErrors] = useState([]); // stores errors to be display 
  const [warnings, setWarnings] = useState([]); // store warnings to be display 
  
  // Event Handlers 
  // Language change handler
  const handleLanguageChange = (e) => { 
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    setCode(newLanguage === 'c' ? DEFAULT_C_CODE : DEFAULT_CPP_CODE); // if newLanguage is c then is c default code otherwise it sets C++ default code 
    
    // Clear compilation results, errors, warnings etc 
    setErrors([]);
    setWarnings([]);
    setAssembly('');
  };
  
  // Compilation process handler
  const handleCompilation = async () => {
    // checks for code if empty error please enter your code 
    if (code.trim() === '') {
      setErrors([{ line: 0, column: 0, message: 'Please enter your code' }]);
      return;
    }
    
    setIsCompiling(true); // set compiling process to yes then clears past errors if there are 
    setErrors([]);
    setWarnings([]);
    setAssembly('');

    // backend caller async fucntion 
    try {
      // Calls the backend API
      const response = await fetch(API_URL, {
        method: 'POST', // sends the code to the backend 
        headers: { 'Content-Type': 'application/json' }, // tells the server is a JSON 
        body: JSON.stringify({ code, language }), // converts the code to JSON 
      });
      
      // waits for the response of the server and converts the JSON to a javascript object 
      const result = await response.json();
      // if we get a result then display the assembly code else display an error 
      if (!result.success) {
        setErrors(result.errors || []);
        setWarnings(result.warnings || []);
      } else {
        setAssembly(result.assemblyCode);
        setWarnings(result.warnings || []);
      }
    } catch (err) {
      setErrors([{ 
        line: 0, 
        column: 0, 
        message: `Error connecting to compiler service: ${err.message}` 
      }]);
    } finally {
      setIsCompiling(false); // isCompiling back to false 
    }
  };
  // Renderer 
  return (
    <div className="min-h-screen bg-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Controls */}
        <HeaderControls 
          language={language}
          onLanguageChange={handleLanguageChange}
          onCompile={handleCompilation}
          isCompiling={isCompiling}
        />
        
        {/* Split View Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Source Code Panel */}
          <CodeEditor 
            code={code} 
            setCode={setCode} 
            language={language} 
            linter={createCppLinter}
          />
          
          {/* Assembly Code Panel */}
          <AssemblyOutput 
            assembly={assembly}
            errors={errors}
            warnings={warnings}
            isCompiling={isCompiling}
          />
        </div>
      </div>
    </div>
  );
}

export default App;