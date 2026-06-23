import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, TerminalSquare, CheckCircle2, Lock, Loader2, Menu, ChevronLeft, FileText } from 'lucide-react';
import api from '../../lib/api';
import { useAuthStore } from '../../store/useAuthStore';
import { theoryData } from '../../data/theoryData';

const WorldSidebar = ({ worldId, activeChallengeIndex = null, activeSection = null, refreshTrigger = 0 }) => {
  const { token } = useAuthStore();
  const location = useLocation();
  const isTheory = location.pathname.includes('/theory');
  
  const [challenges, setChallenges] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);

  const worldTheory = theoryData[worldId];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [challengeRes, progressRes] = await Promise.all([
          api.get(`/challenges?world=${worldId}`),
          api.get(`/progress`)
        ]);
        setChallenges(challengeRes.data);
        setProgress(progressRes.data);
      } catch (err) {
        console.error("Sidebar fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [worldId, token, refreshTrigger]);

  if (loading) return <div className="w-64 bg-[#0a0a0a] border-r border-white/5 flex items-center justify-center shrink-0 h-full"><Loader2 className="w-5 h-5 text-white/30 animate-spin" /></div>;

  if (!isOpen) {
    return (
      <div className="w-16 bg-[#0a0a0a] border-r border-white/5 flex flex-col shrink-0 h-full items-center py-4">
        <button onClick={() => setIsOpen(true)} className="p-2 hover:bg-white/10 rounded-xl text-white/50 hover:text-white transition-colors">
          <Menu className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col shrink-0 h-full overflow-y-auto custom-scrollbar">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-white tracking-tight">World {worldId}</h3>
          <p className="text-xs text-white/40">Navigation</p>
        </div>
        <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
      
      <div className="p-3">
        <Link 
          to={`/theory?world=${worldId}`} 
          className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isTheory && activeSection === null ? 'bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/30' : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'}`}
        >
          <BookOpen className="w-4 h-4 shrink-0" />
          <span className="text-sm font-bold">Theory Realm</span>
        </Link>
        
        {/* Render Theory Sections */}
        {worldTheory && worldTheory.sections && (
          <div className="ml-6 mt-1 space-y-1 border-l border-white/10 pl-3">
            {worldTheory.sections.map((sec, i) => {
              const isCurrentSection = isTheory && activeSection === i;
              return (
                <Link
                  key={i}
                  to={`/theory?world=${worldId}&section=${i}`}
                  className={`flex items-center gap-2 p-2 rounded-lg transition-all text-xs ${isCurrentSection ? 'bg-indigo-500/10 text-indigo-400 font-bold' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                >
                  <FileText className="w-3 h-3 shrink-0" />
                  <span className="truncate">{sec.title}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div className="px-4 py-2 mt-2">
        <div className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3">Quests</div>
        <div className="space-y-1">
          {challenges.map((c, i) => {
            const isCompleted = progress?.completedChallenges?.some(pc => pc._id === c._id || pc === c._id);
            const isCurrent = !isTheory && activeChallengeIndex === i;
            // A quest is accessible if it's the first one, or the previous one is completed
            const isAccessible = i === 0 || progress?.completedChallenges?.some(pc => pc._id === challenges[i-1]._id || pc === challenges[i-1]._id) || isCompleted;

            return (
              <Link 
                key={c._id}
                to={isAccessible ? `/quest?world=${worldId}&challenge=${i}` : '#'}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  isCurrent ? 'bg-[#1591DC]/20 text-[#1591DC] font-bold border border-[#1591DC]/30' : 
                  !isAccessible ? 'opacity-40 cursor-not-allowed text-white/40' :
                  'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
                onClick={(e) => { if (!isAccessible) e.preventDefault(); }}
              >
                {isCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : 
                 isCurrent ? <TerminalSquare className="w-4 h-4 shrink-0" /> :
                 !isAccessible ? <Lock className="w-4 h-4 shrink-0" /> :
                 <TerminalSquare className="w-4 h-4 shrink-0" />}
                <span className="text-sm truncate">{c.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WorldSidebar;
