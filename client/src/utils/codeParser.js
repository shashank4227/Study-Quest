import Interpreter from 'js-interpreter';
import * as Babel from '@babel/standalone';

export const analyzeExecution = (code) => {
  const timeline = [];
  try {
    // js-interpreter does not natively support modern ES6 syntax (like arrow functions).
    // Transpile down to ES5 before feeding into the interpreter.
    // retainLines: true ensures the line numbers match the user's editor!
    const { code: es5Code } = Babel.transform(code, {
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

        // Include expressions that represent 'internal steps' like math, assignments, or condition checks
        if (node && node.start !== undefined && node !== lastNode && 
           (node.type.endsWith('Statement') || node.type === 'VariableDeclaration' || node.type.endsWith('Expression'))) {
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
          
          const sourceCodeSnippet = es5Code.substring(node.start, node.end);

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
