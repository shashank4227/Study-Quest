import { useState, useRef, useEffect, memo } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, Terminal, CheckCircle2, XCircle, Lock, Trophy, ArrowRight, Map } from 'lucide-react';
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

const CodeEditor = memo(({ initialCode, defaultCode, onReset, onRunCode, onCodeChange, appendedCode, activeRange, showSuccess, onNextQuest, isLastChallenge, onReturnToMap, testCases, challengeStats, formatTime, timerSeconds, sessionAttempts, maxAttempts, cooldownRemaining, executionEngine = 'javascript', lockedPreambleLines = 0, lockedSuffixLines = 0, lockedMainLineIndex = null, nextWorldAvailable = false, rewardData }) => {
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
  const lockedPreambleRef = useRef(lockedPreambleLines);
  const lockedSuffixRef = useRef(lockedSuffixLines);
  const lockedMainLineRef = useRef(lockedMainLineIndex);

  // Snapshots of locked regions to restore if tampered
  const preambleTextRef = useRef('');
  const suffixTextRef = useRef('');
  const mainTextRef = useRef('');

  const handleRunRef = useRef(null);

  const applyLockedDecoration = (editor, monaco) => {
    const model = editor.getModel();
    if (!model) return;
    const totalLines = model.getLineCount();
    const ranges = [];

    // Lock bottom single line (JS return statement)
    if (lockedLineRef.current) {
      ranges.push({
        range: new monaco.Range(totalLines, 1, totalLines, model.getLineMaxColumn(totalLines)),
        options: { inlineClassName: 'locked-line-decoration', isWholeLine: true },
      });
    }

    // Lock last N suffix lines (for C: return 0; + })
    const sLines = lockedSuffixRef.current || 0;
    if (sLines > 0) {
      for (let l = totalLines - sLines + 1; l <= totalLines; l++) {
        ranges.push({
          range: new monaco.Range(l, 1, l, model.getLineMaxColumn(l)),
          options: { inlineClassName: 'locked-line-decoration', isWholeLine: true },
        });
      }
    }

    // Lock top N preamble lines (for C)
    const pLines = lockedPreambleRef.current || 0;
    for (let l = 1; l <= pLines; l++) {
      ranges.push({
        range: new monaco.Range(l, 1, l, model.getLineMaxColumn(l)),
        options: { inlineClassName: 'locked-line-decoration', isWholeLine: true },
      });
    }

    // Lock specific main line (for C)
    const mLine = lockedMainLineRef.current;
    if (mLine) {
      ranges.push({
        range: new monaco.Range(mLine, 1, mLine, model.getLineMaxColumn(mLine)),
        options: { inlineClassName: 'locked-line-decoration', isWholeLine: true },
      });
    }

    if (ranges.length > 0) {
      editor.deltaDecorations([], ranges);
    }
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Apply decoration once mounted
    applyLockedDecoration(editor, monaco);

    // Block any edits on locked lines (preamble top + suffix bottom)
    editor.onKeyDown((e) => {
      const model = editor.getModel();
      const totalLines = model.getLineCount();
      const sel = editor.getSelection();
      const pLines = lockedPreambleRef.current || 0;
      const sLines = lockedSuffixRef.current || 0;
      const suffixStartLine = totalLines - sLines + 1;

      const touchesLastLine = lockedLineRef.current &&
        (sel.endLineNumber === totalLines || sel.startLineNumber === totalLines);
      const touchesPreamble = pLines > 0 &&
        (sel.startLineNumber <= pLines || sel.endLineNumber <= pLines);
      const touchesSuffix = sLines > 0 &&
        (sel.startLineNumber >= suffixStartLine || sel.endLineNumber >= suffixStartLine);
      const touchesMainLine = lockedMainLineRef.current &&
        (sel.startLineNumber <= lockedMainLineRef.current && sel.endLineNumber >= lockedMainLineRef.current);

      if (touchesLastLine || touchesPreamble || touchesSuffix || touchesMainLine) {
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

    // Prevent paste on locked lines
    editor.onDidPaste(() => {
      const model = editor.getModel();
      const totalLines = model.getLineCount();
      // Restore last line if tampered (JS)
      if (lockedLineRef.current) {
        const lastLineContent = model.getLineContent(totalLines);
        if (lastLineContent.trim() !== lockedLineRef.current.trim()) {
          const range = new monaco.Range(totalLines, 1, totalLines, model.getLineMaxColumn(totalLines));
          editor.executeEdits('', [{ range, text: lockedLineRef.current.trim() }]);
        }
      }
      // Restore preamble lines if tampered
      const pLines = lockedPreambleRef.current || 0;
      if (pLines > 0 && preambleTextRef.current) {
        const preambleLines = preambleTextRef.current.split('\n');
        for (let l = 1; l <= pLines; l++) {
          const current = model.getLineContent(l);
          if (current !== preambleLines[l - 1]) {
            const range = new monaco.Range(l, 1, l, model.getLineMaxColumn(l));
            editor.executeEdits('', [{ range, text: preambleLines[l - 1] }]);
          }
        }
      }
      // Restore suffix lines if tampered (C: return 0; + })
      const sLines = lockedSuffixRef.current || 0;
      if (sLines > 0 && suffixTextRef.current) {
        const suffixLines = suffixTextRef.current.split('\n');
        const suffixStartLine = totalLines - sLines + 1;
        for (let i = 0; i < sLines; i++) {
          const l = suffixStartLine + i;
          const current = model.getLineContent(l);
          if (current !== suffixLines[i]) {
            const range = new monaco.Range(l, 1, l, model.getLineMaxColumn(l));
            editor.executeEdits('', [{ range, text: suffixLines[i] }]);
          }
        }
      }
      // Restore main line if tampered
      const mLine = lockedMainLineRef.current;
      if (mLine && mainTextRef.current) {
        const current = model.getLineContent(mLine);
        if (current !== mainTextRef.current) {
          const range = new monaco.Range(mLine, 1, mLine, model.getLineMaxColumn(mLine));
          editor.executeEdits('', [{ range, text: mainTextRef.current }]);
        }
      }
    });

    // Add Ctrl+Enter / Cmd+Enter shortcut to run code
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      if (handleRunRef.current) handleRunRef.current();
    });
  };

  useEffect(() => {
    lockedLineRef.current = appendedCode;
    lockedPreambleRef.current = lockedPreambleLines;
    lockedSuffixRef.current = lockedSuffixLines;
    lockedMainLineRef.current = lockedMainLineIndex;
    const full = buildFullCode(initialCode || '// Write your code here', appendedCode);
    setCode(full);
    // Snapshot preamble text
    if (lockedPreambleLines > 0) {
      preambleTextRef.current = full.split('\n').slice(0, lockedPreambleLines).join('\n');
    }
    // Snapshot suffix text
    if (lockedSuffixLines > 0) {
      const lines = full.split('\n');
      suffixTextRef.current = lines.slice(lines.length - lockedSuffixLines).join('\n');
    }
    // Snapshot main text
    if (lockedMainLineIndex) {
      const lines = full.split('\n');
      mainTextRef.current = lines[lockedMainLineIndex - 1] || '';
    }
    // Re-apply decoration after model updates
    if (editorRef.current && monacoRef.current) {
      setTimeout(() => applyLockedDecoration(editorRef.current, monacoRef.current), 50);
    }
  }, [initialCode, appendedCode, lockedPreambleLines, lockedSuffixLines, lockedMainLineIndex]);

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
            newOutput.push({ 
              type: 'error_blocks', 
              text: `Case ${tr.index}: FAIL`, 
              expected: tr.expected, 
              actual: tr.actual 
            });
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
              newOutput.push({ 
                type: 'error_blocks', 
                text: 'Test Failed', 
                expected: validation.expected, 
                actual: result 
              });
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
            newOutput.push({ 
              type: 'error_blocks', 
              text: `Case ${tr.index}: FAIL`, 
              expected: tr.expected, 
              actual: tr.actual 
            });
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
                newOutput.push({ 
                  type: 'error_blocks', 
                  text: 'Test Failed', 
                  expected: validation.expected, 
                  actual: result 
                });
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

  const handleRun = async () => {
    if (isRunning || cooldownRemaining > 0) {
      if (cooldownRemaining > 0) {
        setOutput([{ type: 'error', text: `❌ Engine cooling down. Please wait ${cooldownRemaining}s before trying again.` }]);
        setLastResult('error');
      }
      return;
    }
    setIsRunning(true); setLastResult(null);
    setOutput([{ type: 'log', text: 'Running...' }]);

    if (executionEngine === 'c') {
      try {
        if (testCases && testCases.length > 0) {
          const testResults = [];
          let allPassed = true;
          const newOutput = [{ type: 'log', text: 'Running Test Cases...' }];
          
          for (let i = 0; i < testCases.length; i++) {
             const tc = testCases[i];
             const res = await fetch('https://wandbox.org/api/compile.json', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  compiler: 'gcc-13.2.0-c',
                  code: code,
                  stdin: tc.input || '',
                  save: false
                })
             });
             const data = await res.json();
             
             if (String(data.status) !== '0') {
                newOutput.push({ type: 'error', text: data.compiler_error || data.program_error || 'Execution failed' });
                allPassed = false;
                testResults.push({ index: i + 1, input: tc.input, expected: tc.expectedOutput, actual: 'ERROR', passed: false });
                break;
             } else {
                const runResult = data.program_output || '';
                const normalize = s => String(s).replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
                const actual = normalize(runResult);
                const expected = normalize(tc.expectedOutput);
                const passed = actual === expected;
                                if (passed) {
                   newOutput.push({ type: 'result', text: `✅ Case ${i + 1}: PASS` });
                 } else {
                   newOutput.push({ 
                     type: 'error_blocks', 
                     text: `Case ${i + 1}: FAIL`, 
                     expected: expected, 
                     actual: actual 
                   });
                   allPassed = false;
                 }
                
                testResults.push({ index: i + 1, input: tc.input, expected, actual, passed });
             }
          }
          
          const validation = await onRunCode?.({
            type: 'test_cases',
            success: allPassed,
            testResults,
            executedCode: code
          });
          
          let finalResult = allPassed ? 'success' : 'error';
          if (allPassed && validation && !validation.success) {
            finalResult = 'error';
            if (validation.errorMessage) {
              newOutput.push({ type: 'error', text: `❌ ${validation.errorMessage}` });
            }
          }
          
          setOutput(newOutput);
          setLastResult(finalResult);
        } else {
          // Standard single execution
          const res = await fetch('https://wandbox.org/api/compile.json', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              compiler: 'gcc-13.2.0-c',
              code: code,
              save: false
            })
          });
          const data = await res.json();
          
          let finalResult = 'success';
          const newOutput = [];
          
          if (String(data.status) !== '0') {
              newOutput.push({ type: 'error', text: data.compiler_error || data.program_error || 'Execution failed' });
              finalResult = 'error';
          } else {
              newOutput.push({ type: 'log', text: 'Compiled and executed successfully.' });
              newOutput.push({ type: 'result', text: `Return:\n${data.program_output || ''}` });
          }

          const runResult = data.program_output || '';

          const validation = await onRunCode?.({ 
              type: finalResult, 
              result: runResult, 
              error: data.compiler_error || data.program_error, 
              executedCode: code 
          });

          if (finalResult === 'success') {
            if (validation && !validation.success) {
              if (validation.errorMessage) {
                newOutput.push({ type: 'error', text: `❌ ${validation.errorMessage}` });
              } else {
                newOutput.push({ 
                  type: 'error_blocks', 
                  text: 'Test Failed', 
                  expected: validation.expected, 
                  actual: runResult.trim() 
                });
              }
              finalResult = 'error';
            }
          }

          setOutput(newOutput);
          setLastResult(finalResult);
        }
      } catch (err) {
         setOutput([{ type: 'error', text: 'Execution failed: Network error or API down.' }]);
         setLastResult('error');
      } finally {
         setIsRunning(false);
      }
      return;
    }

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
          <span className="text-xs font-mono font-bold tracking-widest text-white/50 uppercase">{executionEngine === 'c' ? 'main.c' : 'index.js'}</span>
          {lastResult === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          {lastResult === 'error' && <XCircle className="w-4 h-4 text-red-500" />}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleReset} className="p-2.5 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-colors" title="Reset Code">
            <RotateCcw className="w-4 h-4" />
          </button>
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
            defaultLanguage={executionEngine === 'c' ? 'c' : 'javascript'}
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
            <div className="absolute inset-0 z-10 overflow-y-auto bg-[#0a0a0a] custom-scrollbar">
              <div className="min-h-full flex flex-col items-center justify-center p-6 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1591DC] to-emerald-400" />
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Quest Cleared!</h3>
                  <p className="text-emerald-400 text-sm font-medium">+{rewardData?.xpEarned || 0} XP Earned</p>
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

              {output && output.length > 0 && (
                <div className="w-full max-w-md bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-xl p-4 mb-6 shadow-2xl">
                  <div className="text-[10px] font-bold text-emerald-400/90 uppercase tracking-widest mb-2.5 flex items-center gap-1.5 justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Execution Output
                  </div>
                  <div className="font-mono text-xs max-h-32 overflow-y-auto custom-scrollbar bg-[#050505]/60 rounded-lg p-3 border border-white/5 flex flex-col gap-1.5 text-left">
                    {output.map((log, i) => (
                      <div 
                        key={i} 
                        className={`leading-relaxed ${
                          log.type === 'result' 
                            ? 'text-emerald-400 font-semibold' 
                            : log.type === 'error' 
                            ? 'text-red-400' 
                            : 'text-gray-400'
                        }`}
                      >
                        {log.type === 'result' ? '» ' : '  '}
                        {typeof log.text === 'object' ? JSON.stringify(log.text) : log.text}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!isLastChallenge ? (
                /* ── Regular challenge success ── */
                <button 
                  onClick={onNextQuest} 
                  className="flex items-center gap-2 px-8 py-2.5 bg-[#1591DC] hover:bg-[#127ABD] text-white rounded-lg font-bold transition-all shadow-[0_0_20px_rgba(21,145,220,0.2)] hover:shadow-[0_0_30px_rgba(21,145,220,0.4)]"
                >
                  Next Challenge <ArrowRight className="w-4 h-4" />
                </button>
              ) : nextWorldAvailable ? (
                /* ── Boss defeated — next world available ── */
                <div className="flex flex-col items-center gap-3 w-full max-w-xs">
                  <div className="flex items-center gap-2 text-yellow-400 text-xs font-bold tracking-widest uppercase mb-1">
                    <Trophy className="w-4 h-4" />
                    World Conquered!
                    <Trophy className="w-4 h-4" />
                  </div>
                  <motion.button
                    onClick={onNextQuest}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl font-bold text-base text-white
                      bg-gradient-to-r from-emerald-500 to-[#1591DC]
                      shadow-[0_0_30px_rgba(52,211,153,0.35)] hover:shadow-[0_0_45px_rgba(52,211,153,0.55)]
                      transition-all duration-300"
                  >
                    Enter Next World
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                  <button
                    onClick={onReturnToMap}
                    className="w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white/50 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all"
                  >
                    <Map className="w-4 h-4" /> View World Map
                  </button>
                </div>
              ) : (
                /* ── Course complete — no more worlds ── */
                <div className="flex flex-col items-center gap-3 w-full max-w-xs">
                  <div className="flex items-center gap-2 text-yellow-400 text-xs font-bold tracking-widest uppercase mb-1">
                    <Trophy className="w-4 h-4" />
                    Course Complete!
                    <Trophy className="w-4 h-4" />
                  </div>
                  <button
                    onClick={onReturnToMap}
                    className="w-full flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-base text-white
                      bg-gradient-to-r from-yellow-500 to-emerald-500
                      shadow-[0_0_30px_rgba(234,179,8,0.35)] hover:shadow-[0_0_45px_rgba(234,179,8,0.55)]
                      transition-all duration-300"
                  >
                    <Map className="w-5 h-5" /> Return to Map
                  </button>
                </div>
              )}
            </div>
            </div>
          ) : (
            <>
              <div className="flex items-center px-4 py-2 border-b border-white/5 bg-[#111]">
                <Terminal className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-300">Console</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 font-mono text-sm custom-scrollbar">
                {output.map((log, i) => {
                  if (log.type === 'error_blocks') {
                    return (
                      <div key={i} className="mb-3 bg-red-950/20 border border-red-500/15 rounded-xl p-4 flex flex-col gap-2">
                        <div className="text-red-400 font-semibold flex items-center gap-1.5">
                          <span>❌</span> {log.text}
                        </div>
                        <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2 sm:gap-4 mt-1">
                          <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Expected Output</span>
                            <pre className="bg-[#050505] border border-white/5 rounded-lg p-3 text-emerald-400 font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                              {log.expected}
                            </pre>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Actual Output</span>
                            <pre className="bg-[#050505] border border-white/5 rounded-lg p-3 text-red-400 font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                              {log.actual}
                            </pre>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  
                  return (
                    <div key={i} className={`mb-1.5 font-mono text-sm leading-relaxed ${log.type === 'error' ? 'text-red-400' : log.type === 'result' ? 'text-emerald-400' : 'text-gray-300'}`}>
                      {log.type === 'error' ? '❌ ' : log.type === 'result' ? '' : '› '}
                      {typeof log.text === 'object' ? JSON.stringify(log.text) : log.text}
                    </div>
                  );
                })}
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
