import { useState, useRef, useEffect, memo } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, Terminal, CheckCircle2, XCircle, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const buildFullCode = (userCode, locked) => locked ? `${userCode}\n${locked}` : userCode;
const getUserCode = (fullCode, locked) => {
  if (!locked) return fullCode;
  const lines = fullCode.split('\n');
  // Strip the last line if it matches the locked line
  if (lines[lines.length - 1].trim() === locked.trim()) {
    return lines.slice(0, -1).join('\n');
  }
  return fullCode;
};

const CodeEditor = memo(({ initialCode, defaultCode, onReset, onRunCode, onCodeChange, appendedCode, activeRange, showSuccess, onNextQuest, isLastChallenge, onReturnToMap, testCases, challengeStats, formatTime, timerSeconds, sessionAttempts, maxAttempts, cooldownRemaining }) => {
  const getInitialCode = () => buildFullCode(initialCode || '// Write your code here', appendedCode);
  const [code, setCode] = useState(getInitialCode);
  const [output, setOutput] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const workerRef = useRef(null);
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const decorationsRef = useRef([]);
  const lockedLineRef = useRef(appendedCode);

  const handleRunRef = useRef(null);

  const applyLockedDecoration = (editor, monaco) => {
    const model = editor.getModel();
    if (!model || !lockedLineRef.current) return;
    const totalLines = model.getLineCount();
    // Style the last line as read-only (dim + italic)
    editor.deltaDecorations([], [
      {
        range: new monaco.Range(totalLines, 1, totalLines, model.getLineMaxColumn(totalLines)),
        options: {
          inlineClassName: 'locked-line-decoration',
          isWholeLine: true,
        },
      },
    ]);
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Apply decoration once mounted
    applyLockedDecoration(editor, monaco);

    // Block any edits on the last line (the locked return statement)
    editor.onKeyDown((e) => {
      if (!lockedLineRef.current) return;
      const model = editor.getModel();
      const totalLines = model.getLineCount();
      const sel = editor.getSelection();
      // If cursor or selection touches the last line, block all printable keys + backspace/delete
      const touchesLastLine =
        sel.endLineNumber === totalLines ||
        sel.startLineNumber === totalLines;
      if (touchesLastLine) {
        const isNavigation = [
          monaco.KeyCode.UpArrow, monaco.KeyCode.DownArrow,
          monaco.KeyCode.LeftArrow, monaco.KeyCode.RightArrow,
          monaco.KeyCode.Home, monaco.KeyCode.End,
          monaco.KeyCode.PageUp, monaco.KeyCode.PageDown,
        ].includes(e.keyCode);
        if (!isNavigation) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    });

    // Prevent paste on last line
    editor.onDidPaste(() => {
      if (!lockedLineRef.current) return;
      const model = editor.getModel();
      const totalLines = model.getLineCount();
      const lastLineContent = model.getLineContent(totalLines);
      if (lastLineContent.trim() !== lockedLineRef.current.trim()) {
        // Restore the locked line
        const range = new monaco.Range(totalLines, 1, totalLines, model.getLineMaxColumn(totalLines));
        editor.executeEdits('', [{ range, text: lockedLineRef.current.trim() }]);
      }
    });

    // Add Ctrl+Enter / Cmd+Enter shortcut to run code
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      if (handleRunRef.current) handleRunRef.current();
    });
  };

  useEffect(() => {
    lockedLineRef.current = appendedCode;
    const full = buildFullCode(initialCode || '// Write your code here', appendedCode);
    setCode(full);
    // Re-apply decoration after model updates
    if (editorRef.current && monacoRef.current) {
      setTimeout(() => applyLockedDecoration(editorRef.current, monacoRef.current), 50);
    }
  }, [initialCode, appendedCode]);

  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;
    
    if (activeRange) {
      decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, [
        {
          range: new monacoRef.current.Range(activeRange.startLine, activeRange.startCol, activeRange.endLine, activeRange.endCol),
          options: {
            className: 'monaco-active-highlight',
          }
        }
      ]);
      
      // Reveal the line only if it's not visible
      editorRef.current.revealLineInCenterIfOutsideViewport(activeRange.startLine);
    } else {
      decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, []);
    }
  }, [activeRange]);



  useEffect(() => {
    workerRef.current = new Worker(new URL('../../utils/codeRunnerWorker.js', import.meta.url), { type: 'module' });
    workerRef.current.onmessage = async (e) => {
      setIsRunning(false);
      const { type, logs, error, result, testResults, success: testsSuccess } = e.data;
      const newOutput = [];
      if (logs?.length > 0) newOutput.push(...logs.map((log) => ({ type: 'log', text: log })));
      
      let finalResult = 'success';
      if (type === 'error') { 
        newOutput.push({ type: 'error', text: error }); 
        finalResult = 'error'; 
      } else if (type === 'test_cases') {
        newOutput.push({ type: 'log', text: 'Running Test Cases...' });
        testResults.forEach(tr => {
          if (tr.passed) {
            newOutput.push({ type: 'result', text: `✅ Case ${tr.index}: PASS` });
          } else {
            newOutput.push({ type: 'error', text: `❌ Case ${tr.index}: FAIL - Expected ${tr.expected}, got ${tr.actual}` });
          }
        });
        if (!testsSuccess) finalResult = 'error';
      } else if (result !== undefined) { 
        newOutput.push({ type: 'result', text: `Return: ${result}` }); 
      } else if (type === 'success') { 
        newOutput.push({ type: 'log', text: 'Executed successfully.' }); 
      }

      // Always notify parent so it can track attempts/errors regardless of result type
      const validation = await onRunCode?.({ ...e.data, executedCode: code });
      if (type === 'success' || type === 'test_cases') {
        if (validation && !validation.success) {
           if (type !== 'test_cases') {
             newOutput.push({ type: 'error', text: `❌ Test Failed: Expected "${validation.expected}" but got "${result}"` });
           }
           finalResult = 'error';
        }
      }
      
      setOutput(newOutput);
      setLastResult(finalResult);
    };
    return () => workerRef.current?.terminate();
  }, [onRunCode]);

  const initWorker = () => {
    workerRef.current = new Worker(new URL('../../utils/codeRunnerWorker.js', import.meta.url), { type: 'module' });
    workerRef.current.onmessage = async (e) => {
      setIsRunning(false);
      const { type, logs, error, result, testResults, success: testsSuccess } = e.data;
      const newOutput = [];
      if (logs?.length > 0) newOutput.push(...logs.map((log) => ({ type: 'log', text: log })));
      
      let finalResult = 'success';
      if (type === 'error') { 
        newOutput.push({ type: 'error', text: error }); 
        finalResult = 'error'; 
      } else if (type === 'test_cases') {
        newOutput.push({ type: 'log', text: 'Running Test Cases...' });
        testResults.forEach(tr => {
          if (tr.passed) {
            newOutput.push({ type: 'result', text: `✅ Case ${tr.index}: PASS` });
          } else {
            newOutput.push({ type: 'error', text: `❌ Case ${tr.index}: FAIL - Expected ${tr.expected}, got ${tr.actual}` });
          }
        });
        if (!testsSuccess) finalResult = 'error';
      } else if (result !== undefined) { 
        newOutput.push({ type: 'result', text: `Return: ${result}` }); 
      } else if (type === 'success') { 
        newOutput.push({ type: 'log', text: 'Executed successfully.' }); 
      }

      // Always notify parent so it can track attempts/errors regardless of result type
      const validation = await onRunCode?.({ ...e.data, executedCode: code });
      if (type === 'success' || type === 'test_cases') {
        if (validation && !validation.success) {
           if (type !== 'test_cases' || validation.errorMessage) {
             if (validation.errorMessage) {
               newOutput.push({ type: 'error', text: `❌ ${validation.errorMessage}` });
             } else {
               newOutput.push({ type: 'error', text: `❌ Test Failed: Expected "${validation.expected}" but got "${result}"` });
             }
           }
           finalResult = 'error';
        }
      }
      
      setOutput(newOutput);
      setLastResult(finalResult);
    };
  };

  const handleCodeChange = (val) => {
    const full = val ?? '';
    setCode(full);
    // Report only the user-writable portion (excluding the locked last line)
    const userOnly = getUserCode(full, lockedLineRef.current);
    onCodeChange?.(userOnly);
  };

  const handleRun = () => {
    if (isRunning || cooldownRemaining > 0) {
      if (cooldownRemaining > 0) {
        setOutput([{ type: 'error', text: `❌ Engine cooling down. Please wait ${cooldownRemaining}s before trying again.` }]);
        setLastResult('error');
      }
      return;
    }
    setIsRunning(true); setLastResult(null);
    setOutput([{ type: 'log', text: 'Running...' }]);
    const timeout = setTimeout(() => {
      workerRef.current?.terminate(); setIsRunning(false); setLastResult('error');
      setOutput([{ type: 'error', text: 'Execution timeout.' }]); initWorker();
    }, 3000);
    // code already contains the locked return line (appended via buildFullCode), no need to re-append
    workerRef.current.postMessage({ code: code, testCases });
    workerRef.current.addEventListener('message', () => clearTimeout(timeout), { once: true });
  };

  // Keep ref updated with latest handleRun to use in Monaco shortcut
  useEffect(() => {
    handleRunRef.current = handleRun;
  }, [handleRun]);

  const handleReset = () => {
    if (onReset) onReset();
    const reset = buildFullCode(defaultCode || '// Write your code here', lockedLineRef.current);
    setCode(reset);
    onCodeChange?.(defaultCode || '// Write your code here');
    setOutput([]);
    setLastResult(null);
  };

  return (
      <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex flex-col h-full bg-[#0a0a0a] border-l border-white/5 overflow-hidden transition-all duration-500`}
    >
      <div className="flex items-center justify-between px-6 py-4 bg-[#0a0a0a] border-b border-white/5">
        <div className="flex items-center gap-3">
          <Terminal className="w-4 h-4 text-[#1591DC]" />
          <span className="text-xs font-mono font-bold tracking-widest text-white/50 uppercase">index.js</span>
          {lastResult === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          {lastResult === 'error' && <XCircle className="w-4 h-4 text-red-500" />}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleReset} className="p-2.5 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-colors" title="Reset Code">
            <RotateCcw className="w-4 h-4" />
          </button>
          {maxAttempts > 0 && (
            <div className={`px-3 py-1.5 rounded-full border text-xs font-bold tracking-widest ${
              sessionAttempts >= maxAttempts 
                ? 'bg-red-500/20 border-red-500/30 text-red-400' 
                : 'bg-white/5 border-white/10 text-white/50'
            }`}>
              {sessionAttempts}/{maxAttempts}
            </div>
          )}
          <motion.button
            id="tour-execute"
            whileHover={cooldownRemaining > 0 ? {} : { scale: 1.05 }}
            whileTap={cooldownRemaining > 0 ? {} : { scale: 0.95 }}
            onClick={handleRun}
            disabled={isRunning || cooldownRemaining > 0}
            className={`flex items-center gap-2 px-6 py-2.5 text-white text-xs tracking-widest uppercase font-bold rounded-full transition-all ${
              cooldownRemaining > 0
                ? 'bg-red-500/20 text-red-400 cursor-not-allowed border border-red-500/30'
                : 'bg-[#1591DC] hover:bg-[#127ABD] shadow-[0_0_15px_rgba(21,145,220,0.3)] disabled:opacity-50'
            }`}
          >
            {cooldownRemaining > 0 ? (
              <span>Wait {cooldownRemaining}s</span>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                {isRunning ? 'Running...' : 'Execute'}
              </>
            )}
          </motion.button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-0 bg-[#050505]">
        <div id="tour-editor" className="min-h-[250px] lg:min-h-0 border-b lg:border-b-0 lg:border-r border-white/5 relative">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={code}
            onChange={handleCodeChange}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              padding: { top: 20, bottom: 20 },
              scrollBeyondLastLine: false,
              overviewRulerLanes: 0,
              hideCursorInOverviewRuler: true,
              scrollbar: { vertical: 'hidden', horizontal: 'hidden' },
              lineNumbersMinChars: 3,
            }}
          />
        </div>
        {/* Output Console / Success Pane */}
        <div className="min-h-[180px] lg:min-h-0 bg-[#0a0a0a] flex flex-col relative overflow-hidden">
          {showSuccess ? (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 bg-[#0a0a0a]">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1591DC] to-emerald-400" />
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Quest Cleared!</h3>
                  <p className="text-emerald-400 text-sm font-medium">+10 XP Earned</p>
                </div>
              </div>
              
              {challengeStats && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-6 max-w-sm text-center">
                  <p className="text-sm text-emerald-100/80 leading-relaxed">
                    {timerSeconds > 0 ? (
                      <>You solved this challenge in <span className="font-mono font-bold text-emerald-300">{formatTime(timerSeconds)}</span> using <span className="font-bold text-emerald-300">{challengeStats.attempts || 1}</span> {challengeStats.attempts === 1 ? 'attempt' : 'attempts'}.</>
                    ) : (
                      <>You solved this challenge using <span className="font-bold text-emerald-300">{challengeStats.attempts || 1}</span> {challengeStats.attempts === 1 ? 'attempt' : 'attempts'}.</>
                    )}
                  </p>
                </div>
              )}

              {!isLastChallenge ? (
                <button 
                  onClick={onNextQuest} 
                  className="px-8 py-2 bg-[#1591DC] hover:bg-[#127ABD] text-white rounded-lg font-bold transition-all shadow-[0_0_20px_rgba(21,145,220,0.2)] hover:shadow-[0_0_30px_rgba(21,145,220,0.4)]"
                >
                  Next Challenge
                </button>
              ) : (
                <button 
                  onClick={onReturnToMap} 
                  className="px-8 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition-all shadow-[0_0_20px_rgba(52,211,153,0.2)] hover:shadow-[0_0_30px_rgba(52,211,153,0.4)]"
                >
                  World Complete! Return
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center px-4 py-2 border-b border-white/5 bg-[#111]">
                <Terminal className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-300">Console</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 font-mono text-sm custom-scrollbar">
                {output.map((log, i) => (
                  <div key={i} className={`mb-1 ${log.type === 'error' ? 'text-red-400' : 'text-gray-300'}`}>
                    {log.type === 'error' ? '❌ ' : '› '}
                    {typeof log.text === 'object' ? JSON.stringify(log.text) : log.text}
                  </div>
                ))}
                {output.length === 0 && (
                  <div className="text-gray-500 italic text-sm text-center mt-4">
                    Run your code to see output...
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
});

CodeEditor.displayName = 'CodeEditor';
export default CodeEditor;
