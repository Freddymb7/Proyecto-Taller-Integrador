// App.jsx - Main container component
import React, { useState } from 'react';
import HeaderControls from './components/HeaderControls'; 
import CodeEditor from './components/CodeEditor';
import AssemblyOutput from './components/AssemblyOutput';
import { createCppLinter } from './services/LinterService';

const DEFAULT_CPP_CODE = `#include <iostream>
int main() {
    std::cout << "Hello World!" << std::endl;
    return 0;
}`;

const DEFAULT_C_CODE = `#include <stdio.h>
int main() {
    printf("Hello World!\n");
    return 0;
}`;

const API_URL = 'http://localhost:3001/api/compiler/compile';

function App() {
  const [code, setCode] = useState(DEFAULT_C_CODE);
  const [language, setLanguage] = useState('c');
  const [assembly, setAssembly] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);
  const [errors, setErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);

  const handleLanguageChange = (e) => { 
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    setCode(newLanguage === 'c' ? DEFAULT_C_CODE : DEFAULT_CPP_CODE);
    setErrors([]);
    setWarnings([]);
    setAssembly('');
  };

  const handleCompilation = async () => {
    if (code.trim() === '') {
      setErrors([{ line: 0, column: 0, message: 'Please enter your code' }]);
      return;
    }
    setIsCompiling(true);
    setErrors([]);
    setWarnings([]);
    setAssembly('');
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });
      const result = await response.json();
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
      setIsCompiling(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 p-6">
      {/* Header independiente sin contenedor ancho */}
      <HeaderControls
        language={language}
        onLanguageChange={handleLanguageChange}
        onCompile={handleCompilation}
        isCompiling={isCompiling}
      />

      {/* Contenedor del contenido principal */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <CodeEditor
            code={code}
            setCode={setCode}
            language={language}
            linter={createCppLinter}
          />
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
