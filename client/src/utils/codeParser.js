import Interpreter from 'js-interpreter';
import * as Babel from '@babel/standalone';

export const analyzeExecution = (code, course = 'js') => {
  let finalCode = code;

  if (course === 'c') {
    // Naive C to JS transpiler to trick js-interpreter into parsing simple C code!
    finalCode = finalCode.replace(/#include\s+<.*>/g, match => `// ${match}`);
    finalCode = finalCode.replace(/int\s+main\s*\(\)\s*\{/g, match => `// ${match}`);
    finalCode = finalCode.replace(/return\s+0;/g, match => `// ${match}`);
    finalCode = finalCode.replace(/\}\s*$/g, match => `// ${match}`); // Comment out the final closing brace
    
    // Arrays: int *arr = malloc(5 * sizeof(int)) -> let arr = new Array(5)
    finalCode = finalCode.replace(/(?:int|float|double|char)\s+\*(\w+)\s*=\s*malloc\(([^)]+)\)/g, 'let $1 = new Array($2)');
    
    // Types (handles multiple words like unsigned int)
    finalCode = finalCode.replace(/(?:\b(?:int|float|double|char|long|short|unsigned)\b\s*)+/g, 'let ');
    
    // Printf -> console.log
    finalCode = finalCode.replace(/printf\s*\((.*?)\)/g, (match, args) => `console.log(${args})`);
  }

  const timeline = [];
  try {
    // js-interpreter does not natively support modern ES6 syntax (like arrow functions).
    // Transpile down to ES5 before feeding into the interpreter.
    // retainLines: true ensures the line numbers match the user's editor!
    const { code: es5Code } = Babel.transform(finalCode, {
      presets: ['env'],
      retainLines: true
    });

    const interpreter = new Interpreter(es5Code, (interpreter, globalObject) => {
      // Stub console.log so it doesn't throw
      const consoleObj = interpreter.nativeToPseudo({});
      interpreter.setProperty(globalObject, 'console', consoleObj);
      const logFunc = interpreter.createNativeFunction(() => {});
      interpreter.setProperty(consoleObj, 'log', logFunc);
    });

    let maxSteps = 10000;
    let lastNode = null;

    const extractMemory = (state) => {
      const memory = {};
      let scope = state ? state.scope : interpreter.globalScope;
      
      // Traverse scopes from local up to global
      while (scope) {
        const scopeProps = scope.object ? scope.object.properties : scope.properties;
        if (scopeProps) {
          for (const key in scopeProps) {
             // Filter out built-ins
             if (!['console', 'Infinity', 'NaN', 'undefined', 'Math', 'window', 'document', 'alert', 'self', 'arguments', 'this'].includes(key)) {
                const val = scopeProps[key];
                if (val === undefined) continue;

                // Handle raw primitives
                if (typeof val === 'number') {
                  memory[key] = { type: 'number', value: val };
                } else if (typeof val === 'string') {
                  memory[key] = { type: 'string', value: `"${val}"` };
                } else if (typeof val === 'boolean') {
                  memory[key] = { type: 'boolean', value: String(val) };
                } else if (val === null) {
                  memory[key] = { type: 'object', value: 'null' };
                } else if (typeof val === 'object') {
                  // Handle pseudo objects if any
                  if (val.class === 'Number') memory[key] = { type: 'number', value: val.data };
                  else if (val.class === 'String') memory[key] = { type: 'string', value: `"${val.data}"` };
                  else if (val.class === 'Boolean') memory[key] = { type: 'boolean', value: String(val.data) };
                  else if (val.class === 'Array') {
                     const arr = [];
                     if (val.properties) {
                       const len = val.properties.length || 0;
                       for (let i = 0; i < len; i++) {
                         const elem = val.properties[i];
                         if (typeof elem === 'string') arr.push(`${i}: "${elem}"`);
                         else arr.push(`${i}: ${String(elem)}`);
                       }
                     }
                     memory[key] = { type: 'array', value: `[${arr.join(', ')}]` };
                  }
                  else if (val.class === 'Object') {
                     const obj = [];
                     if (val.properties) {
                       for (const k in val.properties) {
                         const elem = val.properties[k];
                         if (typeof elem === 'string') obj.push(`${k}: "${elem}"`);
                         else obj.push(`${k}: ${elem}`);
                       }
                     }
                     memory[key] = { type: 'object', value: `{ ${obj.join(', ')} }` };
                  }
                  else memory[key] = { type: 'object', value: String(val) };
                }
             }
          }
        }
        scope = scope.parentScope;
      }
      return JSON.parse(JSON.stringify(memory));
    };

    while (interpreter.step() && maxSteps-- > 0) {
      if (interpreter.stateStack.length) {
        const state = interpreter.stateStack[interpreter.stateStack.length - 1];
        const node = state.node;

        // Include calculations and major structural steps
        if (node && node.start !== undefined && node !== lastNode && 
           (node.type.endsWith('Statement') && node.type !== 'BlockStatement' || node.type === 'VariableDeclaration' || ['AssignmentExpression', 'UpdateExpression', 'CallExpression', 'BinaryExpression', 'LogicalExpression'].includes(node.type))) {
          lastNode = node;
          
          const memory = extractMemory(state);

          // Calculate precise line and column numbers (1-indexed) based on character offsets
          const startText = es5Code.substring(0, node.start);
          const startLines = startText.split('\n');
          const startLine = startLines.length;
          const startCol = startLines[startLines.length - 1].length + 1;

          const endText = es5Code.substring(0, node.end);
          const endLines = endText.split('\n');
          const endLine = endLines.length;
          const endCol = endLines[endLines.length - 1].length + 1;
          
          let sourceCodeSnippet = es5Code.substring(node.start, node.end);

          if (course === 'c') {
            const originalLine = code.split('\n')[startLine - 1] || '';
            if (node.type.endsWith('Statement') || node.type === 'VariableDeclaration') {
              sourceCodeSnippet = originalLine.trim();
            } else {
              sourceCodeSnippet = sourceCodeSnippet.replace(/console\.log/g, 'printf');
              sourceCodeSnippet = sourceCodeSnippet.replace(/let\s+/g, '');
              sourceCodeSnippet = sourceCodeSnippet.replace(/new\s+Array\((.*?)\)/g, 'malloc($1 * sizeof(int))');
            }
          }

          timeline.push({ 
            range: { startLine, startCol, endLine, endCol }, 
            type: node.type, 
            sourceCode: sourceCodeSnippet,
            memory
          });
        }
      }
    }

    // Push final state to capture terminal memory
    if (timeline.length > 0) {
      const finalMemory = extractMemory(null);
      const lastRange = timeline[timeline.length - 1].range;
      timeline.push({
        range: lastRange,
        type: 'ProgramEnd',
        memory: finalMemory
      });
    }

    // Deduplicate: If the exact same AST node evaluates multiple times in a row without memory changing, skip it.
    // But we keep different nodes on the same line to show "internal steps".
    const cleanTimeline = [];
    let lastMemStr = '';
    
    for (let i = 0; i < timeline.length; i++) {
       const frame = timeline[i];
       const memStr = JSON.stringify(frame.memory);
       
       if (i === 0) {
         cleanTimeline.push(frame);
         lastMemStr = memStr;
       } else {
         const lastFrame = cleanTimeline[cleanTimeline.length - 1];
         // Only skip if it's the EXACT SAME range and memory didn't change
         const isSameRange = frame.range.startCol === lastFrame.range.startCol && frame.range.startLine === lastFrame.range.startLine && frame.range.endCol === lastFrame.range.endCol;
         if (memStr !== lastMemStr || !isSameRange) {
            cleanTimeline.push(frame);
            lastMemStr = memStr;
         }
       }
    }
    
    return cleanTimeline;
  } catch (err) {
    console.error("Interpreter failed to parse:", err);
    return [];
  }
};
