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
      setError('Please enter your code')
      setAssembly('')
    } else {   
      setAssembly(`// Simulated RISC-V assembly output for ${language} code\n`)
    }
    setIsCompiling(false) // compilation complete back to false 
  }, 1000) //sujeto  cambiar 
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

            {/* Error message  */}
            <div className="p-4">
              {error ? (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4">
                  <p>{error}</p>
                </div>
              ): null}
              {/* Output panel  */}
              <div className="bg-slate-800 text-slate-100 rounded-lg p-4 font-mono text-sm overflow-auto h-96" >
                {/* animated loading spiner while it compiles  */}
                {isCompiling ? (
                  <div className="flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span> Compiling... </span>
                  </div>
                ) : assembly ? (
                  <pre>{assembly}</pre>
                ) : ( 
                  <p> Compile your code to see RISC-V assembly output </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompilerUI