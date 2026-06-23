import { useState, useEffect } from 'react';
import CodeEditor from '../components/ui/CodeEditor';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Loader2, TerminalSquare, ChevronLeft, ChevronRight, Activity, Play, Pause, RotateCcw, History, Clock } from 'lucide-react';
import VisualizerEmbed from '../components/ui/VisualizerEmbed';
import WorldSidebar from '../components/quest/WorldSidebar';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../lib/api';
import { useAuthStore } from '../store/useAuthStore';
import GuidedTour from '../components/ui/GuidedTour';
import ReactMarkdown from 'react-markdown';

const Quest = () => {
  const [searchParams] = useSearchParams();
  const worldId = searchParams.get('world') || 1;
  const navigate = useNavigate();
  const { token, user, setUser } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState('description');
  const [loading, setLoading] = useState(true);
  
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [currentCode, setCurrentCode] = useState('');
  const [activeRange, setActiveRange] = useState(null);

  const [showSuccess, setShowSuccess] = useState(false);
  const [rewardData, setRewardData] = useState(null);

  // Session stats for insights
  const [sessionStats, setSessionStats] = useState({});

  // Customizable timer
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [editingTimer, setEditingTimer] = useState(false);
  const [timerInput, setTimerInput] = useState('');

  // Run history for current challenge: array of { status, code, time }
  const [runHistory, setRunHistory] = useState([]);
  // All run history across all challenges from backend
  const [allRunHistory, setAllRunHistory] = useState([]);

  const MAX_ATTEMPTS = 5;
  const COOLDOWN_SECONDS = 30;
  const [sessionAttempts, setSessionAttempts] = useState(0);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  const [challenges, setChallenges] = useState([]);
  const [activeChallengeIndex, setActiveChallengeIndex] = useState(0);
  const challenge = challenges[activeChallengeIndex];

  const starterLines = challenge?.starterCode?.split('\n') || [];
  const returnLineIndex = starterLines.findIndex(line => line.trim().startsWith('return'));
  const returnLine = returnLineIndex !== -1 ? starterLines[returnLineIndex] : undefined;

  const defaultCode = challenge?.starterCode
    ? starterLines
        .filter((line, i) => i !== returnLineIndex && !line.includes('// Do not edit below'))
        .join('\n')
    : '';

  const draftCode = challenge ? localStorage.getItem(`draft_code_${challenge._id}`) : null;
  const displayCode = draftCode !== null ? draftCode : defaultCode;

  const handleCodeChange = (code) => {
    setCurrentCode(code);
    if (challenge) {
      localStorage.setItem(`draft_code_${challenge._id}`, code);
    }
  };

  const handleResetCode = () => {
    if (challenge) {
      localStorage.removeItem(`draft_code_${challenge._id}`);
      setSessionAttempts(0);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [challengeRes, progressRes] = await Promise.all([
          api.get(`/challenges?world=${worldId}`),
          api.get(`/progress`)
        ]);
        
        const allChallenges = challengeRes.data;
        const progress = progressRes.data;
        setChallenges(allChallenges);
        setAllRunHistory(progress?.challengeHistory || []);
        
        if (allChallenges.length > 0) {
          let targetIndex = 0;
          const challengeParam = searchParams.get('challenge');
          if (challengeParam !== null && !isNaN(challengeParam)) {
             targetIndex = parseInt(challengeParam, 10);
          } else {
             const uncompletedIndex = allChallenges.findIndex(c => !progress?.completedChallenges?.some(pc => pc._id === c._id || pc === c._id));
             targetIndex = uncompletedIndex !== -1 ? uncompletedIndex : 0;
          }
          setActiveChallengeIndex(targetIndex);
        }
      } catch (err) {
        console.error("Error fetching quest data", err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [worldId, token, searchParams]);

  // Controlled timer — only ticks when timerRunning is true
  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => setTimerSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  // Reset timer and load history when challenge changes
  useEffect(() => {
    setTimerSeconds(0);
    setTimerRunning(false);
    if (challenge) {
      const hist = allRunHistory.find(ch => ch.challengeId === challenge._id);
      setRunHistory(hist ? hist.runs : []);
      setSessionAttempts(0);
      setCooldownRemaining(0);
    } else {
      setRunHistory([]);
    }
  }, [challenge?._id, allRunHistory]);

  // Cooldown timer logic
  useEffect(() => {
    if (cooldownRemaining > 0) {
      const timer = setTimeout(() => setCooldownRemaining(r => r - 1), 1000);
      return () => clearTimeout(timer);
    } else if (cooldownRemaining === 0 && sessionAttempts >= MAX_ATTEMPTS) {
      setSessionAttempts(0); // Reset attempts after cooldown
    }
  }, [cooldownRemaining, sessionAttempts]);

  // Sync current code when challenge changes (loads draft or starter code)
  useEffect(() => {
    if (challenge) {
      setCurrentCode(displayCode);
    }
  }, [challenge?._id]);

  const formatTime = (seconds) => {
    if (!seconds) return '00:00';
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleTimerSet = (e) => {
    if (e.key === 'Enter' || e.type === 'blur') {
      const parts = timerInput.trim().split(':');
      if (parts.length === 2) {
        const mins = parseInt(parts[0]) || 0;
        const secs = parseInt(parts[1]) || 0;
        setTimerSeconds(mins * 60 + secs);
      } else if (parts.length === 1 && timerInput.trim()) {
        setTimerSeconds((parseInt(parts[0]) || 0) * 60);
      }
      setEditingTimer(false);
    }
    if (e.key === 'Escape') setEditingTimer(false);
  };

  const handleAskAI = async () => {
    if (!aiPrompt) return;
    setAiLoading(true);
    try {
      const res = await api.post('/ai/hint', {
        code: currentCode,
        question: aiPrompt,
        challengeContext: challenge?.description
      });
      setAiResponse(res.data.reply);
      setAiPrompt('');
    } catch (err) {
      setAiResponse("QuestMaster is currently meditating. (Ensure GEMINI_API_KEY is set in backend).");
    } finally {
      setAiLoading(false);
    }
  };

  const handleRunCode = async (workerResult) => {
    // Any new execution dismisses the success overlay so the console is visible
    setShowSuccess(false);

    // Track run result in history
    const runResult = workerResult.type === 'error' ? 'error' : null; // will be refined below

    let isSuccess = false;
    let customError = null;
    
    if (workerResult.type === 'test_cases') {
      isSuccess = workerResult.success;
    } else if (challenge?.world === 1 && challenge?.order === 1) {
      // Must be a non-empty, non-null, non-numeric, non-boolean string assignment
      // Worker returns null when result is undefined (unassigned variable)
      const r = workerResult.result;
      const isPresent = r !== null && r !== undefined;
      const isNonEmpty = isPresent && r.trim() !== '';
      const isNotReserved = !['null', 'undefined', 'true', 'false', 'NaN', 'Infinity', '-Infinity'].includes(r);
      const isNotNumeric = isPresent && isNaN(Number(r.trim())); // rejects "123", "3.14", "0"
      isSuccess = isPresent && isNonEmpty && isNotReserved && isNotNumeric;
    } else {
      isSuccess = workerResult.result !== undefined && 
                  String(workerResult.result).trim() === String(challenge?.expectedOutput).trim();
    }

    // Apply syntax validation rules if previous checks passed
    if (isSuccess && challenge?.validationRules?.length > 0) {
      const codeToValidate = workerResult.executedCode || '';
      for (const rule of challenge.validationRules) {
        if (rule.type === 'includes') {
          if (!codeToValidate.includes(rule.condition)) {
            isSuccess = false;
            customError = rule.message;
            break;
          }
        } else if (rule.type === 'excludes') {
          if (codeToValidate.includes(rule.condition)) {
            isSuccess = false;
            customError = rule.message;
            break;
          }
        } else if (rule.type === 'regex') {
          try {
            const regex = new RegExp(rule.condition);
            if (!regex.test(codeToValidate)) {
              isSuccess = false;
              customError = rule.message;
              break;
            }
          } catch (e) {
            console.error('Invalid regex in validation rule', e);
          }
        }
      }
    }
    
    // Increment session attempts and apply cooldown if it failed
    setSessionAttempts(prev => {
      const next = prev + 1;
      if (next >= MAX_ATTEMPTS && !isSuccess) {
        setCooldownRemaining(COOLDOWN_SECONDS);
      }
      return next;
    });

    // Always count the attempt regardless of error type
    setSessionStats(prev => ({
      ...prev,
      [challenge._id]: {
        ...(prev[challenge._id] || {}),
        successes: (prev[challenge._id]?.successes || 0) + (isSuccess ? 1 : 0),
        errors: (prev[challenge._id]?.errors || 0) + (!isSuccess ? 1 : 0)
      }
    }));

    // Track in run history
    const runInfo = { status: isSuccess ? 'success' : 'error', code: workerResult.executedCode, time: new Date().toLocaleTimeString() };
    setRunHistory(prev => [...prev, runInfo]);
    api.post('/progress/history', { challengeId: challenge._id, ...runInfo }).catch(console.error);

    if (isSuccess) {
      try {
        const res = await api.post('/progress/submit', {
          challengeId: challenge._id,
          isSuccess: true
        });
        
        if (res.data.success) {
          setRewardData(res.data);
          setShowSuccess(true);
          setTimerRunning(false);
          
          setUser({
            ...user,
            xp: res.data.totalXP,
            level: res.data.level
          });
        }
      } catch (err) {
        console.error("Progress submit failed", err);
      }
      return { success: true };
    } else {
      if (customError) {
        return { success: false, errorMessage: customError };
      }
      const expectedText = (challenge?.world === 1 && challenge?.order === 1) ? "any defined value" : challenge?.expectedOutput;
      return { success: false, expected: expectedText };
    }
  };

  const handleNextChallenge = () => {
    setShowSuccess(false);
    if (activeChallengeIndex < challenges.length - 1) {
      const nextIndex = activeChallengeIndex + 1;
      setActiveChallengeIndex(nextIndex);
      setAiResponse('');
      setActiveTab('description');
    } else {
      navigate('/map');
    }
  };

  const handleManualNav = (direction) => {
    let newIndex = activeChallengeIndex;
    if (direction === 'prev' && activeChallengeIndex > 0) {
      newIndex--;
    } else if (direction === 'next' && activeChallengeIndex < challenges.length - 1) {
      newIndex++;
    }
    
    if (newIndex !== activeChallengeIndex) {
      setActiveChallengeIndex(newIndex);
      setAiResponse('');
      setActiveTab('description');
      setShowSuccess(false);
      setActiveRange(null);
    }
  };

  const [runTour, setRunTour] = useState(false);
  
  useEffect(() => {
    if (user && !loading && challenge && !localStorage.getItem(`quest_tour_seen_${user._id}`)) {
      const timer = setTimeout(() => setRunTour(true), 600);
      return () => clearTimeout(timer);
    }
  }, [user, loading, challenge]);

  const handleTourFinish = () => {
    setRunTour(false);
    if (user) localStorage.setItem(`quest_tour_seen_${user._id}`, 'true');
  };

  const tourSteps = [
    { target: '#tour-briefing', content: 'Welcome to the Quest interface! Your mission briefing and challenge description are located here.' },
    { target: '#tour-visualizer', content: 'Stuck? Click the Visualizer to watch your code execute step-by-step in real time.' },
    { target: '#tour-editor', content: 'This is your code editor — your magical grimoire. Write your solution here.' },
    { target: '#tour-execute', content: 'Click Execute (or press Ctrl+Enter) to run your code and see if you pass the challenge!' },
    { target: '#tour-stats', content: "Keep an eye on your attempts, errors, and time. Failing is how you learn — don't worry!" },
  ];

  if (loading) return <div className="h-screen bg-[#050505] flex items-center justify-center"><Loader2 className="w-8 h-8 text-[#1591DC] animate-spin" /></div>;
  if (!challenge) return <div className="h-screen bg-[#050505] flex flex-col items-center justify-center text-white"><p>No challenges found for this world.</p><Link to="/map" className="mt-4 text-[#1591DC] hover:underline">Return to Map</Link></div>;

  const isLastChallenge = activeChallengeIndex === challenges.length - 1;

  return (
    <div className="h-screen bg-[#050505] text-white flex flex-col relative font-sans">
      
      <GuidedTour steps={tourSteps} run={runTour} onFinish={handleTourFinish} />

      {/* Header */}
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0a0a0a] shrink-0">
        <div className="flex items-center gap-6">
          <Link to="/map" className="text-white/40 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handleManualNav('prev')}
              disabled={activeChallengeIndex === 0}
              className="p-1 text-white/40 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="w-10 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs text-white/50">
              {activeChallengeIndex + 1}/{challenges.length}
            </div>
            <button 
              onClick={() => handleManualNav('next')}
              disabled={activeChallengeIndex === challenges.length - 1}
              className="p-1 text-white/40 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <h1 className="font-bold text-white tracking-tight ml-3">{challenge.title}</h1>
          </div>
        </div>
        
        <div id="tour-stats" className="flex items-center gap-3">

          {/* Customizable Stopwatch */}
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-full">
            <button
              onClick={() => setTimerRunning(r => !r)}
              disabled={showSuccess}
              className={`transition-colors ${showSuccess ? 'opacity-30 cursor-not-allowed text-white/50' : 'text-white/50 hover:text-white'}`}
              title={timerRunning ? 'Pause' : 'Start'}
            >
              {timerRunning
                ? <Pause className="w-3 h-3 fill-current" />
                : <Play className="w-3 h-3 fill-current" />}
            </button>
            {editingTimer ? (
              <input
                autoFocus
                value={timerInput}
                onChange={e => setTimerInput(e.target.value)}
                onKeyDown={handleTimerSet}
                onBlur={handleTimerSet}
                disabled={showSuccess}
                placeholder="MM:SS"
                className="w-14 text-center text-xs font-mono font-bold text-white bg-transparent outline-none border-b border-white/30"
              />
            ) : (
              <span
                onClick={() => { if(!showSuccess){ setTimerRunning(false); setEditingTimer(true); setTimerInput(''); } }}
                className={`text-xs font-mono font-bold tracking-widest select-none transition-colors ${showSuccess ? 'text-white/30 cursor-not-allowed' : 'text-white/70 cursor-pointer hover:text-white'}`}
                title="Click to set custom time"
              >
                {formatTime(timerSeconds)}
              </span>
            )}
            <button
              onClick={() => { setTimerSeconds(0); setTimerRunning(false); }}
              disabled={showSuccess}
              className={`transition-colors ${showSuccess ? 'opacity-30 cursor-not-allowed text-white/50' : 'text-white/50 hover:text-white'}`}
              title="Reset timer"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Run History */}
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full min-w-[80px]">
            {runHistory.length === 0 ? (
              <span className="text-white/25 text-xs font-mono">No runs yet</span>
            ) : (
              <div className="flex items-center gap-1 flex-wrap">
                {runHistory.slice(-12).map((run, i) => (
                  <div
                    key={i}
                    title={`Run ${i + 1}: ${run.status === 'success' ? 'Pass ✅' : 'Fail ❌'} at ${run.time}`}
                    className={`w-2 h-2 rounded-full transition-all ${
                      run.status === 'success'
                        ? 'bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.6)]'
                        : 'bg-red-400 shadow-[0_0_4px_rgba(248,113,113,0.6)]'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* XP Badge */}
          <div className="flex items-center gap-2 text-yellow-500 text-xs font-bold tracking-widest bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-full">
            <Sparkles className="w-3 h-3" />
            +{challenge.xpReward} XP
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 overflow-hidden flex bg-[#050505]">
        
        {/* Navigation Sidebar */}
        <WorldSidebar worldId={worldId} activeChallengeIndex={activeChallengeIndex} />

        {/* Left Panel */}
        <div className="w-1/3 min-w-[350px] border-r border-white/5 bg-[#0a0a0a] flex flex-col">
          <div className="flex border-b border-white/5 p-2 gap-1 overflow-x-auto custom-scrollbar shrink-0">

            <button 
              id="tour-briefing"
              className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === 'description' ? 'bg-[#1591DC]/20 text-[#1591DC] shadow-[inset_0_0_20px_rgba(21,145,220,0.1)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
              onClick={() => setActiveTab('description')}
            >
              <TerminalSquare className="w-4 h-4" />
              Briefing
            </button>

            <button
              id="tour-visualizer"
              onClick={() => setActiveTab('visualizer')}
              className={`flex-1 min-w-[110px] flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                activeTab === 'visualizer' ? 'bg-white/10 text-white shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]' : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <Activity className="w-4 h-4" />
              Visualizer
            </button>

            <button
              id="tour-history"
              onClick={() => setActiveTab('history')}
              className={`flex-1 min-w-[110px] flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                activeTab === 'history' ? 'bg-white/10 text-white shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]' : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <History className="w-4 h-4" />
              History
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-10 custom-scrollbar relative">
            <AnimatePresence mode="wait">
            {activeTab === 'description' ? (
              <motion.div 
                key={`description-${challenge._id}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="prose prose-invert max-w-none flex flex-col h-full"
              >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#1591DC]/20 border border-[#1591DC]/30 flex items-center justify-center shadow-[0_0_15px_rgba(21,145,220,0.15)]">
                      <TerminalSquare className="w-5 h-5 text-[#1591DC]" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white tracking-tight">Briefing</h2>
                      <p className="text-[#1591DC] text-xs font-medium">Your objective</p>
                    </div>
                </div>
                <div className="relative mt-1 mb-8">
                  <div className="text-white/80 leading-relaxed whitespace-pre-wrap font-medium text-sm prose-p:my-2 prose-strong:font-bold prose-strong:text-white prose-code:px-1.5 prose-code:py-0.5 prose-code:bg-white/10 prose-code:rounded-md prose-code:text-[#1591DC] prose-code:font-mono">
                    <ReactMarkdown>{challenge.description}</ReactMarkdown>
                  </div>
                </div>
                
              </motion.div>
            ) : activeTab === 'visualizer' ? (
              <div className="absolute inset-0">
                <VisualizerEmbed 
                   code={currentCode} 
                   onActiveRangeChange={setActiveRange} 
                />
              </div>
            ) : activeTab === 'history' ? (
              <motion.div 
                key={`history-${challenge._id}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex flex-col h-full"
              >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                      <History className="w-5 h-5 text-white/70" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white tracking-tight">Run History</h2>
                      <p className="text-white/40 text-xs font-medium">Previous executions</p>
                    </div>
                </div>
                
                {runHistory.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-white/30 text-sm">
                    <History className="w-8 h-8 mb-3 opacity-50" />
                    No runs yet. Execute code to see your history!
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar pb-4">
                    {[...runHistory].reverse().map((run, idx) => (
                      <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <div className={`flex items-center gap-2 text-xs font-bold px-2 py-1 rounded-md ${
                            run.status === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {run.status === 'success' ? 'Pass ✅' : 'Fail ❌'}
                          </div>
                          <div className="flex items-center gap-1.5 text-white/40 text-xs font-mono">
                            <Clock className="w-3 h-3" />
                            {run.time}
                          </div>
                        </div>
                        <div className="bg-[#050505] rounded-lg p-3 font-mono text-xs text-white/70 overflow-x-auto">
                          <pre>{run.code}</pre>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : null}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 flex flex-col bg-[#050505]">
          <CodeEditor 
            key={challenge._id}
            initialCode={displayCode}
            defaultCode={defaultCode}
            onReset={handleResetCode}
            onRunCode={handleRunCode}
            onCodeChange={handleCodeChange}
            appendedCode={returnLine}
            activeRange={activeRange}
            showSuccess={showSuccess}
            onNextQuest={handleNextChallenge}
            isLastChallenge={isLastChallenge}
            onReturnToMap={() => navigate('/map')}
            testCases={challenge?.testCases}
            challengeStats={sessionStats[challenge?._id]}
            formatTime={formatTime}
            timerSeconds={timerSeconds}
            sessionAttempts={sessionAttempts}
            maxAttempts={MAX_ATTEMPTS}
            cooldownRemaining={cooldownRemaining}
          />
        </div>
      </div>
    </div>
  );
};

export default Quest;
