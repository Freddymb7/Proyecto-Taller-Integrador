import { useState } from 'react'

function App() {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('cpp')
  const [input, setInput] = useState('')
  
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="border-b border-slate-200 p-4 bg-white">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-800">C/C++ Code Editor</h1>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-md shadow-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="c">C</option>
                <option value="cpp">C++</option>
              </select>
            </div>
          </div>
          
          {/* Editor */}
          <div className="p-4">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-96 p-4 font-mono text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"

            />
          </div>
          
          {/* Input & Run Section */}
          <div className="border-t border-slate-200 bg-slate-50 p-4">
            <div className="mb-4">


            </div>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Compile & Run
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App