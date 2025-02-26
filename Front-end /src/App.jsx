import React, { useState } from 'react'

function CompilerUI() {
  // Variables 
  const [code,setCode] = useState ('// Type your code here') //stores codes 
  const [language,setLanguage] = useState ('c') //language in use 
  const [assembly,setAssembly] = useState ('') // stores assembly code 
  const [isCompiling,setIsCompiling] = useState (false) // flag state 
  const [error,setError] = useState('') // stores errors 

  // Interactive consts
  const LanguageChange = (e) => { setLanguage(e.target.value) }
  const CodeChange = (e) => { setCode(e.target.value) }


  // Compilation process
  const Compilation = () => { setIsCompiling(true) 
  setError('') // cleans errors 

  // timout of 1 sec. if code source empty, then error there is no code, else show results 
  setTimeout(() => {
    if (code.trim() === '') {
      setError('Please enter some code to compile')
      setAssembly('')
    } else {   
      setAssembly(`// Simulated RISC-V assembly output for ${language} code\n// This is just a placeholder`)
    }
    setIsCompiling(false) // compilation compelte back to false 
  }, 1000)
}

return (
    // Background, heading and container width 
    <div className="min-h-screen bg-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">
          C/C++ to RISC-V 
        </h1>

        {/* grid layout small and large screen */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> 

          {/* Code panel */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="border-b border-slate-200 p-4 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-800">Source Code</h2>
                {/* drop down menu */}
                <select 
                  value={language}
                  onChange={LanguageChange}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-md shadow-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="c">C</option>
                  <option value="cpp">C++</option>
                </select>
              </div>
            </div>
        
            
            {/*Text area or code editor area*/}
            <div className="p-4">
              <textarea 
                value={code}
                onChange={CodeChange}
                className= "w-full h-96 p-4 font-mono text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" 
              />
            </div>
              {/* Compile button characteristics*/}
            <div className="border-t border-slate-200 bg-slate-50 p-4">
              <button 
                onClick={Compilation}
                disabled={isCompiling}
                className={`bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isCompiling ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isCompiling ? 'Compiling...' : 'Compile'}
              </button>
            </div>
          </div>

          
          {/* Output Panel */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="border-b border-slate-200 p-4 bg-white">
              <h2 className="text-xl font-semibold text-slate-800">Assembly Code</h2>
            </div>
            
            <div className="p-4">

              {/* output (por mejorar) */}
              <div className="h-96 bg-slate-800 text-slate-100 rounded-lg p-4 font-mono text-sm">
                <p>output</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompilerUI

