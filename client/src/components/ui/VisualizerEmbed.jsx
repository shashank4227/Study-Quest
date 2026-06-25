import { memo, useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Type, Hash, ToggleLeft, Box, Play, Pause, SkipForward, SkipBack, RotateCcw } from 'lucide-react';
import { analyzeExecution } from '../../utils/codeParser';

const VisualizerEmbed = memo(({ code, onActiveRangeChange, course }) => {
  // We DO NOT append the locked return statement to the code string here. 
  // 'return' outside a function throws a SyntaxError in js-interpreter. 
  // The user only cares about visualizing their own code anyway!
  const finalCode = code;

  // Parse code into timeline of states
  const timeline = useMemo(() => {
    return analyzeExecution(finalCode, course);
  }, [finalCode, course]);

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playIntervalRef = useRef(null);

  // Sync active range to editor
  useEffect(() => {
    if (timeline.length > 0 && currentStep < timeline.length) {
      // Don't auto-highlight the last step while typing/idle
      if (currentStep === timeline.length - 1 && !isPlaying) {
        onActiveRangeChange(null);
      } else {
        onActiveRangeChange(timeline[currentStep].range);
      }
    } else {
      onActiveRangeChange(null);
    }
  }, [currentStep, timeline, onActiveRangeChange, isPlaying]);

  // Auto-update to show the latest execution state when code changes
  useEffect(() => {
    if (timeline.length > 0) {
      setCurrentStep(timeline.length - 1);
    } else {
      setCurrentStep(0);
    }
    setIsPlaying(false);
  }, [timeline]);

  // Playback logic
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= timeline.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 800); // 800ms per step
    } else {
      clearInterval(playIntervalRef.current);
    }
    return () => clearInterval(playIntervalRef.current);
  }, [isPlaying, timeline.length]);

  const handlePlayPause = () => {
    if (currentStep >= timeline.length - 1 && !isPlaying) {
      setCurrentStep(0); // Restart if at end
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const currentFrame = timeline[currentStep] || { memory: {} };
  const prevFrame = currentStep > 0 ? timeline[currentStep - 1] : { memory: {} };
  const variables = Object.entries(currentFrame.memory).map(([name, data]) => {
    const isChanged = prevFrame.memory[name] ? prevFrame.memory[name].value !== data.value : true;
    return {
      id: name,
      name,
      type: data.type,
      rawValue: data.value,
      isChanged
    };
  });

  const getTypeColor = (type) => {
    switch (type) {
      case 'string': return 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-400';
      case 'number': return 'from-blue-500/20 to-blue-500/5 border-blue-500/30 text-blue-400';
      case 'boolean': return 'from-purple-500/20 to-purple-500/5 border-purple-500/30 text-purple-400';
      case 'array': return 'from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-400';
      case 'object': return 'from-rose-500/20 to-rose-500/5 border-rose-500/30 text-rose-400';
      default: return 'from-white/10 to-white/5 border-white/20 text-white/70';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'string': return <Type className="w-3 h-3" />;
      case 'number': return <Hash className="w-3 h-3" />;
      case 'boolean': return <ToggleLeft className="w-3 h-3" />;
      case 'array': return <Database className="w-3 h-3" />;
      case 'object': return <Box className="w-3 h-3" />;
      default: return <Database className="w-3 h-3" />;
    }
  };

  const getStepInfo = (type, sourceCode, memory) => {
    if (!sourceCode) return { text: type ? 'Executing statement' : 'Ready', evaluatedCode: null };
    
    let code = sourceCode.replace(/\s+/g, ' ').trim();
    let evaluatedCode = code;

    // Substitute variables with their runtime values for clear evaluations
    if (memory) {
      Object.keys(memory).forEach(key => {
        const regex = new RegExp(`\\b${key}\\b`, 'g');
        const val = memory[key].value;
        if (memory[key].type === 'number' || memory[key].type === 'boolean' || memory[key].type === 'string') {
          evaluatedCode = evaluatedCode.replace(regex, val);
        }
      });
    }

    let text = 'Executing step';
    switch (type) {
      case 'VariableDeclaration': {
        const varName = code.split('=')[0].replace(/(var|let|const)/g, '').trim();
        text = `Creating variable '${varName}'`;
        break;
      }
      case 'AssignmentExpression': {
        const assignName = code.split('=')[0].trim();
        text = `Updating '${assignName}'`;
        break;
      }
      case 'BinaryExpression': 
      case 'LogicalExpression':
        text = `Evaluating Math/Logic`;
        break;
      case 'CallExpression': {
        const funcName = code.split('(')[0].trim();
        text = `Calling ${funcName}()`;
        break;
      }
      case 'ReturnStatement': 
        text = `Returning value`;
        break;
      case 'IfStatement': 
        text = `Condition Check`;
        break;
      case 'ForStatement': 
      case 'WhileStatement':
      case 'DoWhileStatement':
        text = `Looping step`;
        break;
      case 'UpdateExpression':
        text = `Increment/Decrement`;
        break;
      case 'ProgramEnd': 
        text = 'Execution finished';
        break;
      default: 
        text = 'Executing step';
    }
    
    return { text, evaluatedCode: evaluatedCode !== code ? evaluatedCode : null };
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] overflow-hidden">
      {/* Visualizer Header & Controls */}
      <div className="p-6 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent shrink-0">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 text-white">
            <div className="p-2.5 rounded-xl bg-[#1591DC]/10 border border-[#1591DC]/20">
              <Database className="w-5 h-5 text-[#1591DC]" />
            </div>
            <div>
              <h3 className="font-bold text-lg tracking-tight">Time-Machine Visualizer</h3>
              <p className="text-white/40 text-xs mt-1">Watch your code execute line by line.</p>
            </div>
          </div>
          
          <div className="bg-[#050505] border border-white/10 rounded-full flex items-center p-1 shadow-inner">
            <button onClick={handleReset} className="p-2 text-white/40 hover:text-white transition-colors" title="Reset">
              <RotateCcw className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} 
              disabled={currentStep === 0}
              className="p-2 text-white/40 hover:text-white disabled:opacity-20 transition-colors"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button 
              onClick={handlePlayPause}
              disabled={timeline.length === 0}
              className="p-3 bg-[#1591DC] hover:bg-[#127ABD] text-white rounded-full mx-1 shadow-[0_0_15px_rgba(21,145,220,0.4)] transition-all disabled:opacity-50"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>
            <button 
              onClick={() => setCurrentStep(Math.min(timeline.length - 1, currentStep + 1))} 
              disabled={currentStep >= timeline.length - 1}
              className="p-2 text-white/40 hover:text-white disabled:opacity-20 transition-colors"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Timeline Scrubber */}
        <div className="flex flex-col gap-3">
          {timeline.length > 0 && (() => {
            const info = getStepInfo(currentFrame.type, currentFrame.sourceCode, currentFrame.memory);
            
            // Attempt to safely evaluate the boolean result for coloring
            let booleanResult = null;
            if (info.evaluatedCode && (currentFrame.type.includes('Expression') || currentFrame.type.includes('Statement'))) {
              try {
                let expr = info.evaluatedCode;
                const match = expr.match(/(?:if|while|for)\s*\((.*?)\)/);
                if (match) expr = match[1];
                expr = expr.trim();
                
                // Only evaluate if it looks like safe math/logic (no letters except true/false)
                if (/^[0-9\s\.\+\-\*\/\%\=\!\<\>\&\|truefalse()]+$/.test(expr)) {
                   const res = new Function(`return ${expr}`)();
                   if (typeof res === 'boolean') booleanResult = res;
                }
              } catch (e) { /* ignore */ }
            }

            let boxColor = "bg-[#1591DC]/10 border-[#1591DC]/30 text-[#1591DC] shadow-[0_0_15px_rgba(21,145,220,0.1)]";
            if (booleanResult === true) boxColor = "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.15)]";
            else if (booleanResult === false) boxColor = "bg-red-500/10 border-red-500/30 text-red-400 shadow-[0_0_15px_rgba(248,113,113,0.15)]";

            return (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="text-[10px] font-mono text-white/50 tracking-widest uppercase flex items-center gap-2 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1591DC] animate-pulse" />
                    {info.text}
                  </div>
                  {currentFrame.sourceCode && (
                    <div className="px-2 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-xs text-white/80 max-w-md truncate">
                      {currentFrame.sourceCode}
                    </div>
                  )}
                </div>

                {info.evaluatedCode && (currentFrame.type.includes('Expression') || currentFrame.type.includes('Statement')) && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={`border rounded-lg p-3 flex flex-col gap-1 overflow-hidden transition-colors duration-300 ${boxColor}`}
                  >
                     <span className="text-[10px] uppercase font-bold tracking-wider currentColor">
                        {booleanResult === true ? 'Condition: True ✅' : booleanResult === false ? 'Condition: False ❌' : 'Runtime Evaluation'}
                     </span>
                     <span className="font-mono text-sm font-bold text-white tracking-wide break-all">{info.evaluatedCode}</span>
                  </motion.div>
                )}
              </div>
            );
          })()}
          {timeline.length > 0 && (
             <div className="relative w-full h-2 bg-white/5 rounded-full overflow-hidden mt-1">
               <motion.div 
                 className="absolute top-0 left-0 h-full bg-[#1591DC]"
                 initial={{ width: 0 }}
                 animate={{ width: `${(currentStep / (timeline.length - 1 || 1)) * 100}%` }}
                 transition={{ duration: 0.2 }}
               />
             </div>
          )}
        </div>
      </div>

      {/* Memory Heap */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {variables.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full flex flex-col items-center justify-center py-20 text-white/30 text-sm font-mono border-2 border-dashed border-white/5 rounded-2xl"
              >
                <Database className="w-8 h-8 mb-4 opacity-50" />
                <span>Memory is empty.</span>
                <span className="opacity-50 mt-1 text-xs">Press play to start execution.</span>
              </motion.div>
            )}
            {variables.map((v) => (
              <motion.div
                key={v.id}
                layout
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className={`bg-gradient-to-br ${getTypeColor(v.type)} border rounded-xl p-3 flex flex-col relative overflow-hidden transition-all duration-300 ${v.isChanged ? 'ring-2 ring-white/40 shadow-[0_0_15px_rgba(255,255,255,0.2)] scale-[1.02] z-10' : 'shadow-sm'}`}
              >
                <div className="flex items-center justify-between mb-2 border-b border-inherit pb-2">
                  <span className="font-mono font-bold text-xs tracking-widest">{v.name}</span>
                  <div className="flex items-center gap-1.5 opacity-80 bg-black/20 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                    {getTypeIcon(v.type)}
                    {v.type}
                  </div>
                </div>
                <div className="font-mono text-sm font-bold break-all">
                  {v.rawValue}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
});

export default VisualizerEmbed;
