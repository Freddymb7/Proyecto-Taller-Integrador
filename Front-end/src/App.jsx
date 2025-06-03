import React, { useState } from 'react';
import axios from 'axios';
import HeaderControls from './components/HeaderControls';
import CodeEditor from './components/CodeEditor';
import AssemblyOutput from './components/AssemblyOutput';
import { createCppLinter } from './services/LinterService';

const DEFAULT_CPP_CODE = `#include <iostream>
int main() {
    std::cout << "Hello World!" << std::endl;
    return 0;
}`;

const DEFAULT_C_CODE = `int main() {
    int numero1 = 5;
    int numero2 = 7;
    int suma;

    suma = numero1 + numero2;

    return 0;
}`;

const API_URL = '/compilar';

function App() {
  const [code, setCode] = useState(DEFAULT_C_CODE);
  const [language, setLanguage] = useState('c');
  const [registers, setRegisters] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);
  const [errors, setErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [asmFile, setAsmFile] = useState(null);
  const [binFile, setBinFile] = useState(null); // Soporte .bin

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    setCode(newLanguage === 'c' ? DEFAULT_C_CODE : DEFAULT_CPP_CODE);
    setErrors([]);
    setWarnings([]);
    setRegisters('');
    setAsmFile(null);
    setBinFile(null);
  };

  const handleCompilation = async () => {
    if (code.trim() === '') {
      setErrors([{ line: 0, column: 0, message: 'Por favor, ingrese su código.' }]);
      return;
    }

    setIsCompiling(true);
    setErrors([]);
    setWarnings([]);
    setRegisters('');
    setAsmFile(null);
    setBinFile(null);

    try {
      const response = await axios.post(API_URL, { codigo: code });
      const result = response.data;

      if (result.error) {
        setErrors([{ line: 0, column: 0, message: result.error }]);
        return;
      }

      setRegisters(result.registros_hex || '');
      setAsmFile(result.archivo_asm || null);
      setBinFile(result.archivo_bin || null); // Guardar .bin
      setWarnings([]);

    } catch (err) {
      setErrors([{
        line: 0,
        column: 0,
        message: err.response?.data?.error || `Error al conectar con el compilador: ${err.message}`
      }]);
      setRegisters('');
      setAsmFile(null);
      setBinFile(null);
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        <HeaderControls
          language={language}
          onLanguageChange={handleLanguageChange}
          onCompile={handleCompilation}
          isCompiling={isCompiling}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CodeEditor
            code={code}
            setCode={setCode}
            language={language}
            linter={createCppLinter}
          />

          <AssemblyOutput
            registers={registers}
            errors={errors}
            warnings={warnings}
            isCompiling={isCompiling}
            asmFile={asmFile}
            binFile={binFile} // Pasar a Simulación
          />
        </div>
      </div>
    </div>
  );
}

export default App;
