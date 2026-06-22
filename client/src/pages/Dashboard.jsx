import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Trophy, CheckCircle2, Map, Target, Zap } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { getLevelProgress } from '../lib/xp';
import api from '../lib/api';
import GlassCard from '../components/ui/GlassCard';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import CircularProgress from '../components/ui/CircularProgress';
import LearningHeatmap from '../components/ui/LearningHeatmap';
import { staggerContainer, staggerItem } from '../components/effects/PageTransition';

const worldNames = { 1: 'Village of Variables', 2: 'Forest of Conditions', 3: 'Loop Mountains', 4: 'Function Kingdom', 5: 'Array Dragon Cave', 6: 'Object Empire', 7: 'Async Galaxy' };

const StatCard = ({ title, value, suffix, icon: Icon, delay }) => (
  <motion.div variants={staggerItem}>
    <GlassCard className="p-6 h-full flex flex-col justify-between border border-white/5 bg-[#0a0a0a]">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-[#1591DC]/10 flex items-center justify-center border border-[#1591DC]/20">
          <Icon className="w-6 h-6 text-[#1591DC]" />
        </div>
        <p className="text-xs font-bold text-white/50 uppercase tracking-widest">{title}</p>
      </div>
      <div>
        <p className="text-4xl font-bold text-white tracking-tight">
          <AnimatedCounter value={value} suffix={suffix} />
        </p>
      </div>
    </GlassCard>
  </motion.div>
);

const Dashboard = () => {
  const { user } = useAuthStore();
  const [progress, setProgress] = useState(null);
  const level = user?.level || 1;
  const xp = user?.xp || 0;
  const { current, needed, percent } = getLevelProgress(xp, level);
  const currentWorld = progress?.currentWorld || 1;
  const completed = progress?.completedChallenges?.length || 0;

  useEffect(() => {
    api.get('/progress').then(({ data }) => setProgress(data)).catch(() => {});
  }, []);

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-8 p-8 max-w-7xl mx-auto">
      
      {/* Hero Banner */}
      <motion.div variants={staggerItem} className="relative overflow-hidden rounded-3xl bg-[#0a0a0a] border border-white/10 p-10 text-white shadow-[0_0_50px_rgba(21,145,220,0.05)]">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1591DC]/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-8 z-10">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold tracking-widest text-[#1591DC] mb-6">
              <Zap className="w-3 h-3" /> LEVEL {level} EXPLORER
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-2">
              Welcome back to your <br />
              <span className="font-serif italic font-light text-5xl sm:text-6xl text-white/90">Adventure</span>
            </h1>
            
            <p className="text-white/50 text-lg mt-4 max-w-xl">
              You are currently exploring <span className="text-[#1591DC] font-semibold">{worldNames[currentWorld] || 'World Map'}</span>. Ready to defeat the next boss?
            </p>
          </div>

          <div className="shrink-0 w-full lg:w-auto flex flex-col gap-4">
            <Link to="/map">
              <button className="w-full lg:w-auto px-8 py-4 bg-[#1591DC] hover:bg-[#127ABD] text-white rounded-full font-bold transition-all shadow-[0_0_20px_rgba(21,145,220,0.3)] hover:shadow-[0_0_30px_rgba(21,145,220,0.5)]">
                Continue Journey
              </button>
            </Link>
            
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 w-full lg:w-72">
              <div className="flex justify-between text-xs text-white/50 font-bold tracking-widest mb-3">
                <span>XP TO NEXT LEVEL</span>
                <span className="text-white">{current} / {needed}</span>
              </div>
              <div className="h-2 bg-black rounded-full overflow-hidden border border-white/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#1591DC] to-blue-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total XP" value={xp} icon={Trophy} delay={0.1} />
        <StatCard title="Level" value={level} icon={CheckCircle2} delay={0.15} />
        <StatCard title="Day Streak" value={user?.currentStreak || 0} icon={Flame} delay={0.2} />
        <StatCard title="Solved" value={completed} icon={Target} delay={0.25} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heatmap */}
        <motion.div variants={staggerItem} className="lg:col-span-2">
          <GlassCard className="p-8 h-full border border-white/5 bg-[#0a0a0a]" hover={false}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Learning Activity</h3>
                <p className="text-sm text-white/50 mt-1">Your study consistency over time</p>
              </div>
            </div>
            <div className="filter drop-shadow-xl brightness-125 contrast-125 grayscale hover:grayscale-0 transition-all duration-500">
              <LearningHeatmap />
            </div>
          </GlassCard>
        </motion.div>

        {/* Circular Progress */}
        <motion.div variants={staggerItem}>
          <GlassCard className="p-8 h-full flex flex-col items-center border border-white/5 bg-[#0a0a0a]" hover={false}>
            <h3 className="text-xl font-bold text-white tracking-tight self-start mb-8">Overall Mastery</h3>
            <CircularProgress value={percent} label="to next level" sublabel={`Level ${level} → ${level + 1}`} />
            
            <div className="mt-8 w-full space-y-4">
              {[
                { label: 'Variables', pct: 85 },
                { label: 'Conditions', pct: 60 },
                { label: 'Loops', pct: 35 },
              ].map(({ label, pct }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs font-bold tracking-widest mb-2">
                    <span className="text-white/50">{label}</span>
                    <span className="text-[#1591DC]">{pct}%</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#1591DC]"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
