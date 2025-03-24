// services/LinterService.js
import { linter } from '@codemirror/lint';
import { openLintPanel, closeLintPanel } from '@codemirror/lint';

// Function to extract content before comments so it doesn't takes the comments into account 
const removeComments = (line) => line.split('//')[0];

// CodeMirror Linter 
export function createCppLinter() {
  return linter(view => {
    const diagnostics = []; // empty array  
    const text = view.state.doc.toString(); // to convert the code to a string 
    const lines = text.split('\n'); // process the code line by line 
    
    //  preparation of  data 
    const codeWithoutComments = lines.map(removeComments).join('\n'); // Code without comments 
    const variableUsage = new Map(); // tracks variableUsage
    const variableDefinitions = new Map(); // tracks variableDefinition
    
    // check 1: missing includes and adds erros to diagnostics
    runDocumentLevelChecks(diagnostics, codeWithoutComments);
    
    // check 2: Variable and Function checker
    analyzeVariablesAndFunctions(
      lines, // split code
      view, // position tracking 
      variableDefinitions, // check if there are unused variables
      variableUsage, // defined variables 
      codeWithoutComments // code without comments 
    );
    
    // check 3: Line by line error checking to find missing semicolons 
    runLineLevelChecks(
      lines, 
      view, 
      codeWithoutComments, 
      text, 
      diagnostics
    );
    
    // check 4: Checks for logical issues 
    runSemanticAnalysis(
      variableDefinitions,
      variableUsage,
      diagnostics
    );
    
    return diagnostics;
  });
}


 // Check 1: Checks overall document structure and balance
 
function runDocumentLevelChecks(diagnostics, codeWithoutComments) {
  // Check for balanced braces
  const openBraces = (codeWithoutComments.match(/{/g) || []).length; // total counts of { using match function 
  const closeBraces = (codeWithoutComments.match(/}/g) || []).length; // total coutns of } 
  // compares the number of { with } to check if there are missing braces left 
  if (openBraces !== closeBraces) {
    diagnostics.push({ // adds to error to diagnostics to be display
      from: 0, // line 0 of code 
      to: codeWithoutComments.length, // checks all the way to the last line 
      severity: "error", // marks missinf brace as an error 
      message: openBraces > closeBraces // more open than close braces 
        ? `Missing ${openBraces - closeBraces} closing brace(s)`
        : `Extra ${closeBraces - openBraces} closing brace(s)`,
    });
  }
  
  // same error checker but for parentesis 
  const totalOpenParens = (codeWithoutComments.match(/\(/g) || []).length;
  const totalCloseParens = (codeWithoutComments.match(/\)/g) || []).length;
  
  if (totalOpenParens !== totalCloseParens) {
    diagnostics.push({
      from: 0,
      to: codeWithoutComments.length,
      severity: "error",
      message: totalOpenParens > totalCloseParens
        ? `Missing ${totalOpenParens - totalCloseParens} closing parenthesis/parentheses` // display message if need open or close braces
        : `Extra ${totalCloseParens - totalOpenParens} closing parenthesis/parentheses`, // display message if there are extra braces 
    });
  }
  
  // function to check for errors on different lines thru the code 
  checkMultiLineStatements(codeWithoutComments, diagnostics);
}

function checkMultiLineStatements(codeWithoutComments, diagnostics) {
  const statements = codeWithoutComments.split(';'); // splits the code every ; 
  
  statements.forEach(statement => { 
    const openParensInStmt = (statement.match(/\(/g) || []).length;
    const closeParensInStmt = (statement.match(/\)/g) || []).length;
    
    // If imbalanced and contains a function call pattern
    if (openParensInStmt > closeParensInStmt && 
        statement.match(/\b[a-zA-Z_][a-zA-Z0-9_]*\s*\(/)) {
        
      // Find this statement in the original code to report the error
      const funcCallMatch = statement.match(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/);
      if (funcCallMatch) {
        const funcName = funcCallMatch[1];
        
        diagnostics.push({
          from: codeWithoutComments.indexOf(statement),
          to: codeWithoutComments.indexOf(statement) + statement.length,
          severity: "error",
          message: `Unclosed function call to '${funcName}'`,
        });
      }
    }
  });
}

// function to check for unsued variables , declared before use  on different lines thru the code 
function analyzeVariablesAndFunctions(lines, view, variableDefinitions, variableUsage, codeWithoutComments) {
  // loop through each line of the code 
  lines.forEach((line, lineIndex) => {
    const lineWithoutComment = removeComments(line);
    const linePos = view.state.doc.line(lineIndex + 1);
    
    // Check for function definitions to check if they are properly closed 
    const functionMatch = lineWithoutComment.match(/\b(int|void|float|double|char)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/);
    let isFunctionDefinition = false;
    let functionName = null;
    
    if (functionMatch) {
      functionName = functionMatch[2];
      // Check if it's a function definition
      isFunctionDefinition = isFunctionDefinitionCheck(lines, lineIndex, lineWithoutComment);
      
      // Special case: main function is always considered used so in order to not mark it we do a special case
      if (functionName === 'main') {
        if (!variableUsage.has('main')) {
          variableUsage.set('main', []);
        }
        variableUsage.get('main').push({ 
          line: lineIndex, 
          isAssignment: false,
          isMainFunction: true
        });
      }
    }
    
    // If it's not a function definition, check for variable declarations
    if (!isFunctionDefinition) {
      analyzeVariableDeclaration(lineWithoutComment, lineIndex, linePos, variableDefinitions);
    }
    // If it is a function definition, record it differently
    else if (functionName && functionName !== 'main') {
      variableDefinitions.set(functionName, {
        line: lineIndex,
        pos: linePos.from + lineWithoutComment.indexOf(functionName),
        length: functionName.length,
        initialized: true,
        isFunction: true
      });
    }
    
    // Track variable and function usage
    trackUsage(lineWithoutComment, lineIndex, variableUsage, variableDefinitions, functionName);
  });
}


 //Function to determine if a line contains a function definition
 
function isFunctionDefinitionCheck(lines, lineIndex, lineWithoutComment) {
  // Check if this line or next non-empty line contains an opening brace if it does, then returns true 
  const currentLineHasBrace = lineWithoutComment.includes('{');
  
  if (currentLineHasBrace) return true;
  
  // run thru the rest of the lines ahead looking for an opening brace if not on this line return false 
  for (let i = lineIndex + 1; i < lines.length; i++) {
    const nextLine = removeComments(lines[i]).trim();
    if (nextLine === '') continue;
    if (nextLine.includes('{')) return true;
    break;
  }
  
  return false;
}

// function to analyze variable declarations like int float double char. if it's a hit there store the function name and the position 

function analyzeVariableDeclaration(lineWithoutComment, lineIndex, linePos, variableDefinitions) {
  const varDeclMatch = lineWithoutComment.match(/\b(int|float|double|char)\s+([a-zA-Z_][a-zA-Z0-9_]*)\b(?!\s*\()/);
  if (varDeclMatch) {
    const varName = varDeclMatch[2];
    const isInitialized = lineWithoutComment.includes('=');
    variableDefinitions.set(varName, {
      line: lineIndex,
      pos: linePos.from + lineWithoutComment.indexOf(varName),
      length: varName.length,
      initialized: isInitialized,
      isFunction: false
    });
  }
}


 // Function to track if a variable and function is being properly used 
function trackUsage(lineWithoutComment, lineIndex, variableUsage, variableDefinitions, functionName) {
  const words = lineWithoutComment.match(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g) || [];
  words.forEach(word => {
    // Skip keywords
    if (['if', 'for', 'while', 'return', 'int', 'char', 'float', 'double', 'void', 'include'].includes(word)) {
      return;
    }
    
    // Skip if this word is the function or variable being defined on this line
    if ((functionName && word === functionName) || 
        (variableDefinitions.has(word) && variableDefinitions.get(word).line === lineIndex)) {
      return;
    }
    
    // Check if it's being assigned to
    const isAssignment = new RegExp(`\\b${word}\\s*=`).test(lineWithoutComment);
    
    // Check if it's being called as a function
    const isFunctionCall = new RegExp(`\\b${word}\\s*\\(`).test(lineWithoutComment);
    
    if (!variableUsage.has(word)) {
      variableUsage.set(word, []);
    }
    variableUsage.get(word).push({ 
      line: lineIndex, 
      isAssignment,
      isFunctionCall
    });
  });
}

// function to check per line like remove commets , syntax errors, line position , unbalanced parentheses 
function runLineLevelChecks(lines, view, codeWithoutComments, fullText, diagnostics) {
  lines.forEach((line, lineIndex) => {
    const lineWithoutComment = removeComments(line);
    const linePos = view.state.doc.line(lineIndex + 1);
    
    // Check for missing semicolons
    checkMissingSemicolons(lineWithoutComment, linePos, diagnostics);
    
    // Check for unbalanced parentheses in the current line 
    checkLineParenthesesBalance(lineWithoutComment, linePos, diagnostics);
    
    // Check for missing includes
    checkMissingIncludes(lineWithoutComment, linePos, fullText, diagnostics);
    
    // Check for invalid #include syntax
    checkIncludeSyntax(lineWithoutComment, linePos, diagnostics);
    
    // Style checks
    checkStyleIssues(lineWithoutComment, linePos, diagnostics);
  });
  
  // Check if main function has a return statement
  checkMainFunctionReturn(codeWithoutComments, view, diagnostics);
}


 // function to check for missing semicolons taking the line without the comment.
 // checks every option to know if it's missing a semicolon, so the if statement checks if the line is empty 
 // and if the line doesn't already end with a semicolon
function checkMissingSemicolons(lineWithoutComment, linePos, diagnostics) {
  if (lineWithoutComment.trim() && 
      !lineWithoutComment.trim().endsWith(';') && 
      !lineWithoutComment.trim().endsWith('{') &&
      !lineWithoutComment.trim().endsWith('}') &&
      !lineWithoutComment.trim().startsWith('#') &&
      !lineWithoutComment.trim().endsWith('\\')) {
    diagnostics.push({
      from: linePos.from + lineWithoutComment.length - 1,
      to: linePos.from + lineWithoutComment.length,
      severity: "error",
      message: "Missing semicolon",
    });
  }
}


 // Function to check for parentheses balance within a line

function checkLineParenthesesBalance(lineWithoutComment, linePos, diagnostics) {
  const openParenCount = (lineWithoutComment.match(/\(/g) || []).length;
  const closeParenCount = (lineWithoutComment.match(/\)/g) || []).length;
  
  // Check for both extra closing parentheses and missing closing parentheses
  if (closeParenCount > openParenCount) {
    diagnostics.push({
      from: linePos.from,
      to: linePos.from + lineWithoutComment.length,
      severity: "error",
      message: "Unmatched closing parenthesis",
    });
  } else if (openParenCount > closeParenCount) {
    // Check if this is a function call that should have balanced parentheses
    if (lineWithoutComment.includes('(') && 
        lineWithoutComment.trim().endsWith(';') &&
        lineWithoutComment.match(/\b[a-zA-Z_][a-zA-Z0-9_]*\s*\(/)) {
      
      diagnostics.push({
        from: linePos.from,
        to: linePos.from + lineWithoutComment.length,
        severity: "error",
        message: "Missing closing parenthesis in function call",
      });
    }
    // Look for patterns that suggest incomplete conditions or expressions
    else if (lineWithoutComment.match(/\b(if|while|for|switch)\s*\(/) || 
             lineWithoutComment.match(/=\s*\(/)) {
      diagnostics.push({
        from: linePos.from,
        to: linePos.from + lineWithoutComment.length,
        severity: "error",
        message: "Unclosed parenthesis in expression",
      });
    }
  }
}


//Function to check for missing includes 
 
function checkMissingIncludes(lineWithoutComment, linePos, fullText, diagnostics) {
  if (lineWithoutComment.includes('printf') && !fullText.includes('#include <stdio.h>')) {
    diagnostics.push({
      from: linePos.from,
      to: linePos.from + lineWithoutComment.length,
      severity: "error", 
      message: "Using printf without including stdio.h",
    });
  }
  
  if (lineWithoutComment.includes('cout') && !fullText.includes('#include <iostream>')) {
    diagnostics.push({
      from: linePos.from,
      to: linePos.from + lineWithoutComment.length,
      severity: "error",
      message: "Using cout without including iostream",
    });
  }
}

// function to check if there in an include on the code 
function checkIncludeSyntax(lineWithoutComment, linePos, diagnostics) {
  if (lineWithoutComment.includes('#include') && 
      (!lineWithoutComment.includes('<') || !lineWithoutComment.includes('>'))) {
    diagnostics.push({
      from: linePos.from,
      to: linePos.from + lineWithoutComment.length,
      severity: "error",
      message: "Invalid #include syntax",
    });
  }
}


// Function to check for style issues
 
function checkStyleIssues(lineWithoutComment, linePos, diagnostics) {
  // Check for magic numbers ( number equal to the original number ), display warning and suggestion 
  const magicNumberMatch = lineWithoutComment.match(/\s(\d+)\s/);
  if (magicNumberMatch && 
      !lineWithoutComment.includes('#include') && 
      !lineWithoutComment.includes('return') &&
      !lineWithoutComment.match(/for\s*\(/)) {
    const pos = linePos.from + lineWithoutComment.indexOf(magicNumberMatch[1]);
    diagnostics.push({
      from: pos,
      to: pos + magicNumberMatch[1].length,
      severity: "warning",
      message: "Consider using named constants instead of magic numbers",
    });
  }
  
  // Check for long lines basic lenght comparison if with 80 
  if (lineWithoutComment.length > 80) {
    diagnostics.push({
      from: linePos.from,
      to: linePos.from + lineWithoutComment.length,
      severity: "warning",
      message: "Line exceeds 80 characters, consider breaking it up",
    });
  }
  
  // Inefficient loop warning, checks if it is using a lenght value inside the loop condition.
  if (lineWithoutComment.includes('for') && lineWithoutComment.includes('length')) {
    diagnostics.push({
      from: linePos.from,
      to: linePos.from + lineWithoutComment.length,
      severity: "warning",
      message: "Consider caching the length value outside the loop for better performance",
    });
  }
}


 // Function to check if main function has a return statement
 
function checkMainFunctionReturn(codeWithoutComments, view, diagnostics) {
  const mainFunctionRegex = /\bmain\s*\([^)]*\)\s*{/g;
  let match;
  while ((match = mainFunctionRegex.exec(codeWithoutComments)) !== null) {
    // Check if there's a return statement after this point
    if (!codeWithoutComments.substring(match.index).includes('return ')) {
      const mainLineIndex = codeWithoutComments.substring(0, match.index).split('\n').length - 1;
      const linePos = view.state.doc.line(mainLineIndex + 1);
      diagnostics.push({
        from: linePos.from,
        to: linePos.from + view.state.doc.line(mainLineIndex + 1).length,
        severity: "warning",
        message: "Function 'main' should return a value",
      });
    }
  }
}


 // function that checks for usage patterns, uninitialized variables, etc.

function runSemanticAnalysis(variableDefinitions, variableUsage, diagnostics) {
  for (const [name, definition] of variableDefinitions.entries()) {
    const usages = variableUsage.get(name) || [];
    
    // Special handling for main function
    if (name === 'main' && definition.isFunction) {
      // Don't add warnings or errors  for main function
      continue;
    }
    
    // Check for unused variables or functions
    if (usages.length === 0) {
      // Different messages for functions vs variables
      const message = definition.isFunction 
        ? `Function '${name}' appears to be unused` 
        : `Variable '${name}' appears to be unused`;
        
      diagnostics.push({
        from: definition.pos,
        to: definition.pos + definition.length,
        severity: "warning",
        message: message,
      });
    } 
    // For variables only check for uninitialized use
    else if (!definition.isFunction && !definition.initialized && !usages.some(u => u.isAssignment)) {
      diagnostics.push({
        from: definition.pos,
        to: definition.pos + definition.length,
        severity: "warning",
        message: `Variable '${name}' may be used uninitialized`,
      });
    }
    
    // For functions check if defined but never called
    if (definition.isFunction && !usages.some(u => u.isFunctionCall)) {
      // main function doesn't need to be called
      if (name !== 'main') {
        diagnostics.push({
          from: definition.pos,
          to: definition.pos + definition.length,
          severity: "info", 
          message: `Function '${name}' is defined but never called`,
        });
      }
    }
  }
}


export { openLintPanel, closeLintPanel };