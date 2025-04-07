// components/CodeEditor.jsx
import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { cpp } from '@codemirror/lang-cpp';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { lintGutter } from '@codemirror/lint';
import { EditorView } from '@codemirror/view';


// Common UI classes for the code editor box 
const PANEL_CLASS = "bg-white rounded-xl shadow-lg overflow-hidden";
const PANEL_HEADER_CLASS = "border-b border-slate-200 p-4 bg-white";
const PANEL_TITLE_CLASS = "text-xl font-semibold text-slate-800";
// function to get the props from the app.jsx 
function CodeEditor({ code, setCode, language, linter }) {
  const [editorView, setEditorView] = useState(null);
  
  // Editor extensions (settings)
  const editorExtensions = [
    cpp(),
    vscodeDark,
    lintGutter(),
    linter(),
    EditorView.updateListener.of(view => {
      if (!editorView) {
        setEditorView(view.view);
      }
    })
  ];
// renders the code editor box with the specific custom settings that the client wants 
  return (
    <div className={PANEL_CLASS}>
      <div className={PANEL_HEADER_CLASS}>
        <h2 className={PANEL_TITLE_CLASS}>Source Code</h2>
      </div>
      
      <div className="p-0">
        <CodeMirror
          value={code}
          height="500px"
          theme={vscodeDark}
          extensions={editorExtensions}
          onChange={setCode}
          className="border-0"
        />
      </div>
    </div>
  );
}

export default CodeEditor;