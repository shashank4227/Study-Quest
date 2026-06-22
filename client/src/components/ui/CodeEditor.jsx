import { useState, useRef, useEffect, memo } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, Terminal, CheckCircle2, XCircle, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const CodeEditor = memo(({ initialCode, onRunCode, onCodeChange, appendedCode, activeRange, showSuccess, onNextQuest, isLastChallenge, onReturnToMap, testCases, challengeStats, formatTime }) => {
  const [code, setCode] = useState(initialCode || '// Write your code here\n');
  const [output, setOutput] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const workerRef = useRef(null);
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const decorationsRef = useRef([]);

  const handleRunRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    
    // Add Ctrl+Enter / Cmd+Enter shortcut to run code
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      if (handleRunRef.current) {
        handleRunRef.current();
      }
    });
  };

  useEffect(() => { setCode(initialCode || '// Write your code here\n'); }, [initialCode]);

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

      if (type === 'success' || type === 'test_cases') {
        const validation = await onRunCode?.(e.data);
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

      if (type === 'success' || type === 'test_cases') {
        const validation = await onRunCode?.(e.data);
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
  };

  const handleCodeChange = (val) => { setCode(val ?? ''); onCodeChange?.(val ?? ''); };

  const handleRun = () => {
    if (isRunning) return;
    setIsRunning(true); setLastResult(null);
    setOutput([{ type: 'log', text: 'Running...' }]);
    const timeout = setTimeout(() => {
      workerRef.current?.terminate(); setIsRunning(false); setLastResult('error');
      setOutput([{ type: 'error', text: 'Execution timeout.' }]); initWorker();
    }, 3000);
    const finalCode = appendedCode ? `${code}\n${appendedCode}` : code;
    workerRef.current.postMessage({ code: finalCode, testCases });
    workerRef.current.addEventListener('message', () => clearTimeout(timeout), { once: true });
  };

  // Keep ref updated with latest handleRun to use in Monaco shortcut
  useEffect(() => {
    handleRunRef.current = handleRun;
  }, [handleRun]);

  const handleReset = () => {
    const reset = initialCode || '// Write your code here\n';
    setCode(reset); onCodeChange?.(reset); setOutput([]); setLastResult(null);
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
          <button onClick={handleReset} className="p-2.5 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
            <RotateCcw className="w-4 h-4" />
          </button>
          <motion.button
            id="tour-execute"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#1591DC] hover:bg-[#127ABD] text-white text-xs tracking-widest uppercase font-bold rounded-full disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(21,145,220,0.3)]"
          >
            <Play className="w-4 h-4 fill-current" />
            {isRunning ? 'Running...' : 'Execute'}
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
              padding: { top: 20 },
              scrollBeyondLastLine: false,
              overviewRulerLanes: 0,
              hideCursorInOverviewRuler: true,
              scrollbar: { vertical: 'hidden', horizontal: 'hidden' },
              lineNumbersMinChars: 3,
            }}
          />
          {appendedCode && (
            <div className="absolute bottom-0 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-sm border-t border-white/5 py-3 px-[4.5rem] flex items-center gap-3">
              <Lock className="w-3.5 h-3.5 text-white/30" />
              <span className="font-mono text-sm text-white/30">{appendedCode}</span>
            </div>
          )}
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
              
              {challengeStats && formatTime && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-6 max-w-sm text-center">
                  <p className="text-sm text-emerald-100/80 leading-relaxed">
                    You solved this challenge in <span className="font-mono font-bold text-emerald-300">{formatTime(challengeStats.timeSpent)}</span> using <span className="font-bold text-emerald-300">{challengeStats.attempts || 1}</span> {challengeStats.attempts === 1 ? 'attempt' : 'attempts'}.
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
