export const parseError = (rawError, engine) => {
  if (!rawError) return "An unknown error occurred.";

  const errorString = String(rawError);

  if (engine === 'c') {
    // 1. Missing Semicolon
    // e.g. prog.c:5:5: error: expected ';' before 'return'
    const missingSemicolonMatch = errorString.match(/prog\.c:(\d+):\d+: error: expected ';' before/);
    if (missingSemicolonMatch) {
      return `Oops! You forgot a semicolon (;) near line ${missingSemicolonMatch[1]}.`;
    }

    // 2. Undeclared Variable
    // e.g. prog.c:6:5: error: 'x' undeclared
    const undeclaredMatch = errorString.match(/prog\.c:(\d+):\d+: error: '([^']+)' undeclared/);
    if (undeclaredMatch) {
      return `It looks like '${undeclaredMatch[2]}' on line ${undeclaredMatch[1]} doesn't exist. Did you forget to declare it (e.g. \`int ${undeclaredMatch[2]};\`) or misspell its name?`;
    }

    // 3. Implicit declaration of function
    // e.g. prog.c:4:5: warning: implicit declaration of function 'printf'
    const implicitFuncMatch = errorString.match(/prog\.c:(\d+):\d+:.*implicit declaration of function '([^']+)'/);
    if (implicitFuncMatch) {
      if (implicitFuncMatch[2] === 'printf' || implicitFuncMatch[2] === 'scanf') {
         return `You tried to use '${implicitFuncMatch[2]}' on line ${implicitFuncMatch[1]}, but the compiler doesn't know what it is. Did you forget \`#include <stdio.h>\` at the top?`;
      }
      return `You tried to call the function '${implicitFuncMatch[2]}' on line ${implicitFuncMatch[1]}, but it hasn't been defined yet. Make sure it is defined above where you are using it.`;
    }

    // 4. Expected declaration specifiers
    // e.g. prog.c:6:1: error: expected declaration specifiers or '...' before '}' token
    const expectedBraceMatch = errorString.match(/error: expected declaration specifiers/);
    if (expectedBraceMatch) {
      return `There is an issue with your curly braces \`{}\`. You might have an extra closing brace, or you forgot to open a block earlier. Check your brackets!`;
    }

    // 5. Expected expression before
    const expectedExprMatch = errorString.match(/prog\.c:(\d+):\d+: error: expected expression before '([^']+)'/);
    if (expectedExprMatch) {
       return `There's a syntax error near line ${expectedExprMatch[1]}. The compiler didn't expect to see '${expectedExprMatch[2]}' there.`;
    }

    // 6. Unknown type name
    // e.g. prog.c:5:5: error: unknown type name 'String'
    const unknownTypeMatch = errorString.match(/prog\.c:(\d+):\d+: error: unknown type name '([^']+)'/);
    if (unknownTypeMatch) {
        if (unknownTypeMatch[2] === 'String' || unknownTypeMatch[2] === 'string') {
            return `C does not have a built-in '${unknownTypeMatch[2]}' type! Remember, strings in C are arrays of characters (e.g. \`char myString[50];\`).`;
        }
        return `The type '${unknownTypeMatch[2]}' on line ${unknownTypeMatch[1]} is not recognized. Did you misspell \`int\`, \`char\`, or \`float\`?`;
    }

    // 7. Conflicting types
    const conflictingMatch = errorString.match(/prog\.c:(\d+):\d+: error: conflicting types for '([^']+)'/);
    if (conflictingMatch) {
        return `You have defined '${conflictingMatch[2]}' multiple times with different types. Make sure the function declaration and definition match!`;
    }

    // Default friendly C wrapper
    return `Compiler Error:\n${errorString}\n\nTip: Read the line number shown (e.g. prog.c:X:Y means line X). Look for missing semicolons, unmatched brackets, or misspelled variable names!`;
  }

  // --- JAVASCRIPT ERRORS ---
  if (engine === 'javascript') {
    // 1. ReferenceError
    const refErrorMatch = errorString.match(/ReferenceError: (.*) is not defined/);
    if (refErrorMatch) {
      return `Oops! You tried to use '${refErrorMatch[1]}' but it doesn't exist. Did you misspell it or forget to declare it with \`let\` or \`const\`?`;
    }

    // 2. SyntaxError: Unexpected token
    const syntaxMatch = errorString.match(/SyntaxError: Unexpected token '([^']+)'/);
    if (syntaxMatch) {
      return `Syntax Error! You have an unexpected '${syntaxMatch[1]}'. Check for missing parentheses \`()\` or curly braces \`{}\`.`;
    }

    // 3. TypeError
    const typeMatch = errorString.match(/TypeError: (.*) is not a function/);
    if (typeMatch) {
      return `Type Error! You tried to call '${typeMatch[1]}' like a function, but it's not a function.`;
    }
    
    const cannotReadMatch = errorString.match(/TypeError: Cannot read properties of (.*) \(reading '([^']+)'\)/);
    if (cannotReadMatch) {
      return `Type Error! You tried to read '${cannotReadMatch[2]}' from something that is ${cannotReadMatch[1]} (null or undefined). Make sure the object exists before accessing its properties.`;
    }

    // Default friendly JS wrapper
    return `Execution Error:\n${errorString}\n\nTip: Look closely at variable names and ensure all brackets and parentheses are closed properly!`;
  }

  return errorString;
};
