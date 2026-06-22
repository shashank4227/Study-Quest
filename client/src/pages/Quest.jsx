import { useState, useEffect, useMemo } from 'react';
import CodeEditor from '../components/ui/CodeEditor';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, MessageSquare, Loader2, Trophy, TerminalSquare, ChevronLeft, ChevronRight, Activity, CheckCircle2 } from 'lucide-react';
import VisualizerEmbed from '../components/ui/VisualizerEmbed';
import WorldSidebar from '../components/quest/WorldSidebar';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../lib/api';
import { useAuthStore } from '../store/useAuthStore';
import { Joyride, STATUS } from 'react-joyride';

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

  const [challenges, setChallenges] = useState([]);
  const [activeChallengeIndex, setActiveChallengeIndex] = useState(0);
  const challenge = challenges[activeChallengeIndex];

  const starterLines = challenge?.starterCode?.split('\n') || [];
  const returnLine = starterLines.find(line => line.trim().startsWith('return'));

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
          setCurrentCode('');
        }
      } catch (err) {
        console.error("Error fetching quest data", err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [worldId, token, searchParams]);

  // Timer effect
  useEffect(() => {
    if (!challenge || showSuccess) return;
    const interval = setInterval(() => {
      setSessionStats(prev => ({
        ...prev,
        [challenge._id]: {
          ...(prev[challenge._id] || {}),
          timeSpent: (prev[challenge._id]?.timeSpent || 0) + 1
        }
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [challenge, showSuccess]);

  const formatTime = (seconds) => {
    if (!seconds) return '00:00';
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
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
    if (workerResult.type === 'error') return { success: false };

    let isSuccess = false;
    
    if (workerResult.type === 'test_cases') {
      isSuccess = workerResult.success;
    } else if (challenge?.world === 1 && challenge?.order === 1) {
      // First challenge just cares that the variable was created and has a value
      isSuccess = workerResult.result !== undefined && workerResult.result !== 'null' && workerResult.result !== '';
    } else {
      isSuccess = workerResult.result !== undefined && 
                  String(workerResult.result).trim() === String(challenge?.expectedOutput).trim();
    }

    // Update insights
    setSessionStats(prev => ({
      ...prev,
      [challenge._id]: {
        attempts: (prev[challenge._id]?.attempts || 0) + 1,
        successes: (prev[challenge._id]?.successes || 0) + (isSuccess ? 1 : 0),
        errors: (prev[challenge._id]?.errors || 0) + (!isSuccess ? 1 : 0)
      }
    }));

    if (isSuccess) {
      try {
        const res = await api.post('/progress/submit', {
          challengeId: challenge._id,
          isSuccess: true
        });
        
        if (res.data.success) {
          setRewardData(res.data);
          setShowSuccess(true);
          
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
      const expectedText = (challenge?.world === 1 && challenge?.order === 1) ? "any defined value" : challenge?.expectedOutput;
      return { success: false, expected: expectedText };
    }
  };

  const handleNextChallenge = () => {
    setShowSuccess(false);
    if (activeChallengeIndex < challenges.length - 1) {
      const nextIndex = activeChallengeIndex + 1;
      setActiveChallengeIndex(nextIndex);
      setCurrentCode('');
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
      setCurrentCode('');
      setAiResponse('');
      setActiveTab('description');
      setShowSuccess(false);
      setActiveRange(null);
    }
  };

  const [runTour, setRunTour] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  
  useEffect(() => {
    if (user && !loading && challenge && !localStorage.getItem(`quest_tour_seen_${user._id}`)) {
      setRunTour(true);
      setStepIndex(0);
    }
  }, [user, loading, challenge]);

  const handleJoyrideCallback = (data) => {
    const { action, index, status, type } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
    
    if (finishedStatuses.includes(status)) {
      setRunTour(false);
      localStorage.setItem(`quest_tour_seen_${user._id}`, 'true');
    } else if (type === 'step:after' || type === 'target:notFound') {
      setStepIndex(index + (action === 'prev' ? -1 : 1));
    }
  };

  const tourSteps = useMemo(() => [
    {
      target: '#tour-briefing',
      content: 'Welcome to the Quest interface! Your mission briefing and lore are located here.',
      disableBeacon: true,
    },
    {
      target: '#tour-visualizer',
      content: 'Stuck? Click the Visualizer to travel back in time and watch your code execute step-by-step.',
      disableBeacon: true,
    },
    {
      target: '#tour-editor',
      content: 'This is your magical grimoire. Write your spells (code) here.',
      disableBeacon: true,
    },
    {
      target: '#tour-execute',
      content: 'Click here or press Ctrl+Enter to cast your spell and see if you pass the challenge!',
      disableBeacon: true,
    },
    {
      target: '#tour-stats',
      content: 'Keep an eye on your attempts, errors, and time. Don\'t worry about failing—it\'s part of learning!',
      disableBeacon: true,
    }
  ], []);

  if (loading) return <div className="h-screen bg-[#050505] flex items-center justify-center"><Loader2 className="w-8 h-8 text-[#1591DC] animate-spin" /></div>;
  if (!challenge) return <div className="h-screen bg-[#050505] flex flex-col items-center justify-center text-white"><p>No challenges found for this world.</p><Link to="/map" className="mt-4 text-[#1591DC] hover:underline">Return to Map</Link></div>;

  const isLastChallenge = activeChallengeIndex === challenges.length - 1;

  return (
    <div className="h-screen bg-[#050505] text-white flex flex-col relative font-sans">
      
      <Joyride 
        steps={tourSteps} 
        run={runTour} 
        stepIndex={stepIndex}
        callback={handleJoyrideCallback} 
        continuous={true} 
        showSkipButton={true} 
        styles={{ 
          options: { 
            zIndex: 10000, 
            primaryColor: '#1591DC',
            backgroundColor: '#0a0a0a',
            textColor: '#fff',
            arrowColor: '#0a0a0a'
          },
          tooltip: {
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px'
          }
        }} 
      />

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
          <div className="flex items-center gap-2 text-white/50 text-xs font-mono font-bold tracking-widest bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
            Attempts: {sessionStats[challenge?._id]?.attempts || 0}
          </div>
          <div className="flex items-center gap-2 text-white/50 text-xs font-mono font-bold tracking-widest bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
            Errors: <span className={sessionStats[challenge?._id]?.errors > 0 ? "text-red-400" : ""}>{sessionStats[challenge?._id]?.errors || 0}</span>
          </div>
          <div className="flex items-center gap-2 text-white/50 text-xs font-mono font-bold tracking-widest bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
            ⏱ {formatTime(sessionStats[challenge?._id]?.timeSpent)}
          </div>
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
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-10 custom-scrollbar relative">
            <AnimatePresence mode="wait">
            {activeTab === 'description' ? (
              <motion.div 
                key="description"
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
                  <p className="text-white/80 leading-relaxed whitespace-pre-wrap font-medium text-sm">
                    {challenge.description}
                  </p>
                </div>
                
              </motion.div>
            ) : activeTab === 'visualizer' ? (
              <div className="absolute inset-0">
                <VisualizerEmbed 
                   code={currentCode} 
                   onActiveRangeChange={setActiveRange} 
                />
              </div>
            ) : null}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 flex flex-col bg-[#050505]">
          <CodeEditor 
            initialCode={currentCode} 
            onRunCode={handleRunCode}
            onCodeChange={setCurrentCode}
            appendedCode={returnLine}
            activeRange={activeRange}
            showSuccess={showSuccess}
            onNextQuest={handleNextChallenge}
            isLastChallenge={isLastChallenge}
            onReturnToMap={() => navigate('/map')}
            testCases={challenge?.testCases}
            challengeStats={sessionStats[challenge?._id]}
            formatTime={formatTime}
          />
        </div>
      </div>
    </div>
  );
};

export default Quest;
