import React from 'react'

function CompilerUI() {
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
              <h2 className="text-xl font-semibold text-slate-800">Source Code</h2>
            </div>

            <div className="p-4">

              {/* Code editor ( por mejorar) */}
              <div className="h-96 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="p-4 text-slate-500">Type your code here</p>
              </div>
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